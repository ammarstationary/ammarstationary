import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useServices } from "@/hooks/useServices";
import { Wrench, Check, X } from "lucide-react";

export default function Services() {
  const { data: services = [], isLoading } = useServices();
  
  const availableServices = services.filter(s => s.available);

  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Our</span>{" "}
              <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional services to meet all your stationery and printing needs
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : availableServices.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">No services available at the moment.</p>
              <p className="text-sm text-muted-foreground mt-2">Please check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard hover3D glowOnHover className="h-full flex flex-col">
                    {service.image ? (
                      <div className="aspect-video overflow-hidden rounded-t-xl">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-t-xl bg-primary/10 flex items-center justify-center">
                        <Wrench className="w-16 h-16 text-primary/50" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-muted-foreground text-sm flex-1 mb-4">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                        <span className="font-serif text-xl font-bold text-accent">
                          {service.price ? `₹${service.price.toLocaleString()}` : 'Contact for price'}
                        </span>
                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-400/20 text-green-400">
                          <Check className="w-3 h-3" />
                          Available
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
