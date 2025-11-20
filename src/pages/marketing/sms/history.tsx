"use client"

import { useMemo, useState, useEffect } from "react"
import { PageLayout } from "@/shared/layout/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSMSStore, type SMSStatus } from "../utils/sms-store"
import { Search, CheckCircle2, XCircle, Clock, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
// Date formatting helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

export default function SMSHistory() {
  const history = useSMSStore(state => state.history)
  const templates = useSMSStore(state => state.templates)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<SMSStatus | "all">("all")
  const [templateFilter, setTemplateFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredHistory = useMemo(() => {
    return history.filter(record => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesRecipient = record.recipient.toLowerCase().includes(query)
        const matchesName = record.recipientName?.toLowerCase().includes(query) || false
        const matchesMessage = record.message.toLowerCase().includes(query)
        if (!matchesRecipient && !matchesName && !matchesMessage) return false
      }

      // Status filter
      if (statusFilter !== "all" && record.status !== statusFilter) return false

      // Template filter
      if (templateFilter !== "all" && record.templateId !== templateFilter) return false

      return true
    })
  }, [history, searchQuery, statusFilter, templateFilter])

  // Pagination calculations
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedHistory = filteredHistory.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, templateFilter])

  const getStatusIcon = (status: SMSStatus) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'sending':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: SMSStatus) => {
    const variants: Record<SMSStatus, "default" | "destructive" | "secondary"> = {
      pending: "secondary",
      sending: "secondary",
      sent: "default",
      delivered: "default",
      failed: "destructive",
    }

    const labels: Record<SMSStatus, string> = {
      pending: "Kutilmoqda",
      sending: "Yuborilmoqda",
      sent: "Yuborildi",
      delivered: "Yetkazildi",
      failed: "Xatolik",
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const stats = useMemo(() => {
    const total = history.length
    const sent = history.filter(h => h.status === 'sent' || h.status === 'delivered').length
    const failed = history.filter(h => h.status === 'failed').length
    const pending = history.filter(h => h.status === 'pending' || h.status === 'sending').length

    return { total, sent, failed, pending }
  }, [history])

  return (
    <PageLayout title="SMS tarixi">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Jami SMS</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Yuborilgan</CardDescription>
              <CardTitle className="text-2xl text-green-600">{stats.sent}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Kutilmoqda</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Xatolik</CardDescription>
              <CardTitle className="text-2xl text-red-600">{stats.failed}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtrlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SMSStatus | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Holat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha holatlar</SelectItem>
                  <SelectItem value="pending">Kutilmoqda</SelectItem>
                  <SelectItem value="sending">Yuborilmoqda</SelectItem>
                  <SelectItem value="sent">Yuborildi</SelectItem>
                  <SelectItem value="delivered">Yetkazildi</SelectItem>
                  <SelectItem value="failed">Xatolik</SelectItem>
                </SelectContent>
              </Select>
              <Select value={templateFilter} onValueChange={setTemplateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Shablon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha shablonlar</SelectItem>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>SMS tarixi</CardTitle>
            <CardDescription>
              Yuborilgan SMS xabarlar ro'yxati
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                SMS tarixi bo'sh
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Holat</TableHead>
                        <TableHead>Qabul qiluvchi</TableHead>
                        <TableHead>Xabar</TableHead>
                        <TableHead>Shablon</TableHead>
                        <TableHead>Yuborilgan vaqti</TableHead>
                        <TableHead>Yetkazilgan vaqti</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            SMS tarixi bo'sh
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedHistory.map((record) => {
                          const template = record.templateId
                            ? templates.find(t => t.id === record.templateId)
                            : null

                          return (
                            <TableRow key={record.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(record.status)}
                                  {getStatusBadge(record.status)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{record.recipient}</div>
                                  {record.recipientName && (
                                    <div className="text-sm text-muted-foreground">
                                      {record.recipientName}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-md">
                                  <p className="text-sm line-clamp-2">{record.message}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {template ? (
                                  <Badge variant="outline">{template.name}</Badge>
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {formatDate(record.sentAt)}
                                </div>
                              </TableCell>
                              <TableCell>
                                {record.deliveredAt ? (
                                  <div className="text-sm">
                                    {formatDate(record.deliveredAt)}
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      {startIndex + 1}-{Math.min(endIndex, filteredHistory.length)} dan {filteredHistory.length} ta
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Oldingi
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="cursor-pointer min-w-[40px]"
                              >
                                {page}
                              </Button>
                            )
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2">...</span>
                          }
                          return null
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="cursor-pointer"
                      >
                        Keyingi
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

