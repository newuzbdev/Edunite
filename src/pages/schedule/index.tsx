import ScheduleCalendar from "./ui/schedule-calendar"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Schedule() {
  return (
    <PageLayout 
      title="Jadval" 
      description="Dars jadvali va rejalashtirish"
    >
      <ScheduleCalendar />
    </PageLayout>
  )
}