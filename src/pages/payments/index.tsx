import PaymentsTable from "./ui/payments-table"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Payments() {
  return (
    <PageLayout 
      title="To'lovlar" 
      description="O'quv markazdagi barcha to'lovlar shu sahifada ko'rinadi"
    >
      <PaymentsTable />
    </PageLayout>
  )
}