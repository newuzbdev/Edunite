import CoursesTable from "./ui/courses-table"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Kurslar() {
  return (
    <PageLayout 
      title="Kurslar" 
      description="Kurslar ro'yxati va boshqaruvi"
    >
      <CoursesTable />
    </PageLayout>
  )
}

