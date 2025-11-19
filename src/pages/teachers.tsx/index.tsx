import { TeacherStatistics } from "@/pages/dashboard/ui/teacher-statistics"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Oqituvchilar() {
  return (
    <PageLayout 
      title="O'qituvchilar" 
      description="O'qituvchilar statistikasi va ma'lumotlari"
    >
      <TeacherStatistics />
    </PageLayout>
  )
}