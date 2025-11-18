import { MainStatistics } from "./ui/main-statistics"
import { RevenueChart } from "./ui/revenue-chart"
import { LeadStatistics } from "./ui/lead-statistics"
import { StudentStatistics } from "./ui/student-statistics"
import { LatestPayments } from "./ui/latest-payments"
import { DebtsSection } from "./ui/debts-section"
import { CourseStatistics } from "./ui/course-statistics"
import { RetentionChurn } from "./ui/retention-churn"

export default function Dashboard() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 -m-2 lg:-m-3">
      <div className="min-h-[calc(100vh-8rem)] rounded-lg bg-white p-4 lg:p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="mb-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Boshqaruv paneli va umumiy statistikalar</p>
          </div>

          <MainStatistics />
          <RevenueChart />
          <LeadStatistics />
          <StudentStatistics />
          <LatestPayments />
          <DebtsSection />
          <CourseStatistics />
          <RetentionChurn />
        </div>
      </div>
    </div>
  )
}
