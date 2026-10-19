"use client";

import { cva } from "class-variance-authority";
import { XIcon } from "lucide-react";
import type * as React from "react";
import {
  Heading,
  ModalOverlay as ModalOverlayPrimitive,
  type ModalOverlayProps as ModalOverlayPrimitiveProps,
  Modal as ModalPrimitive,
  Dialog as SheetPrimitive,
  type DialogProps as SheetPrimitiveProps,
  DialogTrigger as SheetTriggerPrimitive,
  type DialogTriggerProps as SheetTriggerPrimitiveProps,
} from "react-aria-components";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SheetSide = "top" | "right" | "bottom" | "left";

/**
 * Painel que desliza a partir de uma borda da viewport. Mesmo modelo de
 * `Dialog` (foco preso, Esc, fechar ao clicar fora, retorno do foco), mas
 * sem centralização: cada lado define suas dimensões e sua animação.
 * Use `className` só para o que for específico do uso (largura, cor).
 */
const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-6 bg-popover p-6 text-sm text-popover-foreground shadow-xl outline-none duration-100 data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0",
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-dvh w-full max-w-[min(22rem,100%)] sm:max-w-[22rem] data-entering:slide-in-from-right data-exiting:slide-out-to-right",
        left: "inset-y-0 left-0 h-dvh w-full max-w-[min(22rem,100%)] sm:max-w-[22rem] data-entering:slide-in-from-left data-exiting:slide-out-to-left",
        top: "inset-x-0 top-0 max-h-dvh w-full data-entering:slide-in-from-top data-exiting:slide-out-to-top",
        bottom:
          "inset-x-0 bottom-0 max-h-dvh w-full data-entering:slide-in-from-bottom data-exiting:slide-out-to-bottom",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

function SheetTrigger({ ...props }: SheetTriggerPrimitiveProps) {
  return <SheetTriggerPrimitive data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      slot="close"
      data-slot="sheet-close"
      variant={variant}
      size={size}
      className={cn(className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  isDismissable = true,
  role,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
  className?: string;
  children: React.ReactNode;
  side?: SheetSide;
  showCloseButton?: boolean;
  isDismissable?: boolean;
  role?: SheetPrimitiveProps["role"];
}) {
  return (
    <ModalOverlayPrimitive
      data-slot="sheet-overlay"
      isDismissable={isDismissable}
      className="fixed inset-0 isolate z-50 bg-black/30 duration-100 data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0 supports-backdrop-filter:backdrop-blur-sm"
      {...props}
    >
      <ModalPrimitive
        data-slot="sheet-content"
        className={cn(sheetVariants({ side }), className)}
      >
        <SheetPrimitive
          data-slot="sheet"
          role={role}
          className="[display:inherit] h-full min-h-0 [flex-direction:inherit] [gap:inherit] outline-none"
        >
          {children}
          {showCloseButton && (
            <SheetClose
              variant="ghost"
              className="absolute top-4 right-4 bg-secondary"
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Fechar</span>
            </SheetClose>
          )}
        </SheetPrimitive>
      </ModalPrimitive>
    </ModalOverlayPrimitive>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Heading>, "slot">) {
  return (
    <Heading
      slot="title"
      data-slot="sheet-title"
      className={cn("text-base leading-none font-medium", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "slot">) {
  return (
    <div
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  type SheetSide,
  SheetTitle,
  SheetTrigger,
};
