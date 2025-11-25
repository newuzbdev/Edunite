import GroupsTable from "./ui/groups-table"
import { PageLayout } from "@/shared/layout/page-layout"

export default function Guruhlar() {
  return (
    <PageLayout 
      title="Guruhlar" 
    >
      <GroupsTable />
    </PageLayout>
  )
}