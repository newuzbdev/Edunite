import LidsTable from "./ui/lids-table"
import { PageLayout } from "@/shared/layout/page-layout"

export default function LidlarPage() {
  return (
    <PageLayout 
      title="Lidlar" 
      description="Lead management and statistics"
    >
      <LidsTable />
    </PageLayout>
  )
}

