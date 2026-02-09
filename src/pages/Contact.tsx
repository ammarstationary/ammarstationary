import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Instagram, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { useContactSettings } from "@/hooks/useContactSettings";

export default function Contact() {
  const { data: settings, isLoading } = useContactSettings();

  const contactMethods = settings ? [
    {
      icon: Instagram,
      title: "Instagram",
      description: settings.instagram_handle || '',
      href: settings.instagram_url || '#',
      color: "purple" as const,
    },
    {
      icon: Mail,
      title: "Email",
      description: settings.email || '',
      href: `mailto:${settings.email || ''}`,
      color: "cyan" as const,
    },
  ] : [];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Get in</span>{" "}
              <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Have questions? Want to discuss a special request? We're here to help.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Connect With Us
              </h2>

              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.title}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <GlassCard
                    hover3D
                    glowOnHover
                    glowColor={method.color}
                    className="p-6 flex items-center gap-4 cursor-pointer mb-4"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      method.color === "cyan" ? "bg-primary/20" : "bg-accent/20"
                    }`}>
                      <method.icon className={`w-7 h-7 ${
                        method.color === "cyan" ? "text-primary" : "text-accent"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{method.title}</h3>
                      <p className="text-muted-foreground">{method.description}</p>
                    </div>
                  </GlassCard>
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <GlassCard className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/20">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Location</h4>
                      <p className="text-muted-foreground text-sm">{settings?.location || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/20">
                      <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Response Time</h4>
                      <p className="text-muted-foreground text-sm">{settings?.response_time || ''}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-8">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Send a Message
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Enter your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="What's this about?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="Tell us more..." />
                  </div>
                  <GlassButton type="submit" variant="primary" size="lg" className="w-full">
                    Send Message
                  </GlassButton>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
