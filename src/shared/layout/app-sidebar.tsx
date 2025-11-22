"use client"
import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  User,
  DollarSign,
  GraduationCap,
  Users,
  UserCircle,
  MapPin,
  ChevronDown,
  Check,
  ClipboardCheck,
  MessageSquare,
  BookOpen,
} from "lucide-react"

import { NavMain } from "@/shared/layout/nav-main"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const branches = [
  { id: "1", name: "Toshkent filiali", city: "Toshkent" },
  { id: "2", name: "Samarqand filiali", city: "Samarqand" },
  { id: "3", name: "Buxoro filiali", city: "Buxoro" },
]

const data = {
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
      subItems: [
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
      title: "Kurslar",
      url: "/kurslar",
      icon: BookOpen,
    },

    {
      title: "Imtihonlar",
      url: "/exams",
      icon: ClipboardCheck,
      subItems: [
        {
          title: "Imtihon yaratish",
          url: "/exams/create",
        },
        {
          title: "Natijalar",
          url: "/exams/results",
        },
        {
          title: "Talaba ballari",
          url: "/exams/scores",
        },
      ],
    },
    {
      title: "Marketing",
      url: "/marketing",
      icon: MessageSquare,
      subItems: [
        {
          title: "SMS yuborish",
          url: "/marketing/sms/send",
        },
        {
          title: "SMS tarixi",
          url: "/marketing/sms/history",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedBranch, setSelectedBranch] = useState("1")

  return (
    <Sidebar collapsible="offcanvas" className="bg-white border-r" {...props}>
      <SidebarHeader className="border-b p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto p-0 hover:bg-transparent"
            >
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                  src="/logo.jpg"
                  alt="Edunite Logo"
                  className="w-8 h-8 object-contain rounded-[9.29px]"
                />
                <span className="text-black font-bold text-2xl lowercase">edunite</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-1 py-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-auto justify-between p-3 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground truncate w-full">
                    Filial
                  </span>
                  <span className="text-sm font-medium truncate w-full">
                    {branches.find(b => b.id === selectedBranch)?.name || "Filial tanlash"}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px]">
            {branches.map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                onClick={() => setSelectedBranch(branch.id)}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer",
                  selectedBranch === branch.id && "bg-accent"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-medium truncate w-full">
                    {branch.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {branch.city}
                  </span>
                </div>
                {selectedBranch === branch.id && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
