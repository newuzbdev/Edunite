import { Link, useLocation } from "react-router-dom"
"use client"

import {
  MoreHorizontal,
  Folder,
  Share2,
  Trash2,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

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
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  subItems?: {
    title: string
    url?: string
    subItems?: {
      title: string
      url: string
    }[]
  }[]
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const location = useLocation()
  
  // Initialize open state based on current path
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {}
    items.forEach(item => {
      if (item.subItems && item.subItems.length > 0) {
        const hasActiveSubItem = item.subItems.some(subItem => {
          if (subItem.subItems && subItem.subItems.length > 0) {
            const hasActiveNested = subItem.subItems.some(nested => 
              location.pathname === nested.url
            )
            if (hasActiveNested) {
              state[`${item.title}-${subItem.title}`] = true
            }
            return hasActiveNested
          }
          return subItem.url && (location.pathname === subItem.url || location.pathname.startsWith(subItem.url))
        })
        state[item.title] = hasActiveSubItem || location.pathname.startsWith(item.url)
      }
    })
    return state
  })
  
  // Update open state when location changes
  useEffect(() => {
    const newState: Record<string, boolean> = {}
    items.forEach(item => {
      if (item.subItems && item.subItems.length > 0) {
        const hasActiveSubItem = item.subItems.some(subItem => {
          if (subItem.subItems && subItem.subItems.length > 0) {
            const hasActiveNested = subItem.subItems.some(nested => 
              location.pathname === nested.url
            )
            if (hasActiveNested) {
              newState[`${item.title}-${subItem.title}`] = true
            }
            return hasActiveNested
          }
          return subItem.url && (location.pathname === subItem.url || location.pathname.startsWith(subItem.url))
        })
        newState[item.title] = hasActiveSubItem || location.pathname.startsWith(item.url)
      }
    })
    setOpenItems(prev => {
      // Only update if there's a change
      const hasChange = Object.keys(newState).some(key => newState[key] !== prev[key])
      return hasChange ? { ...prev, ...newState } : prev
    })
  }, [items, location.pathname])

  const toggleItem = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const toggleSubItem = (parentTitle: string, subItemTitle: string) => {
    const key = `${parentTitle}-${subItemTitle}`
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0
          const isActive = location.pathname === item.url || (hasSubItems && location.pathname.startsWith(item.url))
          const isOpen = openItems[item.title] || false
          
          if (hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => toggleItem(item.title)}
                  isActive={isActive}
                  className={cn(
                    "w-full justify-between gap-3 font-medium transition-colors relative cursor-pointer",
                    "[&>span[aria-hidden]]:hidden",
                    "[&[data-active='true']]:!text-white",
                    "leading-[20px] tracking-normal",
                    "p-3 h-auto min-h-[46px] rounded-[10px]",
                  isActive 
                    ? "bg-primary !text-white hover:bg-primary/90 hover:!text-white [&>svg]:!text-white [&>span]:!text-white [&_*]:!text-white [&_svg]:!text-white [&_svg]:!stroke-white" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <item.icon 
                      className={cn("h-5 w-5 flex-shrink-0", isActive && "!text-white !stroke-white")} 
                      style={isActive ? { color: 'white', stroke: 'white', fill: 'none' } : undefined}
                      strokeWidth={2}
                    />
                    <span 
                      className={cn("font-medium leading-[20px] tracking-normal truncate", isActive && "!text-white")}
                      style={isActive ? { color: 'white !important', fontWeight: 500 } as any : { fontWeight: 500 } as any}
                    >
                      {item.title}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isActive && "!text-white")} />
                    ) : (
                      <ChevronRight className={cn("h-4 w-4 transition-transform", isActive && "!text-white")} />
                    )}
                  </div>
                </SidebarMenuButton>
                {isOpen && (
                  <div className="mt-2 ml-2 space-y-1">
                    {item.subItems?.map((subItem) => {
                      const hasNestedSubItems = subItem.subItems && subItem.subItems.length > 0
                      const subItemKey = `${item.title}-${subItem.title}`
                      const isSubOpen = openItems[subItemKey] || false
                      const isSubActive = subItem.url ? location.pathname === subItem.url : false
                      const hasActiveNestedSubItem = hasNestedSubItems && subItem.subItems?.some(nested => 
                        location.pathname === nested.url
                      )

                      if (hasNestedSubItems) {
                        return (
                          <div key={subItem.title} className="space-y-1">
                            <div
                              onClick={() => toggleSubItem(item.title, subItem.title)}
                              className={cn(
                                "h-auto min-h-[46px] rounded-[10px] px-3 font-medium transition-all duration-200",
                                "w-full text-left border-0 cursor-pointer flex items-center justify-between",
                                "leading-[20px] tracking-normal",
                                hasActiveNestedSubItem
                                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
                              )}
                            >
                              <span className={cn(
                                "font-medium leading-[20px] tracking-normal",
                                hasActiveNestedSubItem ? "text-primary" : "text-gray-700"
                              )}>
                                {subItem.title}
                              </span>
                              <div className="flex-shrink-0">
                                {isSubOpen ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                            {isSubOpen && (
                              <div className="ml-4 space-y-1">
                                {subItem.subItems?.map((nestedSubItem) => {
                                  const isNestedActive = location.pathname === nestedSubItem.url
                                  return (
                                    <div key={nestedSubItem.title}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isNestedActive}
                                        className={cn(
                                          "h-auto min-h-[46px] rounded-[10px] px-3 font-medium transition-all duration-200",
                                          "w-full text-left border-0",
                                          "leading-[20px] tracking-normal",
                                          isNestedActive 
                                            ? "bg-gray-50 text-primary hover:bg-gray-100 shadow-sm [&>a]:text-primary [&>a>span]:text-primary" 
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
                                        )}
                                      >
                                        <Link 
                                          to={nestedSubItem.url}
                                          className={cn(
                                            "flex items-center w-full h-full p-0",
                                            isNestedActive ? "text-primary" : "text-gray-700"
                                          )}
                                        >
                                          <span className={cn(
                                            "font-medium leading-[20px] tracking-normal",
                                            isNestedActive ? "text-primary" : "text-gray-700"
                                          )}>
                                            {nestedSubItem.title}
                                          </span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      }

                      return (
                        <div key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={cn(
                              "h-auto min-h-[46px] rounded-[10px] px-3 font-medium transition-all duration-200",
                              "w-full text-left border-0",
                              "leading-[20px] tracking-normal",
                              isSubActive 
                                ? "bg-gray-50 text-primary hover:bg-gray-100 shadow-sm [&>a]:text-primary [&>a>span]:text-primary" 
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
                            )}
                          >
                            <Link 
                              to={subItem.url || '#'}
                              className={cn(
                                "flex items-center w-full h-full p-0",
                                isSubActive ? "text-primary" : "text-gray-700"
                              )}
                            >
                              <span className={cn(
                                "font-medium leading-[20px] tracking-normal",
                                isSubActive ? "text-primary" : "text-gray-700"
                              )}>
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </div>
                      )
                    })}
                  </div>
                )}
              </SidebarMenuItem>
            )
          }

          const isItemActive = location.pathname === item.url
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={isItemActive}
                className={cn(
                  "w-full justify-start gap-3 font-medium transition-colors relative",
                  "[&>span[aria-hidden]]:hidden",
                  "[&[data-active='true']]:!text-white",
                  "leading-[20px] tracking-normal",
                  "p-3 h-auto min-h-[46px] rounded-[10px]",
                  isItemActive 
                    ? "bg-primary !text-white hover:bg-primary hover:!text-white [&>a]:!text-white [&>a>svg]:!text-white [&>a>span]:!text-white [&_*]:!text-white [&_*svg]:!text-white [&_*span]:!text-white [&_svg]:!text-white [&_svg]:!stroke-white [&[data-active='true']]:!text-white" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Link 
                  to={item.url} 
                  className={cn("flex items-center gap-3", isItemActive && "!text-white")}
                  style={isItemActive ? { color: 'white !important' } as any : undefined}
                >
                  <item.icon 
                    className={cn("h-5 w-5 flex-shrink-0", isItemActive && "!text-white !stroke-white")} 
                    style={isItemActive ? { color: 'white', stroke: 'white', fill: 'none' } : undefined}
                    strokeWidth={2}
                  />
                  <span 
                    className={cn("font-medium leading-[20px] tracking-normal", isItemActive && "!text-white")}
                    style={isItemActive ? { color: 'white !important', fontWeight: 500, lineHeight: '20px', letterSpacing: '0%' } as any : { fontWeight: 500, lineHeight: '20px', letterSpacing: '0%' } as any}
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
