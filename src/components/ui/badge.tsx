import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 [a&]:hover:shadow-lg [a&]:hover:shadow-primary/30 [a&]:hover:scale-105",
        secondary:
          "border-transparent bg-gradient-to-br from-secondary via-secondary to-secondary/85 text-secondary-foreground shadow-md [a&]:hover:shadow-lg [a&]:hover:scale-105",
        destructive:
          "border-transparent bg-gradient-to-br from-destructive via-destructive to-destructive/85 text-white shadow-md shadow-destructive/20 [a&]:hover:shadow-lg [a&]:hover:shadow-destructive/30 [a&]:hover:scale-105 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "text-foreground border-2 border-border/60 bg-background/60 backdrop-blur-sm [a&]:hover:bg-accent/60 [a&]:hover:text-accent-foreground [a&]:hover:border-primary/40 [a&]:hover:scale-105",
        success:
          "border-transparent bg-gradient-to-br from-green-500 via-green-500 to-green-600 text-white shadow-md shadow-green-500/20 [a&]:hover:shadow-lg [a&]:hover:shadow-green-500/30 [a&]:hover:scale-105",
        warning:
          "border-transparent bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 [a&]:hover:shadow-lg [a&]:hover:shadow-amber-500/30 [a&]:hover:scale-105",
        info: "border-transparent bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 [a&]:hover:shadow-lg [a&]:hover:shadow-blue-500/30 [a&]:hover:scale-105",
        glass:
          "border-white/30 dark:border-white/20 bg-white/70 dark:bg-white/10 backdrop-blur-md text-foreground shadow-soft [a&]:hover:bg-white/80 dark:[a&]:hover:bg-white/20 [a&]:hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
