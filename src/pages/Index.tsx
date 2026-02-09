import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useCards } from "@/hooks/useCards";
import { useCategories } from "@/hooks/useCategories";
import { Sparkles, Shield, Crown, Gem } from "lucide-react";

const categoryIcons: Record<string, typeof Sparkles> = {
  "Pokémon": Sparkles,
  "Pokemon": Sparkles,
  "Yu-Gi-Oh!": Crown,
  "Yu-Gi-Oh": Crown,
  "Magic: The Gathering": Gem,
  "Magic": Gem,
  "One Piece": Shield,
};

export default function Index() {
  const { data: cards = [] } = useCards();
  const { data: categories = [] } = useCategories();
  
  const featuredCards = cards.filter((card) => card.featured && card.available).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, -40, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-secondary/10 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Premium TCG Collection</span>
              </motion.div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                <span className="text-foreground">India's Elite</span>
                <br />
                <span className="text-gradient">TCG Booking House</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                <span className="text-secondary font-semibold">Authentic</span> • 
                <span className="text-primary font-semibold"> Premium</span> • 
                <span className="text-accent font-semibold"> Collector-Only</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/collection">
                  <GlassButton variant="primary" size="lg" glowColor="cyan">
                    Explore Collection
                  </GlassButton>
                </Link>
                <Link to="/about">
                  <GlassButton variant="ghost" size="lg">
                    Learn More
                  </GlassButton>
                </Link>
              </div>
            </motion.div>

            {/* Hero Card Display */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Featured Card */}
                {featuredCards[0] && (
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <GlassCard className="p-6 glow-cyan max-w-sm mx-auto">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                        <img
                          src={featuredCards[0].image}
                          alt={featuredCards[0].name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/30 text-secondary backdrop-blur-md">
                            {featuredCards[0].rarity}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-foreground">
                        {featuredCards[0].name}
                      </h3>
                      <p className="text-muted-foreground">{featuredCards[0].set_name}</p>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Floating Mini Cards */}
                {featuredCards[1] && (
                  <motion.div
                    animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -top-10 -left-10 w-24 h-32"
                  >
                    <GlassCard className="w-full h-full overflow-hidden glow-gold">
                      <img
                        src={featuredCards[1].image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </GlassCard>
                  </motion.div>
                )}

                {featuredCards[2] && (
                  <motion.div
                    animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-5 -right-10 w-20 h-28"
                  >
                    <GlassCard className="w-full h-full overflow-hidden glow-purple">
                      <img
                        src={featuredCards[2].image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </GlassCard>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-foreground">Premium</span>{" "}
              <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated collection of the world's most sought-after trading cards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category, index) => {
              const Icon = categoryIcons[category.name] || Sparkles;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to="/collection">
                    <GlassCard
                      hover3D
                      glowOnHover
                      glowColor="cyan"
                      className="p-8 text-center cursor-pointer"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-primary/20">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Explore Collection →
                      </p>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Cards Section */}
      {featuredCards.length > 0 && (
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-foreground">Featured</span>{" "}
                <span className="text-gradient-gold">Grails</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The crown jewels of our collection — investment-grade pieces for serious collectors
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/card/${card.id}`}>
                    <GlassCard
                      hover3D
                      glowOnHover
                      glowColor="gold"
                      className="overflow-hidden cursor-pointer h-full"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-gradient-to-r from-secondary/30 to-accent/30">
                          <Sparkles className="w-3 h-3 inline mr-1 text-secondary" />
                          <span className="text-gradient-gold">{card.rarity}</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1">
                          {card.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{card.category?.name || 'Uncategorized'}</p>
                        <p className="font-serif text-xl font-bold text-secondary">
                          ₹{card.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/collection">
                <GlassButton variant="secondary" size="lg" glowColor="gold">
                  View Full Collection
                </GlassButton>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <GlassCard className="p-8 md:p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Shield className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                Authenticity Guaranteed
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Every card in our collection is verified for authenticity. We work only with 
                trusted sources and provide detailed condition reports for all pieces.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Verified Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">Condition Graded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Secure Booking</span>
                </div>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    </Layout>
  );
}
