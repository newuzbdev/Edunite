import DebtorsTable from "./ui/debtors-table"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Debtors() {
  return (
    <PageLayout 
      title="Qarzdorlar" 
    >
      <DebtorsTable />
    </PageLayout>
  )
}