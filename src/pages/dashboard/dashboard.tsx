import { MainStatistics } from "./ui/main-statistics"
import { RevenueChart } from "./ui/revenue-chart"
import { LeadStatistics } from "./ui/lead-statistics"
import { StudentStatistics } from "./ui/student-statistics"
import { LatestPayments } from "./ui/latest-payments"
import { DebtsSection } from "./ui/debts-section"
import { CourseStatistics } from "./ui/course-statistics"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Dashboard() {
  return (
    <PageLayout 
      title="Bosh sahifa"
    >
      <MainStatistics />
      <RevenueChart />
      <LeadStatistics />
      <StudentStatistics />
      <LatestPayments />
      <DebtsSection />
      <CourseStatistics />
    </PageLayout>
  )
}
