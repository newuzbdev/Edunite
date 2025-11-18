import { Link, useLocation } from "react-router-dom"
"use client"

import {
  MoreHorizontal,
  Folder,
  Share2,
  Trash2,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation()
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.url || (item.items?.some(sub => location.pathname === sub.url))
          const isOpen = openItems.includes(item.title)

          if (item.items) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => toggleItem(item.title)}
                  className={cn(
                    "w-full justify-start gap-3 rounded-md px-3 py-2.5 text-base font-medium transition-colors relative cursor-pointer",
                    "[&>span[aria-hidden]]:hidden",
                    isActive
                      ? "bg-primary !text-white hover:bg-primary hover:!text-white [&_*]:!text-white [&_*svg]:!text-white [&_*span]:!text-white [&_svg]:!text-white [&_svg]:!stroke-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  style={isActive ? { color: 'white !important' } as any : undefined}
                >
                  <item.icon
                    className={cn("h-5 w-5 flex-shrink-0", isActive && "!text-white !stroke-white")}
                    style={isActive ? { color: 'white', stroke: 'white', fill: 'none' } : undefined}
                    strokeWidth={2}
                  />
                  <span
                    className={cn("text-base flex-1", isActive && "!text-white")}
                    style={isActive ? { color: 'white !important' } as any : undefined}
                  >
                    {item.title}
                  </span>
                  <ChevronRight
                    className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")}
                  />
                </SidebarMenuButton>
                {isOpen && (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isSubActive = location.pathname === subItem.url
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                          >
                            <Link
                              to={subItem.url}
                              className={cn("w-full", isSubActive && "!text-white")}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={cn(
                  "w-full justify-start gap-3 rounded-md px-3 py-2.5 text-base font-medium transition-colors relative",
                  "[&>span[aria-hidden]]:hidden",
                  "[&[data-active='true']]:!text-white",
                  isActive
                    ? "bg-primary !text-white hover:bg-primary hover:!text-white [&>a]:!text-white [&>a>svg]:!text-white [&>a>span]:!text-white [&_*]:!text-white [&_*svg]:!text-white [&_*span]:!text-white [&_svg]:!text-white [&_svg]:!stroke-white [&[data-active='true']]:!text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                style={isActive ? { color: 'white !important' } as any : undefined}
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
                    className={cn("text-base", isActive && "!text-white")}
                    style={isActive ? { color: 'white !important' } as any : undefined}
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
