"use client"

import { TrendingUp, TrendingDown, Users, DollarSign, CreditCard, UserCheck, UserX, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: React.ReactNode
  description?: string
  onClick?: () => void
}

function StatCard({ title, value, trend, description, onClick }: StatCardProps) {
  return (
    <Card 
      className={cn(
        "@container/card bg-white shadow-sm",
        onClick && "cursor-pointer hover:shadow-md transition-shadow"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          {trend && (
            <Badge variant="outline">
              {trend.isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {trend.isPositive ? "+" : ""}{trend.value}%
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {description && (
          <div className="text-muted-foreground">
            {description}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export function MainStatistics() {
  const navigate = useNavigate()

  // Mock data - replace with actual data from your API/store
  const stats = [
    {
      title: "Faol lidlar",
      value: 45,
      trend: { value: 12.5, isPositive: true },
      icon: <Users className="size-5" />,
      description: "Jami faol lidlar soni"
    },
    {
      title: "Sinovdagi lidlar",
      value: 23,
      trend: { value: 8.3, isPositive: true },
      icon: <UserCheck className="size-5" />,
      description: "Sinov davomida bo'lgan lidlar"
    },
    {
      title: "Tushgan lidlar",
      value: 12,
      trend: { value: 5.2, isPositive: false },
      icon: <UserX className="size-5" />,
      description: "Tushgan lidlar soni"
    },
    {
      title: "Faol talabalar",
      value: 156,
      trend: { value: 15.8, isPositive: true },
      icon: <Users className="size-5" />,
      description: "Jami faol talabalar soni"
    },
    {
      title: "Jami to'lovlar",
      value: "1,250,000",
      trend: { value: 22.4, isPositive: true },
      icon: <CreditCard className="size-5" />,
      description: "So'nggi oydagi to'lovlar"
    },
    {
      title: "Oylik daromad",
      value: "2,450,000",
      trend: { value: 18.7, isPositive: true },
      icon: <DollarSign className="size-5" />,
      description: "Ushbu oyning daromadi"
    },
    {
      title: "Qarzdorlar",
      value: 8,
      trend: { value: 3.1, isPositive: false },
      icon: <Flame className="size-5" />,
      description: "Qarzi bor talabalar soni",
      onClick: () => navigate("/payments/debtors")
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}


