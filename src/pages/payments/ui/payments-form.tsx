"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  usePaymentsStore,
  PAYMENT_TYPE_LABELS_UZ,
  PAYMENT_STATUS_LABELS_UZ,
  type PaymentType,
  type PaymentStatus,
} from "../utils/payments-store"
import { useStudentsStore } from "../../talabalar/utils/students-store"
import { toast } from "sonner"

export default function PaymentsForm() {
  const addPayment = usePaymentsStore((state) => state.addPayment)
  const onClose = usePaymentsStore((state) => state.onClose)
  const data = usePaymentsStore((state) => state.data)
  const updatePayment = usePaymentsStore((state) => state.updatePayment)
  const students = useStudentsStore((state) => state.students)

  const [studentId, setStudentId] = useState("")
  const [studentName, setStudentName] = useState("")
  const [course, setCourse] = useState("")
  const [paymentType, setPaymentType] = useState<PaymentType>("cash")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [operator, setOperator] = useState("Admin")
  const [status, setStatus] = useState<PaymentStatus>("paid")
  const [notes, setNotes] = useState("")
  const [generateReceipt, setGenerateReceipt] = useState(true)
  const [sendReceiptSMS, setSendReceiptSMS] = useState(false)
  const [sendReceiptTelegram, setSendReceiptTelegram] = useState(false)

  // When student changes, update name and courses
  useEffect(() => {
    const selectedStudent = students.find(s => s.id === studentId)
    if (selectedStudent) {
      setStudentName(selectedStudent.fullName)
      if (selectedStudent.courses.length > 0) {
        setCourse(selectedStudent.courses[0].name)
      }
    }
  }, [studentId, students])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!studentId || !course || !amount || !date) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring")
      return
    }

    const paymentData = {
      studentId,
      studentName,
      course,
      paymentType,
      amount: parseInt(amount),
      date,
      operator,
      status,
      notes: notes.trim() || undefined,
      receipt: generateReceipt ? `REC-${Date.now()}` : undefined,
    }

    if (data) {
      updatePayment({ ...data, ...paymentData })
      toast.success("To'lov muvaffaqiyatli yangilandi")
    } else {
      addPayment(paymentData)
      toast.success("To'lov muvaffaqiyatli qo'shildi")
    }

    // Handle receipt actions
    if (generateReceipt) {
      toast.info("Chek generatsiya qilindi")
    }
    if (sendReceiptSMS) {
      toast.info("Chek SMS orqali yuborildi")
    }
    if (sendReceiptTelegram) {
      toast.info("Chek Telegram orqali yuborildi")
    }

    // Reset
    setStudentId("")
    setStudentName("")
    setCourse("")
    setPaymentType("cash")
    setAmount("")
    setDate("")
    setOperator("Admin")
    setStatus("paid")
    setNotes("")
    setGenerateReceipt(true)
    setSendReceiptSMS(false)
    setSendReceiptTelegram(false)
    onClose()
  }

  useEffect(() => {
    if (data) {
      setStudentId(data.studentId)
      setStudentName(data.studentName)
      setCourse(data.course)
      setPaymentType(data.paymentType)
      setAmount(data.amount.toString())
      setDate(data.date)
      setOperator(data.operator)
      setStatus(data.status)
      setNotes(data.notes || "")
    } else {
      setStudentId("")
      setStudentName("")
      setCourse("")
      setPaymentType("cash")
      setAmount("")
      setDate(new Date().toISOString().split("T")[0])
      setOperator("Admin")
      setStatus("paid")
      setNotes("")
      setGenerateReceipt(true)
      setSendReceiptSMS(false)
      setSendReceiptTelegram(false)
    }
  }, [data])

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1 block text-sm font-medium">Talaba *</Label>
          <Select value={studentId} onValueChange={setStudentId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Talaba tanlang" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.fullName} - {student.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1 block text-sm font-medium">Kurs *</Label>
          <Input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Kurs nomi"
            readOnly={!!studentId} // If student selected, course is auto-filled
          />
        </div>

        <div>
          <Label className="mb-1 block text-sm font-medium">To'lov turi *</Label>
          <Select value={paymentType} onValueChange={(v: string) => setPaymentType(v as PaymentType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="To'lov turi tanlang" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PAYMENT_TYPE_LABELS_UZ).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1 block text-sm font-medium">Summa *</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="300000"
          />
        </div>

        <div>
          <Label className="mb-1 block text-sm font-medium">Sana *</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-1 block text-sm font-medium">Operator</Label>
          <Input
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            placeholder="Admin"
          />
        </div>

        <div>
          <Label className="mb-1 block text-sm font-medium">Status</Label>
          <Select value={status} onValueChange={(v: string) => setStatus(v as PaymentStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status tanlang" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PAYMENT_STATUS_LABELS_UZ).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="md:col-span-2">
        <Label className="mb-1 block text-sm font-medium">Izoh</Label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Qo'shimcha izoh"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Chek opsiyalari</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="generateReceipt"
            checked={generateReceipt}
            onCheckedChange={(checked) => setGenerateReceipt(checked === true)}
          />
          <Label htmlFor="generateReceipt" className="text-sm">Chek generatsiya qilish (PDF)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sendReceiptSMS"
            checked={sendReceiptSMS}
            onCheckedChange={(checked) => setSendReceiptSMS(checked === true)}
          />
          <Label htmlFor="sendReceiptSMS" className="text-sm">SMS orqali chek yuborish</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sendReceiptTelegram"
            checked={sendReceiptTelegram}
            onCheckedChange={(checked) => setSendReceiptTelegram(checked === true)}
          />
          <Label htmlFor="sendReceiptTelegram" className="text-sm">Telegram orqali chek yuborish</Label>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" className="cursor-pointer">
          {data ? "Yangilash" : "Saqlash"}
        </Button>
        {generateReceipt && (
          <Button type="button" variant="outline" className="cursor-pointer">
            Chekni chiqarish
          </Button>
        )}
        <Button variant="outline" type="button" onClick={() => onClose()} className="cursor-pointer">
          Bekor qilish
        </Button>
      </div>
    </form>
  )
}