import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * A varredura de luz do hover é um pseudo-elemento - assim `asChild`
 * continua recebendo um único filho e o Slot funciona normalmente.
 */
const sweep =
  "before:pointer-events-none before:absolute before:inset-y-0 before:-left-full before:w-full before:content-[''] before:opacity-0 before:transition-all before:duration-[750ms] before:ease-out hover:before:left-full hover:before:opacity-100 motion-reduce:before:hidden";

const buttonVariants = cva(
  cn(
    "group/btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full text-sm font-medium tracking-tight transition-[transform,color,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:active:scale-100",
    sweep,
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-paper text-void shadow-[0_0_0_1px_color-mix(in_oklab,var(--paper)_85%,transparent),0_12px_40px_-18px_color-mix(in_oklab,var(--electric)_55%,transparent)] hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--cyan-bright)_70%,transparent),0_16px_52px_-16px_color-mix(in_oklab,var(--electric)_75%,transparent)] before:bg-[linear-gradient(110deg,transparent_30%,color-mix(in_oklab,var(--void)_55%,transparent)_50%,transparent_70%)]",
        outline:
          "border border-line-strong bg-surface text-mist hover:border-electric/40 hover:bg-electric/[0.07] hover:text-paper before:bg-[linear-gradient(110deg,transparent_30%,color-mix(in_oklab,var(--cyan-bright)_14%,transparent)_50%,transparent_70%)]",
        ghost: "text-slate-blue hover:text-paper before:hidden",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-[15px]",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
