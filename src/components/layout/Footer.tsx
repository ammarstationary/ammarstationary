import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import logo from "@/assets/logo.jpg";

export function Footer() {
  return (
    <footer className="glass border-t border-border/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Ammar Books & Stationary" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-serif text-xl font-bold text-gradient">
                Ammar Books & Stationary
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Your one-stop shop for quality books, stationery, and professional services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/collection" className="text-muted-foreground hover:text-primary transition-colors">
                Collection
              </Link>
              <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/scardingzindia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram size={18} />
                <span>Instagram</span>
              </a>
              <a
                href="mailto:scardingzindia@duck.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={18} />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <div className="glass-card p-4 mb-6">
            <p className="text-sm text-muted-foreground text-center">
              <span className="text-secondary font-semibold">📚 Visit Us:</span> Quality books, stationery supplies, and professional services all under one roof.
            </p>
          </div>
          <p className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Ammar Books & Stationary. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
