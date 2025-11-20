import { PageLayout } from "@/shared/layout/page-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DailyMonthlyRevenue from "./daily-monthly"
import RevenueByCourses from "./by-courses"
import TeachersAccount from "./teachers"

export default function FinancialReports() {
  return (
    <PageLayout title="Moliyaviy hisobot">
      <Tabs defaultValue="daily-monthly" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="daily-monthly">Kunlik / oylik daromad</TabsTrigger>
          <TabsTrigger value="by-courses">Kurslar bo'yicha daromad</TabsTrigger>
          <TabsTrigger value="teachers">O'qituvchilar hisobi</TabsTrigger>
        </TabsList>
        <TabsContent value="daily-monthly">
          <DailyMonthlyRevenue />
        </TabsContent>
        <TabsContent value="by-courses">
          <RevenueByCourses />
        </TabsContent>
        <TabsContent value="teachers">
          <TeachersAccount />
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}

