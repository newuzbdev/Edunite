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
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Main Statistics KPI Cards */}
      <MainStatistics />

      {/* Revenue Chart */}
      <div className="px-4 lg:px-6">
        <RevenueChart />
      </div>

      {/* Lead Statistics */}
      <div className="w-full">
        <LeadStatistics />
      </div>

      {/* Student Statistics */}
      <div className="w-full">
        <StudentStatistics />
      </div>

      {/* Latest Payments */}
      <div className="w-full">
        <LatestPayments />
      </div>

      {/* Debts / Upcoming Payment Deadlines */}
      <div className="w-full">
        <DebtsSection />
      </div>

      {/* Course Statistics */}
      <div className="w-full">
        <CourseStatistics />
      </div>

      {/* Retention & Churn (Phase 2) */}
      <div className="w-full">
        <RetentionChurn />
      </div>
    </div>
  )
}
