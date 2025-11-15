import { TeacherStatistics } from "@/pages/dashboard/ui/teacher-statistics"

export default function Oqituvchilar() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <p className="text-muted-foreground mt-1">Teacher statistics and information</p>
      </div>
      <div className="w-full">
        <TeacherStatistics />
      </div>
    </div>
  )
}