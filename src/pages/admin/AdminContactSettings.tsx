import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { GlassButton } from '@/components/ui/GlassButton';
import { useContactSettings, useUpdateContactSetting } from '@/hooks/useContactSettings';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const settingLabels: Record<string, string> = {
  instagram_handle: 'Instagram Handle',
  instagram_url: 'Instagram URL',
  email: 'Email Address',
  location: 'Location Info',
  response_time: 'Response Time Info',
};

export default function AdminContactSettings() {
  const { data: settings, isLoading } = useContactSettings();
  const updateSetting = useUpdateContactSetting();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      const promises = Object.entries(formData).map(([key, value]) => {
        if (settings && settings[key] !== value) {
          return updateSetting.mutateAsync({ key, value });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      toast({ title: 'Contact settings updated successfully!' });
    } catch {
      toast({ title: 'Error updating settings', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Contact Settings">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contact Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 max-w-2xl"
      >
        <div className="space-y-4">
          {Object.entries(settingLabels).map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm text-muted-foreground mb-2">{label}</label>
              <input
                type="text"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                         text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <GlassButton
            variant="primary"
            onClick={handleSave}
            disabled={updateSetting.isPending}
          >
            {updateSetting.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Changes</>
            )}
          </GlassButton>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
