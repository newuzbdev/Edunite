import React from "react"
import { cn } from "@/lib/utils"

interface PageLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  headerActions?: React.ReactNode
}

export function PageLayout({ title, description, children, className, headerActions }: PageLayoutProps) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-6 -m-2 lg:-m-3", className)}>
      <div className="min-h-[calc(100vh-8rem)] rounded-lg  p-4 lg:p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="mb-2">
            {headerActions && <div className="mb-4">{headerActions}</div>}
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

