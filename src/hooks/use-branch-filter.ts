import { useMemo } from "react"
import { useBranch } from "@/contexts/branch-context"

/**
 * Hook to filter data by selected branch
 * @param data Array of items that may have branchId property
 * @returns Filtered array based on selected branch
 */
export function useBranchFilter<T extends { branchId?: string }>(data: T[]): T[] {
  const { selectedBranch, isAllBranches } = useBranch()

  return useMemo(() => {
    // If "all" is selected or no branch selected, return all data
    if (isAllBranches || !selectedBranch) {
      return data
    }
    
    // Filter by branchId, or include items without branchId (for backward compatibility)
    return data.filter((item) => {
      // If item has no branchId, include it (for existing data)
      // If item has branchId, only include if it matches selected branch
      return !item.branchId || item.branchId === selectedBranch
    })
  }, [data, selectedBranch, isAllBranches])
}

