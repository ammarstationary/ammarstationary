import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glowColor?: "cyan" | "gold" | "purple";
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", glowColor = "cyan", children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary/20 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60",
      secondary: "bg-secondary/20 border-secondary/40 text-secondary hover:bg-secondary/30 hover:border-secondary/60",
      ghost: "bg-foreground/5 border-foreground/20 text-foreground hover:bg-foreground/10 hover:border-foreground/40",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const glowColors = {
      cyan: "hover:shadow-[0_0_30px_hsl(185_100%_50%_/_0.3)]",
      gold: "hover:shadow-[0_0_30px_hsl(45_100%_50%_/_0.3)]",
      purple: "hover:shadow-[0_0_30px_hsl(270_100%_65%_/_0.3)]",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative overflow-hidden rounded-xl border backdrop-blur-xl font-medium transition-all duration-300",
          "shine-effect",
          variants[variant],
          sizes[size],
          glowColors[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton };
