import { createContext, useContext, useState, type ReactNode } from "react"

export interface Branch {
  id: string
  name: string
  city: string
  address?: string
  phone?: string
  manager?: string
  status?: "active" | "inactive"
}

const defaultBranches: Branch[] = [
  { id: "1", name: "Toshkent filiali", city: "Toshkent", status: "active" },
  { id: "2", name: "Samarqand filiali", city: "Samarqand", status: "active" },
  { id: "3", name: "Buxoro filiali", city: "Buxoro", status: "active" },
]

interface BranchContextType {
  selectedBranch: string | null
  branches: Branch[]
  setSelectedBranch: (branchId: string | "all") => void
  getSelectedBranch: () => Branch | undefined
  isAllBranches: boolean
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranchState] = useState<string | null>(() => {
    // Get from localStorage or default to "all"
    const saved = localStorage.getItem("selectedBranch")
    if (saved === "all" || !saved) return null // null means "all branches"
    return saved
  })

  const [branches] = useState<Branch[]>(defaultBranches)

  const setSelectedBranch = (branchId: string | "all") => {
    setSelectedBranchState(branchId === "all" ? null : branchId)
    localStorage.setItem("selectedBranch", branchId === "all" ? "all" : branchId)
  }

  const getSelectedBranch = () => {
    if (selectedBranch === null) return undefined
    return branches.find(b => b.id === selectedBranch)
  }

  const isAllBranches = selectedBranch === null

  return (
    <BranchContext.Provider
      value={{
        selectedBranch,
        branches,
        setSelectedBranch,
        getSelectedBranch,
        isAllBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider")
  }
  return context
}

