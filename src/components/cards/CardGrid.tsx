import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { CardWithCategory } from "@/types/card";
import { Sparkles } from "lucide-react";

interface CardGridProps {
  cards: CardWithCategory[];
}

const rarityColors: Record<string, string> = {
  Common: "text-muted-foreground",
  Uncommon: "text-foreground",
  Rare: "text-primary",
  "Ultra Rare": "text-accent",
  "Secret Rare": "text-secondary",
  Grail: "text-gradient-gold",
};

const rarityBg: Record<string, string> = {
  Common: "bg-muted/50",
  Uncommon: "bg-foreground/10",
  Rare: "bg-primary/20",
  "Ultra Rare": "bg-accent/20",
  "Secret Rare": "bg-secondary/20",
  Grail: "bg-gradient-to-r from-secondary/30 to-accent/30",
};

export function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Link to={`/card/${card.id}`}>
            <GlassCard
              hover3D
              glowOnHover
              glowColor={card.rarity === "Grail" ? "gold" : card.rarity === "Secret Rare" ? "gold" : "cyan"}
              className="overflow-hidden cursor-pointer h-full"
            >
              {/* Card Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                
                {/* Rarity Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${rarityBg[card.rarity] || 'bg-muted/50'}`}>
                  {card.rarity === "Grail" && <Sparkles className="w-3 h-3 inline mr-1" />}
                  <span className={rarityColors[card.rarity] || 'text-foreground'}>{card.rarity}</span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1">
                    {card.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{card.set_name}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-serif text-xl font-bold text-secondary">
                    ₹{card.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50">
                    {card.condition}
                  </span>
                </div>

                <GlassButton
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={(e) => e.preventDefault()}
                >
                  View Details
                </GlassButton>
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
