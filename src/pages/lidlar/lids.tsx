import LidsTable from "./ui/lids-table"

export default function LidlarPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold">Lidlar</h1>
        <p className="text-muted-foreground mt-1">Lead management and statistics</p>
      </div>
      <LidsTable />
    </div>
  )
}

