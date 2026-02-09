import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover3D?: boolean;
  glowOnHover?: boolean;
  glowColor?: "cyan" | "gold" | "purple";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover3D = false, glowOnHover = true, glowColor = "cyan", children, ...props }, ref) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const glowColors = {
      cyan: "group-hover:shadow-[0_0_40px_hsl(185_100%_50%_/_0.15)] group-hover:border-primary/50",
      gold: "group-hover:shadow-[0_0_40px_hsl(45_100%_50%_/_0.15)] group-hover:border-secondary/50",
      purple: "group-hover:shadow-[0_0_40px_hsl(270_100%_65%_/_0.15)] group-hover:border-accent/50",
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hover3D) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      setRotateX(-mouseY / 20);
      setRotateY(mouseX / 20);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative glass-card shine-effect",
          glowOnHover && glowColors[glowColor],
          className
        )}
        style={{
          transform: hover3D ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : undefined,
          transition: "transform 0.1s ease-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
