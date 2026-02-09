import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { CardGrid } from "@/components/cards/CardGrid";
import { CategoryFilter } from "@/components/cards/CategoryFilter";
import { useCards } from "@/hooks/useCards";
import { useCategories } from "@/hooks/useCategories";
import { Search, Loader2 } from "lucide-react";

const rarities = ["All", "Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Grail"] as const;

export default function Collection() {
  const { data: cards = [], isLoading: cardsLoading } = useCards();
  const { data: categoriesData = [] } = useCategories();
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    return ["All", ...categoriesData.map(c => c.name)];
  }, [categoriesData]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (!card.available) return false;
      const matchesCategory = selectedCategory === "All" || card.category?.name === selectedCategory;
      const matchesRarity = selectedRarity === "All" || card.rarity === selectedRarity;
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.set_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesRarity && matchesSearch;
    });
  }, [cards, selectedCategory, selectedRarity, searchQuery]);

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-foreground">Our</span>{" "}
              <span className="text-gradient">Products</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our curated selection of premium products
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/30 border border-border backdrop-blur-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 mb-12"
          >
            <div>
              <h3 className="text-sm font-medium text-muted-foreground text-center mb-4">Category</h3>
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground text-center mb-4">Rarity</h3>
              <CategoryFilter
                categories={[...rarities]}
                selected={selectedRarity}
                onSelect={setSelectedRarity}
              />
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <p className="text-muted-foreground">
              Showing <span className="text-primary font-semibold">{filteredCards.length}</span> products
            </p>
          </motion.div>

          {/* Card Grid */}
          {cardsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCards.length > 0 ? (
            <CardGrid cards={filteredCards} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">No products found matching your criteria</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
