import type { Table } from "@tanstack/react-table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface TablePaginationProps<TData> {
  table: Table<TData>
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const total = totalPages
    const current = currentPage

    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (current <= 3) {
        // Near the beginning
        pages.push(2, 3, 4, "ellipsis", total)
      } else if (current >= total - 2) {
        // Near the end
        pages.push("ellipsis", total - 3, total - 2, total - 1, total)
      } else {
        // In the middle
        pages.push("ellipsis", current - 1, current, current + 1, "ellipsis", total)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            size="default"
            onClick={(e) => {
              e.preventDefault()
              table.previousPage()
            }}
            className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  table.setPageIndex(page - 1)
                }}
                isActive={page === currentPage}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            size="default"
            onClick={(e) => {
              e.preventDefault()
              table.nextPage()
            }}
            className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

