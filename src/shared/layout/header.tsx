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
import { Search, LogOut, User, ChevronDown, Globe, Wallet, Plus } from "lucide-react"
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
      <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 h-6"
          />
          
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Wallet Balance Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Wallet className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">2 499 341 so'm</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Hisob balansi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-3 py-4 space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Jami balans</div>
                    <div className="text-lg font-semibold text-foreground">2 499 341 so'm</div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Kunlik daromad</span>
                      <span className="text-sm font-medium text-foreground">720 000 so'm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Haftalik daromad</span>
                      <span className="text-sm font-medium text-foreground">4 200 000 so'm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Oylik daromad</span>
                      <span className="text-sm font-medium text-foreground">18 500 000 so'm</span>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                // TODO: Open balance top-up dialog/modal
                toast.info("Balance toldirish funksiyasi tez orada qo'shiladi")
              }}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Balance toldirish</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/payments/statistics")}>
                <span>Batafsil statistika</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6" />

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Globe className="h-4 w-4" />
                <span>{selectedLanguageLabel}</span>
                <ChevronDown className="h-4 w-4" />
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

          <Separator orientation="vertical" className="h-6" />

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-2 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="text-xs">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium leading-none">
                      {userData.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {userData.role}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
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
