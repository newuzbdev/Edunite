import StudentsTable from "./ui/students-table"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Talabalar() {
  return (
    <PageLayout 
      title="Talabalar" 
      description="Talabalar ro'yxati va boshqaruvi"
    >
      <StudentsTable />
    </PageLayout>
  )
}