import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, type HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"
import { cardItem } from "@/lib/animations"

const glassCardVariants = cva(
  "rounded-lg border transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "glass border-border",
        brass:
          "glass-brass",
        elevated:
          "bg-card border-border shadow-xl",
        subtle:
          "bg-card/50 border-border/50 backdrop-blur-sm",
      },
      hover: {
        none: "",
        lift: "card-hover-lift cursor-pointer",
        glow: "hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] cursor-pointer",
        scale: "hover:scale-[1.02] cursor-pointer",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
      padding: "md",
    },
  }
)

export interface GlassCardProps
  extends Omit<HTMLMotionProps<"div">, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag" | "children">,
    VariantProps<typeof glassCardVariants> {
  /** Enable entrance animation */
  animated?: boolean
  /** Custom animation delay (for staggered lists) */
  animationDelay?: number
  /** Children */
  children?: React.ReactNode
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant,
      hover,
      padding,
      animated = false,
      animationDelay = 0,
      children,
      ...props
    },
    ref
  ) => {
    if (animated) {
      return (
        <motion.div
          ref={ref}
          variants={cardItem}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ animationDelay: `${animationDelay}s` }}
          className={cn(glassCardVariants({ variant, hover, padding }), className)}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(glassCardVariants({ variant, hover, padding }), className)}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

// Subcomponents for structured content
const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display text-xl font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-4", className)} {...props} />
))
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-4 flex items-center", className)}
    {...props}
  />
))
GlassCardFooter.displayName = "GlassCardFooter"

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
  glassCardVariants,
}
