import LidsTable from "./ui/lids-table"

export default function LidlarPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Lidlar</h1>
        <p className="text-muted-foreground mt-1">Lead management and statistics</p>
      </div>
      <LidsTable />
    </div>
  )
}

