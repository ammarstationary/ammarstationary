import { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassButton } from '@/components/ui/GlassButton';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import type { Card, CardInsert } from '@/hooks/useCards';

interface CardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (card: CardInsert) => void;
  initialData?: Card | null;
  isLoading?: boolean;
}

const rarities = ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare', 'Grail'] as const;
const conditions = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Played'] as const;

export function CardForm({ isOpen, onClose, onSubmit, initialData, isLoading }: CardFormProps) {
  const { data: categories = [] } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<CardInsert>({
    name: '',
    set_name: '',
    rarity: 'Common',
    condition: 'Mint',
    price: 0,
    image: '',
    images: [],
    category_id: null,
    collector_notes: '',
    featured: false,
    available: true,
  });

  useEffect(() => {
    if (initialData) {
      const initialImages = initialData.images?.length > 0 
        ? initialData.images 
        : initialData.image ? [initialData.image] : [];
      setFormData({
        name: initialData.name,
        set_name: initialData.set_name,
        rarity: initialData.rarity,
        condition: initialData.condition,
        price: initialData.price,
        image: initialData.image,
        images: initialImages,
        category_id: initialData.category_id,
        collector_notes: initialData.collector_notes || '',
        featured: initialData.featured,
        available: initialData.available,
      });
      setImages(initialImages);
    } else {
      setFormData({
        name: '',
        set_name: '',
        rarity: 'Common',
        condition: 'Mint',
        price: 0,
        image: '',
        images: [],
        category_id: null,
        collector_notes: '',
        featured: false,
        available: true,
      });
      setImages([]);
    }
  }, [initialData, isOpen]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('card-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('card-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }
      
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      setFormData({ 
        ...formData, 
        image: newImages[0] || '', 
        images: newImages 
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData({ 
      ...formData, 
      image: newImages[0] || '', 
      images: newImages 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      image: images[0] || '',
      images: images,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-foreground">
                  {initialData ? 'Edit Card' : 'Add New Card'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Set *</label>
                  <input
                    type="text"
                    value={formData.set_name}
                    onChange={(e) => setFormData({ ...formData, set_name: e.target.value })}
                    className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Rarity *</label>
                    <select
                      value={formData.rarity}
                      onChange={(e) => setFormData({ ...formData, rarity: e.target.value as Card['rarity'] })}
                      className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                               text-foreground focus:outline-none focus:border-primary/50"
                    >
                      {rarities.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Condition *</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value as Card['condition'] })}
                      className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                               text-foreground focus:outline-none focus:border-primary/50"
                    >
                      {conditions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                               text-foreground focus:outline-none focus:border-primary/50"
                      required
                      min={0}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Category</label>
                    <select
                      value={formData.category_id || ''}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value || null })}
                      className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                               text-foreground focus:outline-none focus:border-primary/50"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Multiple Image Upload */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Card Images * (First image is the main image)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Card image ${index + 1}`}
                            className={`w-full h-24 object-cover rounded-lg border ${
                              index === 0 ? 'border-primary' : 'border-border/50'
                            }`}
                          />
                          {index === 0 && (
                            <span className="absolute top-1 left-1 text-xs px-1.5 py-0.5 bg-primary text-primary-foreground rounded">
                              Main
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-destructive/80 hover:bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-24 border-2 border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    {uploading ? (
                      <span className="text-primary animate-pulse">Uploading...</span>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {images.length > 0 ? 'Add more images' : 'Click to upload images'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Collector Notes</label>
                  <textarea
                    value={formData.collector_notes || ''}
                    onChange={(e) => setFormData({ ...formData, collector_notes: e.target.value })}
                    className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50 resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-border/50 bg-background/50 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="w-4 h-4 rounded border-border/50 bg-background/50 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">Available</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <GlassButton type="button" variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </GlassButton>
                  <GlassButton 
                    type="submit" 
                    variant="primary" 
                    className="flex-1" 
                    disabled={isLoading || uploading || images.length === 0}
                  >
                    {isLoading ? 'Saving...' : initialData ? 'Update Card' : 'Add Card'}
                  </GlassButton>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}