import PaymentsTable from "./ui/payments-table"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Payments() {
  return (
    <PageLayout 
      title="To'lovlar" 
    >
      <PaymentsTable />
    </PageLayout>
  )
}