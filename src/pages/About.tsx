import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, Crown, Gem, Heart } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Authenticity First",
    description: "Every card is verified for authenticity. We never compromise on quality or genuineness.",
    color: "primary",
  },
  {
    icon: Crown,
    title: "Premium Selection",
    description: "We curate only the finest pieces. From rare vintage cards to modern grails.",
    color: "secondary",
  },
  {
    icon: Gem,
    title: "Collector Focus",
    description: "Built by collectors, for collectors. We understand what makes a collection truly special.",
    color: "accent",
  },
  {
    icon: Heart,
    title: "Passionate Service",
    description: "Our team shares your passion. We're here to help you find your next treasure.",
    color: "primary",
  },
];

export default function About() {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">About</span>{" "}
              <span className="text-gradient">Scardingz</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              India's premier destination for authentic, collector-grade trading cards. 
              Where passion meets prestige.
            </p>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <GlassCard className="p-8 md:p-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    Scardingz was born from a simple belief: every collector deserves access to 
                    authentic, premium trading cards without compromise. Founded by passionate 
                    collectors who understand the thrill of the hunt and the joy of owning a 
                    piece of TCG history.
                  </p>
                  <p>
                    We've built India's most trusted TCG booking platform, where authenticity 
                    isn't just a promise—it's our foundation. Every card that passes through 
                    our hands is meticulously verified, professionally graded, and handled with 
                    the care it deserves.
                  </p>
                  <p>
                    From vintage Pokémon first editions to modern Magic: The Gathering masters, 
                    from Yu-Gi-Oh! rarities to One Piece treasures—we curate only the finest 
                    pieces for discerning collectors.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard
                    hover3D
                    glowOnHover
                    glowColor={value.color === "primary" ? "cyan" : value.color === "secondary" ? "gold" : "purple"}
                    className="p-8 h-full"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-${value.color}/20`}>
                      <value.icon className={`w-7 h-7 text-${value.color}`} />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 md:p-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                How Booking Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Browse & Select",
                    description: "Explore our curated collection and find the cards that speak to your collector's heart.",
                  },
                  {
                    step: "02",
                    title: "Submit Request",
                    description: "Fill out our booking form with your details. No payment required at this stage.",
                  },
                  {
                    step: "03",
                    title: "Personal Transaction",
                    description: "Our team contacts you to arrange viewing and finalize the transaction in person.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-serif text-2xl font-bold text-primary">{item.step}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
