import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
})
FieldGroup.displayName = "FieldGroup"

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
})
Field.displayName = "Field"

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
})
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FieldDescription.displayName = "FieldDescription"

const FieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode
  }
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative flex items-center gap-4", className)}
      {...props}
    >
      <div className="flex-1 border-t" />
      {children && (
        <span className="text-xs text-muted-foreground">{children}</span>
      )}
      <div className="flex-1 border-t" />
    </div>
  )
})
FieldSeparator.displayName = "FieldSeparator"

export {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
}

