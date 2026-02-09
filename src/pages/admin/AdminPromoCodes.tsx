import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PromoCodeForm } from '@/components/admin/PromoCodeForm';
import { 
  usePromoCodes, 
  useCreatePromoCode, 
  useUpdatePromoCode, 
  useDeletePromoCode,
  PromoCode,
  PromoCodeInsert 
} from '@/hooks/useAdminPromoCodes';
import { GlassButton } from '@/components/ui/GlassButton';
import { Plus, Pencil, Trash2, Search, Tag, TrendingUp, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function AdminPromoCodes() {
  const { data: promoCodes = [], isLoading } = usePromoCodes();
  const createPromoCode = useCreatePromoCode();
  const updatePromoCode = useUpdatePromoCode();
  const deletePromoCode = useDeletePromoCode();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPromoCodes = useMemo(() => {
    if (!searchQuery.trim()) return promoCodes;
    const query = searchQuery.toLowerCase();
    return promoCodes.filter(code => 
      code.code.toLowerCase().includes(query)
    );
  }, [promoCodes, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalCodes = promoCodes.length;
    const activeCodes = promoCodes.filter(c => c.active).length;
    const totalUsage = promoCodes.reduce((sum, c) => sum + c.usage_count, 0);
    const expiredCodes = promoCodes.filter(c => 
      c.expires_at && new Date(c.expires_at) < new Date()
    ).length;

    return { totalCodes, activeCodes, totalUsage, expiredCodes };
  }, [promoCodes]);

  const handleCreate = async (data: PromoCodeInsert) => {
    try {
      await createPromoCode.mutateAsync(data);
      setIsFormOpen(false);
    } catch (error: any) {
      // Error handled in hook
    }
  };

  const handleUpdate = async (data: PromoCodeInsert) => {
    if (!editingPromoCode) return;
    try {
      await updatePromoCode.mutateAsync({ id: editingPromoCode.id, ...data });
      setEditingPromoCode(null);
    } catch (error: any) {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      await deletePromoCode.mutateAsync(id);
    } catch (error: any) {
      // Error handled in hook
    }
  };

  const toggleActive = async (promoCode: PromoCode) => {
    try {
      await updatePromoCode.mutateAsync({ id: promoCode.id, active: !promoCode.active });
      toast.success(`Promo code ${!promoCode.active ? 'activated' : 'deactivated'}`);
    } catch (error: any) {
      // Error handled in hook
    }
  };

  const getStatus = (promoCode: PromoCode) => {
    if (!promoCode.active) return { label: 'Inactive', class: 'bg-muted text-muted-foreground' };
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      return { label: 'Expired', class: 'bg-destructive/20 text-destructive' };
    }
    if (promoCode.usage_limit && promoCode.usage_count >= promoCode.usage_limit) {
      return { label: 'Limit Reached', class: 'bg-amber-400/20 text-amber-400' };
    }
    return { label: 'Active', class: 'bg-green-400/20 text-green-400' };
  };

  return (
    <AdminLayout title="Promo Codes">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalCodes}</p>
              <p className="text-sm text-muted-foreground">Total Codes</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-400/20">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.activeCodes}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalUsage}</p>
              <p className="text-sm text-muted-foreground">Total Usage</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <Calendar className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.expiredCodes}</p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <GlassButton variant="primary" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Promo Code
        </GlassButton>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search promo codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                     text-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Promo Codes List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading promo codes...</div>
      ) : filteredPromoCodes.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'No promo codes match your search.' : 'No promo codes found. Create your first one!'}
          </p>
          {!searchQuery && (
            <GlassButton variant="primary" onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Promo Code
            </GlassButton>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPromoCodes.map((promoCode, index) => {
            const status = getStatus(promoCode);
            return (
              <motion.div
                key={promoCode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <Tag className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-lg text-foreground">{promoCode.code}</h3>
                      <p className="text-sm text-accent font-semibold">{promoCode.discount_percent}% off</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Usage</p>
                      <p className="font-medium text-foreground">
                        {promoCode.usage_count} / {promoCode.usage_limit || '∞'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium text-foreground">
                        {promoCode.expires_at 
                          ? format(new Date(promoCode.expires_at), 'MMM d, yyyy')
                          : 'Never'}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-muted-foreground">Status</p>
                      <button
                        onClick={() => toggleActive(promoCode)}
                        className={`text-xs px-2 py-1 rounded-full ${status.class} hover:opacity-80 transition-opacity`}
                      >
                        {status.label}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingPromoCode(promoCode)}
                      className="p-2.5 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground touch-manipulation"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(promoCode.id)}
                      className="p-2.5 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Forms */}
      <PromoCodeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={createPromoCode.isPending}
      />

      <PromoCodeForm
        isOpen={!!editingPromoCode}
        onClose={() => setEditingPromoCode(null)}
        onSubmit={handleUpdate}
        initialData={editingPromoCode}
        isLoading={updatePromoCode.isPending}
      />
    </AdminLayout>
  );
}
