import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Bell,
  Lock,
  Globe,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { PageLayout } from "@/shared/layout/page-layout"

const userData = {
  name: "Akmal Toshmatov",
  role: "Admin",
  avatar: "/avatars/shadcn.jpg",
  email: "akmal.toshmatov@edunite.uz",
  phone: "+998 90 123 45 67",
  address: "Toshkent shahri, Chilonzor tumani",
  joinDate: "2024-01-15",
  lastLogin: "2024-12-20 14:30",
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    address: userData.address,
  })

  const handleSave = () => {
    // In real app, save to API
    toast.success("Profil muvaffaqiyatli yangilandi")
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
    })
    setIsEditing(false)
  }

  return (
    <PageLayout
      title="Profil"
      description="Shaxsiy ma'lumotlar va sozlamalar"
    >
      <div className="space-y-6">
        {/* Profile Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-lg">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{userData.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {userData.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Qo'shilgan: {new Date(userData.joinDate).toLocaleDateString("uz-UZ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Oxirgi kirish: {userData.lastLogin}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      Bekor qilish
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Saqlash
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Tahrirlash
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
            <CardDescription>
              Profilingizning asosiy ma'lumotlari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Ism Familiya
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-muted/50">
                    {formData.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-muted/50">
                    {formData.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefon raqami
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-muted/50">
                    {formData.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Manzil
                </Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-muted/50">
                    {formData.address}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Xavfsizlik</CardTitle>
            <CardDescription>
              Parol va xavfsizlik sozlamalari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Parolni o'zgartirish</div>
                  <div className="text-sm text-muted-foreground">
                    Oxirgi o'zgartirilgan: 2 oy oldin
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                O'zgartirish
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Ikki bosqichli autentifikatsiya</div>
                  <div className="text-sm text-muted-foreground">
                    Qo'shimcha xavfsizlik uchun
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Faollashtirish
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Sozlamalar</CardTitle>
            <CardDescription>
              Ilova sozlamalari va afzalliklar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Bildirishnomalar</div>
                  <div className="text-sm text-muted-foreground">
                    Email va SMS bildirishnomalari
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Sozlash
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Til</div>
                  <div className="text-sm text-muted-foreground">
                    Hozirgi til: O'zbekcha
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                O'zgartirish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

