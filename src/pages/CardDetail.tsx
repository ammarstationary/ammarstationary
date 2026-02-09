import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { BookingModal } from "@/components/booking/BookingModal";
import { useCards } from "@/hooks/useCards";
import { ArrowLeft, Sparkles, Shield, AlertTriangle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const rarityColors: Record<string, string> = {
  Common: "text-muted-foreground",
  Uncommon: "text-foreground",
  Rare: "text-primary",
  "Ultra Rare": "text-accent",
  "Secret Rare": "text-secondary",
  Grail: "text-gradient-gold",
};

export default function CardDetail() {
  const { id } = useParams();
  const { data: cards = [], isLoading } = useCards();
  const card = cards.find((c) => c.id === id);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images - combine main image with additional images
  const allImages = card ? [card.image, ...(card.images || [])].filter(Boolean) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!card) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Card Not Found</h1>
          <Link to="/collection">
            <GlassButton variant="primary">Back to Collection</GlassButton>
          </Link>
        </div>
      </Layout>
    );
  }

  const rarity = card.rarity as keyof typeof rarityColors;

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/collection" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Collection</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Hero Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <GlassCard 
                glowColor={rarity === "Grail" || rarity === "Secret Rare" ? "gold" : "cyan"}
                className="p-0 overflow-hidden"
              >
                <div className="relative aspect-[3/4] overflow-hidden touch-pan-y">
                  {/* Main Image with Animation and Swipe Gestures */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={allImages[currentImageIndex]}
                      alt={`${card.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      drag={allImages.length > 1 ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, info) => {
                        const threshold = 50;
                        if (info.offset.x > threshold) {
                          prevImage();
                        } else if (info.offset.x < -threshold) {
                          nextImage();
                        }
                      }}
                    />
                  </AnimatePresence>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Rarity Badge */}
                  <div className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md bg-background/50 border border-border/50">
                    {(rarity === "Grail" || rarity === "Secret Rare") && (
                      <Sparkles className="w-4 h-4 inline mr-2 text-secondary" />
                    )}
                    <span className={`font-semibold ${rarityColors[rarity] || 'text-foreground'}`}>
                      {card.rarity}
                    </span>
                  </div>

                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/70 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/70 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-md bg-background/70 border border-border/50">
                      <span className="text-sm font-medium text-foreground">
                        {currentImageIndex + 1} / {allImages.length}
                      </span>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex
                          ? "border-primary ring-2 ring-primary/30 scale-105"
                          : "border-border/50 hover:border-primary/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${card.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Card Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Title & Price */}
              <div>
                <span className="text-primary font-medium">{card.category?.name || 'Uncategorized'}</span>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
                  {card.name}
                </h1>
                <p className="font-serif text-3xl md:text-4xl font-bold text-secondary">
                  ₹{card.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Info Card */}
              <GlassCard className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Set</p>
                    <p className="font-semibold text-foreground">{card.set_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Condition</p>
                    <p className="font-semibold text-foreground">{card.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rarity</p>
                    <p className={`font-semibold ${rarityColors[rarity] || 'text-foreground'}`}>{card.rarity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-semibold text-foreground">{card.category?.name || 'Uncategorized'}</p>
                  </div>
                </div>

                {card.collector_notes && (
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Collector Notes</p>
                    <p className="text-foreground">{card.collector_notes}</p>
                  </div>
                )}
              </GlassCard>

              {/* Authenticity Badge */}
              <GlassCard className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Authenticity Verified</p>
                  <p className="text-sm text-muted-foreground">This card has been professionally verified</p>
                </div>
              </GlassCard>

              {/* Booking CTA */}
              <GlassButton
                variant="primary"
                size="lg"
                glowColor={rarity === "Grail" ? "gold" : "cyan"}
                className="w-full"
                onClick={() => setIsBookingOpen(true)}
                disabled={!card.available}
              >
                {card.available ? 'Request Booking' : 'Out of Stock'}
              </GlassButton>

              {/* Disclaimer */}
              <GlassCard className="p-4 border-secondary/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-secondary text-sm">Booking Only</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      No shipping available. No online payments accepted. All transactions are finalized in person after booking confirmation.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <BookingModal
        card={card}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </Layout>
  );
}
