"use client"

import * as React from "react"
import { type ToastProps, ToastProvider as ToastProviderPrimitive } from "@radix-ui/react-toast"

import { useToast } from "@/hooks/use-toast"
import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from "@/components/ui/toast"

const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProviderPrimitive>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProviderPrimitive>
  )
}

export { Toaster }
