import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CardForm } from '@/components/admin/CardForm';
import { useCards, useCreateCard, useUpdateCard, useDeleteCard, Card, CardInsert } from '@/hooks/useCards';
import { GlassButton } from '@/components/ui/GlassButton';
import { Plus, Pencil, Trash2, Check, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminCards() {
  const { data: cards = [], isLoading } = useCards();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery.toLowerCase();
    return cards.filter(card => 
      card.name.toLowerCase().includes(query) ||
      card.set_name.toLowerCase().includes(query) ||
      card.rarity.toLowerCase().includes(query) ||
      card.category?.name?.toLowerCase().includes(query)
    );
  }, [cards, searchQuery]);

  const handleCreate = async (data: CardInsert) => {
    try {
      await createCard.mutateAsync(data);
      toast.success('Card added successfully');
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add card');
    }
  };

  const handleUpdate = async (data: CardInsert) => {
    if (!editingCard) return;
    try {
      await updateCard.mutateAsync({ id: editingCard.id, ...data });
      toast.success('Card updated successfully');
      setEditingCard(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update card');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    try {
      await deleteCard.mutateAsync(id);
      toast.success('Card deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete card');
    }
  };

  const toggleAvailability = async (card: Card) => {
    try {
      await updateCard.mutateAsync({ id: card.id, available: !card.available });
      toast.success(`Card marked as ${!card.available ? 'available' : 'out of stock'}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update card');
    }
  };

  return (
    <AdminLayout title="Cards Management">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <GlassButton variant="primary" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Card
        </GlassButton>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border/50 rounded-lg 
                     text-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading cards...</div>
      ) : filteredCards.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'No cards match your search.' : 'No cards found. Add your first card!'}
          </p>
          {!searchQuery && (
            <GlassButton variant="primary" onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </GlassButton>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{card.name}</h3>
                  <p className="text-sm text-muted-foreground">{card.set_name}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      {card.rarity}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                      {card.condition}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {card.category?.name || 'No category'}
                    </span>
                  </div>
                </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-accent">₹{card.price.toLocaleString()}</p>
                    <button
                      onClick={() => toggleAvailability(card)}
                      className={`text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1 touch-manipulation ${
                        card.available
                          ? 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                          : 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                      } transition-colors`}
                    >
                      {card.available ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {card.available ? 'Available' : 'Out of Stock'}
                    </button>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingCard(card)}
                      className="p-2.5 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground touch-manipulation"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
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

      <CardForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={createCard.isPending}
      />

      <CardForm
        isOpen={!!editingCard}
        onClose={() => setEditingCard(null)}
        onSubmit={handleUpdate}
        initialData={editingCard}
        isLoading={updateCard.isPending}
      />
    </AdminLayout>
  );
}
