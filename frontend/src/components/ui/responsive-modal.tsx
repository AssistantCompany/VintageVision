import * as React from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "./dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "./sheet"

interface ResponsiveModalProps {
  /** Controls the open state */
  open?: boolean
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Trigger element */
  trigger?: React.ReactNode
  /** Modal title */
  title?: React.ReactNode
  /** Modal description */
  description?: React.ReactNode
  /** Modal content */
  children: React.ReactNode
  /** Footer content */
  footer?: React.ReactNode
  /** Custom className for content */
  className?: string
  /** Breakpoint to switch from sheet to dialog (default: 768px) */
  breakpoint?: number
}

export function ResponsiveModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  className,
  breakpoint = 768,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery(`(min-width: ${breakpoint}px)`)

  // On desktop, use Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className={className}>
          {(title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    )
  }

  // On mobile, use bottom Sheet
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className={className}>
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        {children}
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  )
}

// Re-export close components for convenience
export { DialogClose as ResponsiveModalClose }
export { SheetClose as ResponsiveModalSheetClose }
