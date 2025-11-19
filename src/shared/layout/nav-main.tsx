import { Link, useLocation } from "react-router-dom"
"use client"

import {
  MoreHorizontal,
  Folder,
  Share2,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.url
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive}
                className={cn(
                  "w-full justify-start gap-3 font-medium transition-colors relative",
                  "[&>span[aria-hidden]]:hidden", // Hide the left side line indicator
                  "[&[data-active='true']]:!text-white", // Override component's blue text
                  "leading-[20px] tracking-normal",
                  // Same padding for both active and inactive to prevent shifting
                  "p-3 h-auto min-h-[46px] rounded-[10px]",
                  isActive 
                    ? "bg-primary !text-white hover:bg-primary hover:!text-white [&>a]:!text-white [&>a>svg]:!text-white [&>a>span]:!text-white [&_*]:!text-white [&_*svg]:!text-white [&_*span]:!text-white [&_svg]:!text-white [&_svg]:!stroke-white [&[data-active='true']]:!text-white" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                style={isActive ? { color: 'white !important', borderRadius: '10px', padding: '12px', minHeight: '46px' } as any : { padding: '12px', minHeight: '46px', borderRadius: '10px' } as any}
              >
                <Link 
                  to={item.url} 
                  className={cn("flex items-center gap-3", isActive && "!text-white")}
                  style={isActive ? { color: 'white !important' } as any : undefined}
                >
                  <item.icon 
                    className={cn("h-5 w-5 flex-shrink-0", isActive && "!text-white !stroke-white")} 
                    style={isActive ? { color: 'white', stroke: 'white', fill: 'none' } : undefined}
                    strokeWidth={2}
                  />
                  <span 
                    className={cn("font-medium leading-[20px] tracking-normal", isActive && "!text-white")}
                    style={isActive ? { color: 'white !important', fontWeight: 500, lineHeight: '20px', letterSpacing: '0%' } as any : { fontWeight: 500, lineHeight: '20px', letterSpacing: '0%' } as any}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-sm"
                >
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder />
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
