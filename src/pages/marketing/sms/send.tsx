"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { PageLayout } from "@/shared/layout/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useSMSStore,  } from "../utils/sms-store"
import { useStudentsStore } from "../../talabalar/utils/students-store"
import { toast } from "sonner"
import { Send, Loader2, CheckCircle2, XCircle, Clock, Search, ChevronDown, Plus } from "lucide-react"

export default function SendSMS() {
  const templates = useSMSStore(state => state.templates)
  const sendSMS = useSMSStore(state => state.sendSMS)
  const history = useSMSStore(state => state.history)
  const students = useStudentsStore(state => state.students)

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [recipient, setRecipient] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [lastSentId, setLastSentId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Searchable select states
  const [phoneSearch, setPhoneSearch] = useState("")
  const [nameSearch, setNameSearch] = useState("")
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false)
  const [nameDropdownOpen, setNameDropdownOpen] = useState(false)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const phoneDropdownRef = useRef<HTMLDivElement>(null)
  const nameDropdownRef = useRef<HTMLDivElement>(null)

  const selectedTemplate = useMemo(() => {
    return templates.find(t => t.id === selectedTemplateId)
  }, [selectedTemplateId, templates])

  const lastSentSMS = useMemo(() => {
    if (!lastSentId) return null
    return history.find(h => h.id === lastSentId)
  }, [lastSentId, history])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId)
    const template = templates.find(t => t.id === templateId)
    if (template) {
      let content = template.content
      // Replace variables with placeholders or example values
      if (template.variables) {
        template.variables.forEach(variable => {
          const exampleValue = variable === 'name' ? recipientName || 'Ism' :
                              variable === 'amount' ? '500,000' :
                              variable === 'date' ? '2024-01-15' :
                              variable === 'time' ? '10:00' :
                              variable === 'course' ? 'Frontend kursi' : variable
          // Replace all occurrences of the variable
          const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g')
          content = content.replace(regex, exampleValue)
        })
      }
      setMessage(content)
      setPhoneSearch("")
      setNameSearch("")
      setIsModalOpen(true)
    }
  }

  const handleSend = async () => {
    if (!recipient.trim()) {
      toast.error("Telefon raqamini kiriting")
      return
    }
    if (!message.trim()) {
      toast.error("Xabar matnini kiriting")
      return
    }

    // Basic phone number validation
    const phoneRegex = /^\+?998\d{9}$/
    if (!phoneRegex.test(recipient.replace(/\s/g, ''))) {
      toast.error("Telefon raqami noto'g'ri formatda. Masalan: +998901234567")
      return
    }

    setIsSending(true)
    try {
      const finalMessage = message
      await sendSMS(recipient, finalMessage, selectedTemplateId || undefined, recipientName || undefined)
      setLastSentId(history[0]?.id || null)
      toast.success("SMS yuborish boshlandi")
      
      // Reset form
      setRecipient("")
      setRecipientName("")
      setMessage("")
      setSelectedTemplateId("")
      setPhoneSearch("")
      setNameSearch("")
      setPhoneDropdownOpen(false)
      setNameDropdownOpen(false)
      setIsModalOpen(false)
    } catch (error) {
      toast.error("SMS yuborishda xatolik yuz berdi")
    } finally {
      setIsSending(false)
    }
  }

  const getStatusIcon = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda'
      case 'sending':
        return 'Yuborilmoqda...'
      case 'sent':
        return 'Yuborildi'
      case 'delivered':
        return 'Yetkazildi'
      case 'failed':
        return 'Xatolik'
      default:
        return status
    }
  }

  // Filter students for phone search
  const filteredPhones = useMemo(() => {
    if (!phoneSearch.trim()) return students.slice(0, 10)
    const query = phoneSearch.toLowerCase()
    return students.filter(s => 
      s.phone.toLowerCase().includes(query) || 
      s.fullName.toLowerCase().includes(query)
    ).slice(0, 10)
  }, [phoneSearch, students])

  // Filter students for name search
  const filteredNames = useMemo(() => {
    if (!nameSearch.trim()) return students.slice(0, 10)
    const query = nameSearch.toLowerCase()
    return students.filter(s => 
      s.fullName.toLowerCase().includes(query) ||
      s.phone.toLowerCase().includes(query)
    ).slice(0, 10)
  }, [nameSearch, students])

  // Handle phone selection
  const handlePhoneSelect = (phone: string, name: string) => {
    setRecipient(phone)
    setRecipientName(name)
    setPhoneSearch(phone)
    setPhoneDropdownOpen(false)
    // Update message if template has name variable
    if (selectedTemplate?.variables?.includes('name')) {
      let updatedMessage = selectedTemplate.content
      selectedTemplate.variables.forEach(variable => {
        const value = variable === 'name' ? name :
                      variable === 'amount' ? '500,000' :
                      variable === 'date' ? '2024-01-15' :
                      variable === 'time' ? '10:00' :
                      variable === 'course' ? 'Frontend kursi' : variable
        const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g')
        updatedMessage = updatedMessage.replace(regex, value)
      })
      setMessage(updatedMessage)
    }
  }

  // Handle name selection
  const handleNameSelect = (name: string, phone: string) => {
    setRecipientName(name)
    setRecipient(phone)
    setNameSearch(name)
    setNameDropdownOpen(false)
    // Update message if template has name variable
    if (selectedTemplate?.variables?.includes('name')) {
      let updatedMessage = selectedTemplate.content
      selectedTemplate.variables.forEach(variable => {
        const value = variable === 'name' ? name :
                      variable === 'amount' ? '500,000' :
                      variable === 'date' ? '2024-01-15' :
                      variable === 'time' ? '10:00' :
                      variable === 'course' ? 'Frontend kursi' : variable
        const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g')
        updatedMessage = updatedMessage.replace(regex, value)
      })
      setMessage(updatedMessage)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(event.target as Node) && 
          phoneInputRef.current && !phoneInputRef.current.contains(event.target as Node)) {
        setPhoneDropdownOpen(false)
      }
      if (nameDropdownRef.current && !nameDropdownRef.current.contains(event.target as Node) &&
          nameInputRef.current && !nameInputRef.current.contains(event.target as Node)) {
        setNameDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <PageLayout title="SMS xabar yuborish">
      <div className="space-y-6">
        {/* Header with Button */}
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Shablon qo'shish
            </Button>
          </div>
        </div>
        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-3">
                  {template.content}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Button
                  onClick={() => handleTemplateSelect(template.id)}
                  className="w-full"
                  variant="default"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Yuborish
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Send SMS Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>SMS yuborish</DialogTitle>
              <DialogDescription>
                {selectedTemplate && `Shablon: ${selectedTemplate.name}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="modal-recipient">Telefon raqami *</Label>
                <div className="relative" ref={phoneDropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      ref={phoneInputRef}
                      id="modal-recipient"
                      placeholder="Qidirish yoki telefon raqamini kiriting..."
                      value={phoneSearch}
                      onChange={(e) => {
                        const value = e.target.value
                        setPhoneSearch(value)
                        setRecipient(value)
                        
                        // Only open dropdown if user is typing
                        if (value.trim()) {
                          setPhoneDropdownOpen(true)
                        } else {
                          setPhoneDropdownOpen(false)
                        }
                        
                        // Auto-fill name if phone matches a student
                        const normalizedValue = value.replace(/\s/g, '').replace(/^\+/, '')
                        const matchedStudent = students.find(s => {
                          const normalizedPhone = s.phone.replace(/\s/g, '').replace(/^\+/, '')
                          return normalizedPhone === normalizedValue || 
                                 normalizedPhone.endsWith(normalizedValue) ||
                                 normalizedValue.endsWith(normalizedPhone.slice(-9)) // Match last 9 digits
                        })
                        
                        if (matchedStudent && value.trim()) {
                          setRecipientName(matchedStudent.fullName)
                          setNameSearch(matchedStudent.fullName)
                          // Update message if template has name variable
                          if (selectedTemplate?.variables?.includes('name')) {
                            let updatedMessage = selectedTemplate.content
                            selectedTemplate.variables.forEach(variable => {
                              const varValue = variable === 'name' ? matchedStudent.fullName :
                                            variable === 'amount' ? '500,000' :
                                            variable === 'date' ? '2024-01-15' :
                                            variable === 'time' ? '10:00' :
                                            variable === 'course' ? 'Frontend kursi' : variable
                              const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g')
                              updatedMessage = updatedMessage.replace(regex, varValue)
                            })
                            setMessage(updatedMessage)
                          }
                        } else if (!value.trim()) {
                          // Clear name if phone is cleared
                          setRecipientName("")
                          setNameSearch("")
                        }
                      }}
                      onFocus={(e) => {
                        // Only open if there's text or user clicks the chevron area
                        if (e.target.value.trim()) {
                          setPhoneDropdownOpen(true)
                        }
                      }}
                      className="pl-9 pr-9"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                  {phoneDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
                      {filteredPhones.length > 0 ? (
                        filteredPhones.map((student) => (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => handlePhoneSelect(student.phone, student.fullName)}
                            className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex flex-col"
                          >
                            <span className="font-medium">{student.fullName}</span>
                            <span className="text-sm text-muted-foreground">{student.phone}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          Natija topilmadi
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-recipientName">Ism (ixtiyoriy)</Label>
                <div className="relative" ref={nameDropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      ref={nameInputRef}
                      id="modal-recipientName"
                      placeholder="Qidirish yoki ism kiriting..."
                      value={nameSearch}
                      onChange={(e) => {
                        const value = e.target.value
                        setNameSearch(value)
                        setRecipientName(value)
                        
                        // Only open dropdown if user is typing
                        if (value.trim()) {
                          setNameDropdownOpen(true)
                        } else {
                          setNameDropdownOpen(false)
                        }
                        
                        // Update message with new name if template has name variable
                        if (selectedTemplate?.variables?.includes('name')) {
                          let updatedMessage = selectedTemplate.content
                          selectedTemplate.variables.forEach(variable => {
                            const varValue = variable === 'name' ? (value || 'Ism') :
                                          variable === 'amount' ? '500,000' :
                                          variable === 'date' ? '2024-01-15' :
                                          variable === 'time' ? '10:00' :
                                          variable === 'course' ? 'Frontend kursi' : variable
                            const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g')
                            updatedMessage = updatedMessage.replace(regex, varValue)
                          })
                          setMessage(updatedMessage)
                        }
                      }}
                      onFocus={(e) => {
                        // Only open if there's text
                        if (e.target.value.trim()) {
                          setNameDropdownOpen(true)
                        }
                      }}
                      className="pl-9 pr-9"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                  {nameDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
                      {filteredNames.length > 0 ? (
                        filteredNames.map((student) => (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => handleNameSelect(student.fullName, student.phone)}
                            className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex flex-col"
                          >
                            <span className="font-medium">{student.fullName}</span>
                            <span className="text-sm text-muted-foreground">{student.phone}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          Natija topilmadi
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedTemplate && selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">
                    O'zgaruvchilar: {selectedTemplate.variables.join(', ')}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="modal-message">Xabar matni *</Label>
                <Textarea
                  id="modal-message"
                  placeholder="Xabar matnini kiriting..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {message.length} belgi
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false)
                  setRecipient("")
                  setRecipientName("")
                  setMessage("")
                  setSelectedTemplateId("")
                  setPhoneSearch("")
                  setNameSearch("")
                  setPhoneDropdownOpen(false)
                  setNameDropdownOpen(false)
                }}
              >
                Bekor qilish
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending || !recipient.trim() || !message.trim()}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Yuborish
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Card */}
        {lastSentSMS && (
          <Card>
            <CardHeader>
              <CardTitle>Yuborish holati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(lastSentSMS.status)}
                  <div>
                    <div className="font-medium">{lastSentSMS.recipient}</div>
                    <div className="text-sm text-muted-foreground">
                      {getStatusText(lastSentSMS.status)}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    lastSentSMS.status === 'delivered' ? 'default' :
                    lastSentSMS.status === 'failed' ? 'destructive' :
                    lastSentSMS.status === 'sent' ? 'default' :
                    'secondary'
                  }
                >
                  {getStatusText(lastSentSMS.status)}
                </Badge>
              </div>
              {lastSentSMS.error && (
                <div className="mt-2 text-sm text-destructive">{lastSentSMS.error}</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}

