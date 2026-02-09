import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, Tag, CheckCircle, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { CardWithCategory } from "@/types/card";
import { useCreateBookingRequest } from "@/hooks/useBookingRequests";
import { useValidatePromoCode } from "@/hooks/usePromoCodes";
import { useDebounce } from "@/hooks/useDebounce";

interface BookingModalProps {
  card: CardWithCategory;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ card, isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    quantity: 1,
    message: "",
    promoCode: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const createBooking = useCreateBookingRequest();

  // Debounce promo code input for validation
  const debouncedPromoCode = useDebounce(formData.promoCode, 500);
  const { data: validPromo, isLoading: isValidating } = useValidatePromoCode(debouncedPromoCode);

  // Calculate prices
  const subtotal = card.price * formData.quantity;
  const discountPercent = validPromo?.discount_percent || 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalPrice = subtotal - discountAmount;

  const promoStatus = useMemo(() => {
    if (!formData.promoCode.trim()) return null;
    if (isValidating) return "validating";
    if (validPromo) return "valid";
    return "invalid";
  }, [formData.promoCode, isValidating, validPromo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createBooking.mutate({
      card_id: card.id,
      card_name: card.name,
      card_price: card.price,
      full_name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      quantity: formData.quantity,
      message: formData.message || undefined,
      promo_code: validPromo ? validPromo.code : undefined,
      discount_percent: validPromo ? validPromo.discount_percent : undefined,
      final_price: finalPrice,
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          setFormData({
            fullName: "",
            phone: "",
            email: "",
            quantity: 1,
            message: "",
            promoCode: "",
          });
        }, 3000);
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Request Booking
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Card Info */}
              <div className="glass-card p-4 mb-6 flex items-center gap-4">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-16 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-foreground">{card.name}</h3>
                  <p className="text-sm text-muted-foreground">{card.set_name}</p>
                  <p className="font-serif text-lg font-bold text-secondary">
                    ₹{card.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    Booking Request Received!
                  </h3>
                  <p className="text-muted-foreground">
                    Our team will contact you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {/* Promo Code Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Promo Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.promoCode}
                        onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                        placeholder="Enter promo code"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {promoStatus === "validating" && (
                          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                        )}
                        {promoStatus === "valid" && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                        {promoStatus === "invalid" && (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                    </div>
                    {promoStatus === "valid" && validPromo && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-primary mt-1"
                      >
                        {validPromo.discount_percent}% discount applied!
                      </motion.p>
                    )}
                    {promoStatus === "invalid" && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive mt-1"
                      >
                        Invalid or expired promo code
                      </motion.p>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="glass-card p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({formData.quantity} × ₹{card.price.toLocaleString("en-IN")})
                      </span>
                      <span className="text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discountPercent > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex justify-between text-sm text-primary"
                      >
                        <span>Discount ({discountPercent}%)</span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </motion.div>
                    )}
                    <div className="border-t border-border/50 pt-2 flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-serif text-xl font-bold text-secondary">
                        ₹{finalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Any special requests or questions..."
                    />
                  </div>

                  {/* Disclaimer */}
                  <div className="glass-card p-3 border-secondary/30">
                    <p className="text-xs text-muted-foreground text-center">
                      <span className="text-secondary font-semibold">⚠️</span> Booking only. No shipping. 
                      All transactions finalized in person.
                    </p>
                  </div>

                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={createBooking.isPending}
                  >
                    {createBooking.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Booking Request"
                    )}
                  </GlassButton>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
