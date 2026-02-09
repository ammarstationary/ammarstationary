import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Service, ServiceInsert } from '@/hooks/useServices';

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceInsert) => Promise<void>;
  initialData?: Service | null;
  isLoading: boolean;
}

export function ServiceForm({ isOpen, onClose, onSubmit, initialData, isLoading }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceInsert>({
    name: '',
    description: '',
    price: null,
    image: '',
    available: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        price: initialData.price,
        image: initialData.image || '',
        available: initialData.available,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: null,
        image: '',
        available: true,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      price: formData.price || null,
      image: formData.image || null,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="glass-card p-6 m-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-foreground">
                  {initialData ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50"
                    placeholder="e.g., Book Binding"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50 resize-none"
                    placeholder="Describe the service..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      price: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50"
                    placeholder="Leave empty for 'Contact for price'"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 rounded border-border/50 bg-background/50 text-primary 
                             focus:ring-primary/50"
                  />
                  <label htmlFor="available" className="text-sm font-medium text-foreground">
                    Available
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <GlassButton type="button" variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </GlassButton>
                  <GlassButton type="submit" variant="primary" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
                  </GlassButton>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
