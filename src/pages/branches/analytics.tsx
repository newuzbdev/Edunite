"use client"

import { useBranch } from "@/contexts/branch-context"
import { PageLayout } from "@/shared/layout/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  UserCircle,
  BookOpen,
  UsersRound,
  CreditCard,
  AlertCircle
} from "lucide-react"
import { useStudentsStore } from "@/pages/talabalar/utils/students-store"
import { usePaymentsStore } from "@/pages/payments/utils/payments-store"
import { useLidsStore } from "@/pages/lidlar/utils/lids-store"
import { useGroupsStore } from "@/pages/group/utils/groups-store"
import { useCoursesStore } from "@/pages/kurslar/utils/courses-store"
import { useTeachersStore } from "@/pages/teachers.tsx/utils/teachers-store"
import { useBranchFilter } from "@/hooks/use-branch-filter"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className={cn(trend.isPositive ? "text-green-600" : "text-red-600")}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span>o'tgan oyga nisbatan</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function BranchAnalytics() {
  const { selectedBranch, getSelectedBranch, branches, setSelectedBranch, isAllBranches } = useBranch()
  const currentBranch = getSelectedBranch()
  
  // Get all stores
  const allStudents = useStudentsStore((state) => state.students)
  const allPayments = usePaymentsStore((state) => state.payments)
  const allLids = useLidsStore((state) => state.lids)
  const allGroups = useGroupsStore((state) => state.groups)
  const allCourses = useCoursesStore((state) => state.courses)
  const allTeachers = useTeachersStore((state) => state.teachers)

  // Filter data by branch using the hook
  const branchStudents = useBranchFilter(allStudents as any[])
  const branchPayments = useBranchFilter(allPayments as any[])
  const branchLids = useBranchFilter(allLids as any[])
  const branchGroups = useBranchFilter(allGroups as any[])
  const branchCourses = useBranchFilter(allCourses as any[])
  const branchTeachers = useBranchFilter(allTeachers as any[])

  // Calculate statistics
  const activeStudents = branchStudents.filter((s: any) => s.status === 'active').length
  const totalRevenue = branchPayments
    .filter((p: any) => p.status === 'paid')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
  
  const monthlyRevenue = branchPayments
    .filter((p: any) => {
      const paymentDate = new Date(p.date)
      const now = new Date()
      return p.status === 'paid' && 
             paymentDate.getMonth() === now.getMonth() &&
             paymentDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

  const activeLids = branchLids.filter((l: any) => 
    ['new', 'called', 'interested', 'thinking'].includes(l.status)
  ).length

  const convertedLids = branchLids.filter((l: any) => l.status === 'converted').length

  const debtors = branchStudents.filter((s: any) => s.paymentStatus === 'debt').length

  const activeGroups = branchGroups.filter((g: any) => g.status === 'active').length

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm"
  }

  return (
    <PageLayout 
      title="Filial statistikasi"
      description={isAllBranches ? "Barcha filiallar statistikasi" : currentBranch ? `${currentBranch.name} statistikasi` : "Filial statistikasi"}
    >
      <div className="space-y-6">
        {/* Branch Selector */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Filial tanlash</CardTitle>
            <CardDescription>Statistikani ko'rish uchun filialni tanlang</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={isAllBranches ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm",
                  isAllBranches && "bg-primary text-primary-foreground"
                )}
                onClick={() => setSelectedBranch("all")}
              >
                Barcha filiallar
              </Badge>
              {branches.map((branch) => (
                <Badge
                  key={branch.id}
                  variant={selectedBranch === branch.id ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer px-4 py-2 text-sm",
                    selectedBranch === branch.id && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setSelectedBranch(branch.id)}
                >
                  {branch.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Faol talabalar"
            value={activeStudents}
            icon={<GraduationCap className="h-4 w-4" />}
            trend={{ value: 12.5, isPositive: true }}
            description="Jami faol talabalar soni"
          />
          <StatCard
            title="Faol lidlar"
            value={activeLids}
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 8.3, isPositive: true }}
            description="Jami faol lidlar soni"
          />
          <StatCard
            title="Oylik daromad"
            value={formatCurrency(monthlyRevenue)}
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: 18.7, isPositive: true }}
            description="Ushbu oyning daromadi"
          />
          <StatCard
            title="Jami daromad"
            value={formatCurrency(totalRevenue)}
            icon={<CreditCard className="h-4 w-4" />}
            trend={{ value: 22.4, isPositive: true }}
            description="Jami to'lovlar summasi"
          />
        </div>

        {/* Secondary Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="O'qituvchilar"
            value={branchTeachers.length}
            icon={<UserCircle className="h-4 w-4" />}
            description="Jami o'qituvchilar soni"
          />
          <StatCard
            title="Kurslar"
            value={branchCourses.length}
            icon={<BookOpen className="h-4 w-4" />}
            description="Jami kurslar soni"
          />
          <StatCard
            title="Guruhlar"
            value={activeGroups}
            icon={<UsersRound className="h-4 w-4" />}
            description="Faol guruhlar soni"
          />
          <StatCard
            title="Qarzdorlar"
            value={debtors}
            icon={<AlertCircle className="h-4 w-4" />}
            trend={{ value: 3.1, isPositive: false }}
            description="Qarzi bor talabalar soni"
          />
        </div>

        {/* Detailed Statistics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Lidlar statistikasi</CardTitle>
              <CardDescription>Lidlar holati bo'yicha taqsimot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Yangi lidlar</span>
                  <span className="text-sm font-semibold">
                    {branchLids.filter((l: any) => l.status === 'new').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Qiziqish bildirganlar</span>
                  <span className="text-sm font-semibold">
                    {branchLids.filter((l: any) => l.status === 'interested').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">O'ylab ko'rayotganlar</span>
                  <span className="text-sm font-semibold">
                    {branchLids.filter((l: any) => l.status === 'thinking').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Talabaga aylantirilgan</span>
                  <span className="text-sm font-semibold text-green-600">
                    {convertedLids}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Talabalar statistikasi</CardTitle>
              <CardDescription>Talabalar holati bo'yicha taqsimot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aktiv talabalar</span>
                  <span className="text-sm font-semibold text-green-600">
                    {branchStudents.filter((s: any) => s.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tugatgan talabalar</span>
                  <span className="text-sm font-semibold">
                    {branchStudents.filter((s: any) => s.status === 'finished').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Qarzdorlar</span>
                  <span className="text-sm font-semibold text-red-600">
                    {debtors}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jami talabalar</span>
                  <span className="text-sm font-semibold">
                    {branchStudents.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>To'lovlar bo'yicha taqsimot</CardTitle>
            <CardDescription>To'lov turlari bo'yicha statistika</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {['cash', 'card', 'payme', 'click'].map((type) => {
                const typePayments = branchPayments.filter(
                  (p: any) => p.paymentType === type && p.status === 'paid'
                )
                const typeTotal = typePayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
                const typeLabels: Record<string, string> = {
                  cash: 'Naqd',
                  card: 'Karta',
                  payme: 'Payme',
                  click: 'Click'
                }
                return (
                  <div key={type} className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">{typeLabels[type]}</span>
                    <span className="text-lg font-semibold">{formatCurrency(typeTotal)}</span>
                    <span className="text-xs text-muted-foreground">
                      {typePayments.length} ta to'lov
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

