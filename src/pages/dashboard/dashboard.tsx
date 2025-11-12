import data from "./data.json"
import { SectionCards } from "./ui/section-card"
import { ChartAreaInteractive } from "./ui/chart"
import { DataTable } from "./ui/data-table"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  )
}
