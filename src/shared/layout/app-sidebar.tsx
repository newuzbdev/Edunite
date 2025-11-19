"use client"
import * as React from "react"
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  User,
  DollarSign,
  GraduationCap,
  Users,
  UserCircle,
} from "lucide-react"

import { NavMain } from "@/shared/layout/nav-main"
import { NavUser } from "@/shared/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Bosh sahifa",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Lidlar",
      url: "/lids",
      icon: User,
    },
    {
      title: "To'lovlar",
      url: "/payments",
      icon: DollarSign,
    },
    {
      title: "Talabalar",
      url: "/talabalar",
      icon: GraduationCap,
    },
    {
      title: "Guruhlar",
      url: "/groups",
      icon: Users,
    },
    {
      title: "O'qituvchilar",
      url: "/teachers",
      icon: UserCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" className="bg-white border-r" {...props}>
      <SidebarHeader className="border-b p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto p-0 hover:bg-transparent"
            >
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white font-semibold text-base">
                  e
                </div>
                <span className="text-black font-medium text-base lowercase">edunite</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-1 py-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
