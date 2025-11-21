import TeachersTable from "./ui/teachers-table"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Oqituvchilar() {
  return (
    <PageLayout 
      title="O'qituvchilar" 
      description="O'qituvchilar ro'yxati va boshqaruvi"
    >
      <TeachersTable />
    </PageLayout>
  )
}