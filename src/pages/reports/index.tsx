import { PageLayout } from "@/shared/layout/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { DollarSign, GraduationCap, UserCircle, ClipboardCheck, ArrowRight } from "lucide-react"

export default function Reports() {
  const navigate = useNavigate()

  const reportCards = [
    {
      title: "Moliyaviy hisobot",
      description: "Kunlik/oylik daromad, kurslar bo'yicha daromad va o'qituvchilar hisobi",
      icon: DollarSign,
      url: "/reports/financial",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Talabalar hisoboti",
      description: "Talabalar bo'yicha batafsil hisobot va statistika",
      icon: GraduationCap,
      url: "/reports/students",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "O'qituvchilar hisoboti",
      description: "O'qituvchilar bo'yicha batafsil hisobot va statistika",
      icon: UserCircle,
      url: "/reports/teachers",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Davomat hisoboti",
      description: "Guruhlar va o'qituvchilar bo'yicha davomat hisoboti",
      icon: ClipboardCheck,
      url: "/reports/attendance",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <PageLayout title="Hisobotlar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((report) => {
          const Icon = report.icon
          return (
            <Card key={report.url} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${report.bgColor} ${report.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => navigate(report.url)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl">{report.title}</CardTitle>
                <CardDescription className="text-sm">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate(report.url)}
                  className="w-full"
                >
                  Ko'rish
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </PageLayout>
  )
}
