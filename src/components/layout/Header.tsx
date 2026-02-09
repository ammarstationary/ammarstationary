import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.jpg";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/collection" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-border/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Ammar Books & Stationary" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-serif text-xl font-bold text-gradient">
                Ammar Books
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative font-medium transition-colors duration-300 hover:text-primary",
                    location.pathname === link.path ? "text-primary" : "text-foreground/70"
                  )}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Link to="/collection">
                <GlassButton variant="primary" size="sm">
                  Browse Products
                </GlassButton>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass border-b border-border/30"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "py-3 px-4 rounded-xl font-medium transition-all duration-300",
                    location.pathname === link.path
                      ? "bg-primary/20 text-primary"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/collection" onClick={() => setIsOpen(false)} className="mt-2">
                <GlassButton variant="primary" size="md" className="w-full">
                  Browse Products
                </GlassButton>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
