import * as React from "react"
import {
    Toast as RadixToast,
    ToastAction as RadixToastAction,
    ToastClose,
    ToastDescription,
    ToastProvider as RadixToastProvider,
    ToastTitle,
    ToastViewport,
} from "@radix-ui/react-toast"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = RadixToastProvider

const ToastViewportCustom = React.forwardRef<
    React.ElementRef<typeof ToastViewport>,
    React.ComponentPropsWithoutRef<typeof ToastViewport>
>(({ className, ...props }, ref) => (
    <ToastViewport
        ref={ref}
        className={cn(
            "fixed bottom-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse gap-3 p-4 sm:bottom-6 sm:right-6 sm:max-w-sm",
            className
        )}
        {...props}
    />
))
ToastViewportCustom.displayName = ToastViewport.displayName

const Toast = React.forwardRef<
    React.ElementRef<typeof RadixToast>,
    React.ComponentPropsWithoutRef<typeof RadixToast>
>(({ className, ...props }, ref) => (
    <RadixToast
        ref={ref}
        className={cn(
            "group pointer-events-auto relative grid w-full gap-1 overflow-hidden rounded-lg border border-border bg-card/80 px-6 py-4 text-sm shadow-lg transition-all backdrop-blur supports-[backdrop-filter]:bg-card/60",
            className
        )}
        {...props}
    />
))
Toast.displayName = RadixToast.displayName

const ToastAction = React.forwardRef<
    React.ElementRef<typeof RadixToastAction>,
    React.ComponentPropsWithoutRef<typeof RadixToastAction>
>(({ className, ...props }, ref) => (
    <RadixToastAction
        ref={ref}
        className={cn(
            "inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
            className
        )}
        {...props}
    />
))
ToastAction.displayName = RadixToastAction.displayName

const ToastCloseIcon = React.forwardRef<
    React.ElementRef<typeof ToastClose>,
    React.ComponentPropsWithoutRef<typeof ToastClose>
>(({ className, ...props }, ref) => (
    <ToastClose
        ref={ref}
        className={cn(
            "absolute right-3 top-3 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100",
            className
        )}
        toast-close=""
        {...props}
    >
        <XIcon className="h-4 w-4" />
    </ToastClose>
))
ToastCloseIcon.displayName = ToastClose.displayName

const ToastTitleCustom = React.forwardRef<
    React.ElementRef<typeof ToastTitle>,
    React.ComponentPropsWithoutRef<typeof ToastTitle>
>(({ className, ...props }, ref) => (
    <ToastTitle ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
ToastTitleCustom.displayName = ToastTitle.displayName

const ToastDescriptionCustom = React.forwardRef<
    React.ElementRef<typeof ToastDescription>,
    React.ComponentPropsWithoutRef<typeof ToastDescription>
>(({ className, ...props }, ref) => (
    <ToastDescription ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
ToastDescriptionCustom.displayName = ToastDescription.displayName

export {
    Toast,
    ToastAction,
    ToastCloseIcon as ToastClose,
    ToastDescriptionCustom as ToastDescription,
    ToastProvider,
    ToastTitleCustom as ToastTitle,
    ToastViewportCustom as ToastViewport,
}
