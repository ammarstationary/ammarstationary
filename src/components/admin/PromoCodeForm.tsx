import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { motion, AnimatePresence } from 'framer-motion';
import { PromoCode, PromoCodeInsert } from '@/hooks/useAdminPromoCodes';

interface PromoCodeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromoCodeInsert) => Promise<void>;
  initialData?: PromoCode | null;
  isLoading: boolean;
}

export function PromoCodeForm({ isOpen, onClose, onSubmit, initialData, isLoading }: PromoCodeFormProps) {
  const [formData, setFormData] = useState<PromoCodeInsert>({
    code: '',
    discount_percent: 10,
    active: true,
    usage_limit: null,
    expires_at: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        discount_percent: initialData.discount_percent,
        active: initialData.active,
        usage_limit: initialData.usage_limit,
        expires_at: initialData.expires_at ? initialData.expires_at.split('T')[0] : null,
      });
    } else {
      setFormData({
        code: '',
        discount_percent: 10,
        active: true,
        usage_limit: null,
        expires_at: null,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-card p-6 m-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-foreground">
                  {initialData ? 'Edit Promo Code' : 'Add New Promo Code'}
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
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50 uppercase"
                    placeholder="e.g., SAVE20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Discount Percentage *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({ ...formData, discount_percent: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Usage Limit (leave empty for unlimited)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usage_limit || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      usage_limit: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50"
                    placeholder="Unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Expiration Date (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expires_at || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      expires_at: e.target.value || null 
                    })}
                    className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded border-border/50 bg-background/50 text-primary 
                             focus:ring-primary/50"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-foreground">
                    Active
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
