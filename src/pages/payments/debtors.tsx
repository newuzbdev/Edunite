import DebtorsTable from "./ui/debtors-table"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Debtors() {
  return (
    <PageLayout 
      title="Qarzdorlar" 
      description="Qarzdor talabalar ro'yxati va boshqaruvi"
    >
      <DebtorsTable />
    </PageLayout>
  )
}