"use client"

import { useState, useMemo } from "react"
import { PageLayout } from "@/shared/layout/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useSMSStore,  } from "../utils/sms-store"
import { toast } from "sonner"
import { Send, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SendSMS() {
  const templates = useSMSStore(state => state.templates)
  const sendSMS = useSMSStore(state => state.sendSMS)
  const history = useSMSStore(state => state.history)

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [recipient, setRecipient] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [lastSentId, setLastSentId] = useState<string | null>(null)

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

  const templateGroups = useMemo(() => {
    const groups: Record<string, typeof templates> = {}
    templates.forEach(template => {
      const groupName = template.type === 'custom' ? 'Boshqa' : 
                       template.type === 'welcome' ? 'Xush kelibsiz' :
                       template.type === 'payment_reminder' ? 'To\'lov eslatmalari' :
                       template.type === 'class_reminder' ? 'Dars eslatmalari' :
                       template.type === 'exam_notification' ? 'Imtihon xabarlari' :
                       template.type === 'birthday' ? 'Bayramlar' :
                       template.type === 'holiday' ? 'Bayramlar' : 'Boshqa'
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(template)
    })
    return groups
  }, [templates])

  return (
    <PageLayout title="SMS yuborish">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS yuborish</CardTitle>
              <CardDescription>
                Telefon raqamiga SMS xabar yuboring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Telefon raqami *</Label>
                <Input
                  id="recipient"
                  placeholder="+998901234567"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientName">Ism (ixtiyoriy)</Label>
                <Input
                  id="recipientName"
                  placeholder="Ism Familiya"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Shablon tanlash (ixtiyoriy)</Label>
                <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Shablon tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(templateGroups).map(([groupName, groupTemplates]) => (
                      <div key={groupName}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          {groupName}
                        </div>
                        {groupTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">{selectedTemplate.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                      <span>O'zgaruvchilar: {selectedTemplate.variables.join(', ')}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Xabar matni *</Label>
                <Textarea
                  id="message"
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

              <Button
                onClick={handleSend}
                disabled={isSending || !recipient.trim() || !message.trim()}
                className="w-full"
                size="lg"
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
            </CardContent>
          </Card>

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

        {/* Templates Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shablonlar</CardTitle>
              <CardDescription>
                Tayyor shablonlardan foydalaning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(templateGroups).map(([groupName, groupTemplates]) => (
                <div key={groupName}>
                  <div className="text-sm font-semibold text-muted-foreground mb-2">
                    {groupName}
                  </div>
                  <div className="space-y-2">
                    {groupTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-colors",
                          selectedTemplateId === template.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {template.content.substring(0, 60)}...
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

