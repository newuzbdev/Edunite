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
  Calendar,
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
      items: [
        {
          title: "To'lovlar",
          url: "/payments",
        },
        {
          title: "Qarzdorlar",
          url: "/payments/debtors",
        },
        {
          title: "Statistika",
          url: "/payments/statistics",
        },
      ],
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
    {
      title: "Dars Jadvali",
      url: "/schedule",
      icon: Calendar,
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
              <Link to="/">
              <p>LOGO</p>
                {/* <img src="/edunitelogo.png" alt="Edunite logo" className="h- object-cover w-auto" /> */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
