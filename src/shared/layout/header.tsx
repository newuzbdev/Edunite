"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Search, LogOut, User, ChevronDown, Globe, Wallet, Plus, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

const userData = {
  name: "Akmal Toshmatov",
  role: "Admin",
  avatar: "/avatars/shadcn.jpg",
}

const languages = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "ENG" },
]

export function SiteHeader() {
  const [selectedLanguage, setSelectedLanguage] = useState("uz")
  const [searchQuery, setSearchQuery] = useState("")
  const { logout } = useAuth()
  const navigate = useNavigate()

  const selectedLanguageLabel = languages.find(l => l.code === selectedLanguage)?.label || "UZ"

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4 lg:px-6">
        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-1 sm:mx-2 h-6 hidden sm:block"
          />
          
          {/* Search */}
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          {/* Wallet Balance Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1 sm:gap-2">
                <Wallet className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">2 499 341 so'm</span>
                <span className="text-xs font-medium sm:hidden">2.5M</span>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => {
                  // TODO: Open balance top-up dialog/modal
                  toast.info("Hisobni to'ldirish funksiyasi tez orada qo'shiladi")
                }}
                className="cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Hisobni to'ldirish</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  // TODO: Navigate to income history
                  toast.info("Tushumlar tarixi tez orada qo'shiladi")
                }}
                className="cursor-pointer"
              >
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Tushumlar tarixi</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  // TODO: Navigate to expense history
                  toast.info("Xarajatlar tarixi tez orada qo'shiladi")
                }}
                className="cursor-pointer"
              >
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Xarajatlar tarixi</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1 sm:gap-2">
                <Globe className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{selectedLanguageLabel}</span>
                <ChevronDown className="h-4 w-4 shrink-0 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={cn(
                    selectedLanguage === lang.code && "bg-accent"
                  )}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1 sm:p-2 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="text-xs">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium leading-none">
                      {userData.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {userData.role}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userData.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userData.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Chiqish</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
