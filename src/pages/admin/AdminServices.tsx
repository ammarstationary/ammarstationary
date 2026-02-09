import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { 
  useServices, 
  useCreateService, 
  useUpdateService, 
  useDeleteService,
  Service,
  ServiceInsert 
} from '@/hooks/useServices';
import { GlassButton } from '@/components/ui/GlassButton';
import { Plus, Pencil, Trash2, Search, Check, X, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminServices() {
  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const query = searchQuery.toLowerCase();
    return services.filter(service => 
      service.name.toLowerCase().includes(query) ||
      service.description?.toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  const handleCreate = async (data: ServiceInsert) => {
    try {
      await createService.mutateAsync(data);
      setIsFormOpen(false);
    } catch (error: any) {
      // Error handled in hook
    }
  };

  const handleUpdate = async (data: ServiceInsert) => {
    if (!editingService) return;
    try {
      await updateService.mutateAsync({ id: editingService.id, ...data });
      setEditingService(null);
    } catch (error: any) {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService.mutateAsync(id);
    } catch (error: any) {
      // Error handled in hook
    }
  };

  const toggleAvailability = async (service: Service) => {
    try {
      await updateService.mutateAsync({ id: service.id, available: !service.available });
      toast.success(`Service marked as ${!service.available ? 'available' : 'unavailable'}`);
    } catch (error: any) {
      // Error handled in hook
    }
  };

  return (
    <AdminLayout title="Services Management">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <GlassButton variant="primary" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </GlassButton>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                     text-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading services...</div>
      ) : filteredServices.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'No services match your search.' : 'No services found. Add your first service!'}
          </p>
          {!searchQuery && (
            <GlassButton variant="primary" onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </GlassButton>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-8 h-8 text-primary" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-accent">
                      {service.price ? `₹${service.price.toLocaleString()}` : 'Contact for price'}
                    </p>
                    <button
                      onClick={() => toggleAvailability(service)}
                      className={`text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1 touch-manipulation ${
                        service.available
                          ? 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                          : 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                      } transition-colors`}
                    >
                      {service.available ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {service.available ? 'Available' : 'Unavailable'}
                    </button>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-2.5 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground touch-manipulation"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2.5 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ServiceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={createService.isPending}
      />

      <ServiceForm
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        onSubmit={handleUpdate}
        initialData={editingService}
        isLoading={updateService.isPending}
      />
    </AdminLayout>
  );
}
