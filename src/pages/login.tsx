import { Navigate } from "react-router-dom"
import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown } from "lucide-react"

const languages = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "ENG" },
]

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const [selectedLanguage, setSelectedLanguage] = useState("uz")

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const selectedLanguageLabel = languages.find(l => l.code === selectedLanguage)?.label || "UZ"

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 relative">
        <div className="flex justify-end absolute top-6 right-6 md:top-10 md:right-10 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Globe className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">{selectedLanguageLabel}</span>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={selectedLanguage === lang.code ? "bg-accent" : ""}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2">
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block bg-muted overflow-hidden">
        <img
          src="/login.png"
          alt="Image"
          className="absolute top-8 left-8 right-8 bottom-8 h-[calc(100%-64px)] w-[calc(100%-64px)] object-cover rounded-[32px] dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

