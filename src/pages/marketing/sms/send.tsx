"use client"

import { useState, useMemo } from "react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useSMSStore,  } from "../utils/sms-store"
import { useLidsStore } from "../../lidlar/utils/lids-store"
import { toast } from "sonner"
import { Send, Loader2, CheckCircle2, XCircle, Clock, ChevronsUpDown, Plus, Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SendSMS() {
  const templates = useSMSStore(state => state.templates)
  const sendSMS = useSMSStore(state => state.sendSMS)
  const history = useSMSStore(state => state.history)
  const lids = useLidsStore(state => state.lids)

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [recipient, setRecipient] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [lastSentId, setLastSentId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Combobox states
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [nameOpen, setNameOpen] = useState(false)
  const [phoneValue, setPhoneValue] = useState("")
  const [nameValue, setNameValue] = useState("")

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
                              variable === 'date' ? new Date().toLocaleDateString('uz-UZ') :
                              variable === 'time' ? new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) :
                              variable === 'course' ? 'Frontend kursi' : variable
          // Replace all occurrences of the variable
          const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g')
          content = content.replace(regex, exampleValue)
        })
      }
      setMessage(content)
      setPhoneValue("")
      setNameValue("")
      setRecipient("")
      setRecipientName("")
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
      setPhoneValue("")
      setNameValue("")
      setPhoneOpen(false)
      setNameOpen(false)
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

  // Update message when lid is selected
  const updateMessageWithLid = (name: string, phone: string) => {
    if (selectedTemplate?.variables) {
      let updatedMessage = selectedTemplate.content
      selectedTemplate.variables.forEach(variable => {
        const value = variable === 'name' ? name :
                      variable === 'amount' ? '500,000' :
                      variable === 'date' ? new Date().toLocaleDateString('uz-UZ') :
                      variable === 'time' ? new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) :
                      variable === 'course' ? lids.find(l => l.phoneNumber === phone || l.name === name)?.courseType || 'Frontend kursi' : variable
        const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g')
        updatedMessage = updatedMessage.replace(regex, value)
      })
      setMessage(updatedMessage)
    }
  }

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
                <Label htmlFor="modal-recipient" className="text-sm">Telefon raqami *</Label>
                <Popover open={phoneOpen} onOpenChange={setPhoneOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={phoneOpen}
                      className="w-full justify-between h-9 text-sm font-normal"
                    >
                      {recipient || phoneValue
                        ? recipient || phoneValue
                        : "Qidirish yoki telefon raqamini kiriting..."}
                      <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="flex flex-col">
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                          placeholder="Qidirish yoki telefon raqamini kiriting..."
                          value={recipient}
                          onChange={(e) => {
                            const value = e.target.value
                            setRecipient(value)
                            setPhoneValue(value)
                            const normalizedValue = value.replace(/\s/g, '').replace(/^\+/, '')
                            const matchedLid = lids.find(lid => {
                              const normalizedPhone = lid.phoneNumber.replace(/\s/g, '').replace(/^\+/, '')
                              return normalizedPhone === normalizedValue || 
                                     normalizedPhone.endsWith(normalizedValue) ||
                                     normalizedValue.endsWith(normalizedPhone.slice(-9))
                            })
                            if (matchedLid && value.trim()) {
                              setRecipientName(matchedLid.name)
                              setNameValue(matchedLid.name)
                              updateMessageWithLid(matchedLid.name, matchedLid.phoneNumber)
                            } else if (!value.trim()) {
                              setRecipientName("")
                              setNameValue("")
                            }
                          }}
                          className="h-9 text-sm border-0 focus-visible:ring-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {lids
                          .filter(lid => {
                            if (!recipient.trim()) return true
                            const search = recipient.toLowerCase()
                            return lid.name.toLowerCase().includes(search) || 
                                   lid.phoneNumber.toLowerCase().includes(search)
                          })
                          .map((lid) => {
                            const isSelected = phoneValue === lid.phoneNumber
                            return (
                              <button
                                key={lid.id}
                                type="button"
                                onClick={() => {
                                  setPhoneValue(lid.phoneNumber)
                                  setRecipient(lid.phoneNumber)
                                  setRecipientName(lid.name)
                                  setNameValue(lid.name)
                                  setPhoneOpen(false)
                                  updateMessageWithLid(lid.name, lid.phoneNumber)
                                }}
                                className={cn(
                                  "w-full flex items-center px-2 py-1.5 text-sm text-left rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                                  isSelected && "bg-accent"
                                )}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col flex-1">
                                  <span className="font-medium">{lid.name}</span>
                                  <span className="text-xs text-muted-foreground">{lid.phoneNumber}</span>
                                </div>
                              </button>
                            )
                          })}
                        {lids.filter(lid => {
                          if (!recipient.trim()) return false
                          const search = recipient.toLowerCase()
                          return !lid.name.toLowerCase().includes(search) && 
                                 !lid.phoneNumber.toLowerCase().includes(search)
                        }).length === lids.length && recipient.trim() && (
                          <div className="p-2">
                            <Input
                              placeholder="Qidirish yoki telefon raqamini kiriting..."
                              value={recipient}
                              onChange={(e) => {
                                const value = e.target.value
                                setRecipient(value)
                                setPhoneValue(value)
                              }}
                              className="h-8 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-recipientName" className="text-sm">Ism (ixtiyoriy)</Label>
                <Popover open={nameOpen} onOpenChange={setNameOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={nameOpen}
                      className="w-full justify-between h-9 text-sm font-normal"
                    >
                      {recipientName || nameValue
                        ? recipientName || nameValue
                        : "Qidirish yoki ism kiriting..."}
                      <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="flex flex-col">
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                          placeholder="Qidirish yoki ism kiriting..."
                          value={recipientName}
                          onChange={(e) => {
                            const value = e.target.value
                            setRecipientName(value)
                            setNameValue(value)
                            updateMessageWithLid(value, recipient)
                          }}
                          className="h-9 text-sm border-0 focus-visible:ring-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {lids
                          .filter(lid => {
                            if (!recipientName.trim()) return true
                            const search = recipientName.toLowerCase()
                            return lid.name.toLowerCase().includes(search) || 
                                   lid.phoneNumber.toLowerCase().includes(search)
                          })
                          .map((lid) => {
                            const isSelected = nameValue === lid.name
                            return (
                              <button
                                key={lid.id}
                                type="button"
                                onClick={() => {
                                  setNameValue(lid.name)
                                  setRecipientName(lid.name)
                                  setRecipient(lid.phoneNumber)
                                  setPhoneValue(lid.phoneNumber)
                                  setNameOpen(false)
                                  updateMessageWithLid(lid.name, lid.phoneNumber)
                                }}
                                className={cn(
                                  "w-full flex items-center px-2 py-1.5 text-sm text-left rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                                  isSelected && "bg-accent"
                                )}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col flex-1">
                                  <span className="font-medium">{lid.name}</span>
                                  <span className="text-xs text-muted-foreground">{lid.phoneNumber}</span>
                                </div>
                              </button>
                            )
                          })}
                        {lids.filter(lid => {
                          if (!recipientName.trim()) return false
                          const search = recipientName.toLowerCase()
                          return !lid.name.toLowerCase().includes(search) && 
                                 !lid.phoneNumber.toLowerCase().includes(search)
                        }).length === lids.length && recipientName.trim() && (
                          <div className="p-2">
                            <Input
                              placeholder="Qidirish yoki ism kiriting..."
                              value={recipientName}
                              onChange={(e) => {
                                const value = e.target.value
                                setRecipientName(value)
                                setNameValue(value)
                              }}
                              className="h-8 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
                  setPhoneValue("")
                  setNameValue("")
                  setPhoneOpen(false)
                  setNameOpen(false)
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

