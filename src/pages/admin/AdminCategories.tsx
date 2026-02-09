import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, Category } from '@/hooks/useCategories';
import { GlassButton } from '@/components/ui/GlassButton';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminCategories() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      await createCategory.mutateAsync(newName.trim());
      toast.success('Category added successfully');
      setNewName('');
      setIsAdding(false);
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        toast.error('Category already exists');
      } else {
        toast.error(error.message || 'Failed to add category');
      }
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      await updateCategory.mutateAsync({ id, name: editName.trim() });
      toast.success('Category updated successfully');
      setEditingId(null);
      setEditName('');
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        toast.error('Category already exists');
      } else {
        toast.error(error.message || 'Failed to update category');
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? Cards in this category will be uncategorized.`)) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <AdminLayout title="Categories Management">
      <div className="mb-6">
        {isAdding ? (
          <div className="glass-card p-4 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              className="flex-1 px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                       text-foreground focus:outline-none focus:border-primary/50"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <div className="flex gap-2">
              <GlassButton variant="primary" onClick={handleCreate} disabled={createCategory.isPending}>
                <Check className="w-4 h-4 mr-2" />
                Add
              </GlassButton>
              <GlassButton variant="secondary" onClick={() => { setIsAdding(false); setNewName(''); }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </GlassButton>
            </div>
          </div>
        ) : (
          <GlassButton variant="primary" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Category
          </GlassButton>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground mb-4">No categories found. Add your first category!</p>
          <GlassButton variant="primary" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </GlassButton>
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4"
            >
              {editingId === category.id ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-4 py-3 bg-background/50 border border-border/50 rounded-lg 
                             text-foreground focus:outline-none focus:border-primary/50"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdate(category.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <div className="flex gap-2">
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdate(category.id)}
                      disabled={updateCategory.isPending}
                    >
                      <Check className="w-4 h-4" />
                    </GlassButton>
                    <GlassButton variant="secondary" size="sm" onClick={cancelEdit}>
                      <X className="w-4 h-4" />
                    </GlassButton>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground truncate">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(category)}
                      className="p-2.5 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground touch-manipulation"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-2.5 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
