import { AdminLayout } from '@/components/admin/AdminLayout';
import { useCards } from '@/hooks/useCards';
import { useCategories } from '@/hooks/useCategories';
import { CreditCard, FolderOpen, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { data: cards = [] } = useCards();
  const { data: categories = [] } = useCategories();

  const availableCards = cards.filter(c => c.available).length;
  const outOfStockCards = cards.filter(c => !c.available).length;

  const stats = [
    { label: 'Total Cards', value: cards.length, icon: CreditCard, color: 'text-primary' },
    { label: 'Categories', value: categories.length, icon: FolderOpen, color: 'text-accent' },
    { label: 'Available', value: availableCards, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Out of Stock', value: outOfStockCards, icon: XCircle, color: 'text-destructive' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 lg:p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 mt-6"
      >
        <h2 className="text-lg font-display font-bold text-foreground mb-4">
          Recent Cards
        </h2>
        {cards.length === 0 ? (
          <p className="text-muted-foreground">No cards added yet.</p>
        ) : (
          <div className="space-y-3">
            {cards.slice(0, 5).map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-12 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{card.name}</p>
                  <p className="text-sm text-muted-foreground">{card.category?.name || 'No category'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-accent">₹{card.price.toLocaleString()}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      card.available
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {card.available ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
