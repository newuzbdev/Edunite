import Statistics from "./ui/statistics"
import { PageLayout } from "@/shared/layout/page-layout"

export default function PaymentsStatistics() {
  return (
    <PageLayout 
      title="To'lovlar statistikasi" 
      description="To'lovlar bo'yicha batafsil statistika va tahlillar"
    >
      <Statistics />
    </PageLayout>
  )
}