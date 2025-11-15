"use client"

import { useLidsStore, STATUS_LABELS_UZ, SOURCE_LABELS_UZ } from "../utils/lids-store"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Calendar, User, MessageSquare, Clock, X } from "lucide-react"
import { toast } from "sonner"

export default function LidProfile() {
	const profileOpen = useLidsStore(state => state.profileOpen)
	const selectedLid = useLidsStore(state => state.selectedLid)
	const closeProfile = useLidsStore(state => state.closeProfile)
	const onOpen = useLidsStore(state => state.onOpen)
	const convertToStudent = useLidsStore(state => state.convertToStudent)
	const addActionLog = useLidsStore(state => state.addActionLog)

	if (!selectedLid) return null

	const handleEdit = () => {
		closeProfile()
		onOpen(selectedLid)
	}

	const handleConvertToStudent = () => {
		if (selectedLid.status === "converted") {
			toast.error("Bu lead allaqachon studentga aylantirilgan")
			return
		}
		convertToStudent(selectedLid.id)
		toast.success("Lead Studentga aylantirildi")
		closeProfile()
	}

	const handleAddCall = () => {
		addActionLog(selectedLid.id, {
			type: "call",
			description: "Qo'ng'iroq qilindi",
			managerName: selectedLid.managerName,
		})
		toast.success("Qo'ng'iroq qayd etildi")
	}

	return (
		<Dialog open={profileOpen} onOpenChange={closeProfile}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Lead Profili</span>
						<Button variant="ghost" size="icon" onClick={closeProfile}>
							<X className="h-4 w-4" />
						</Button>
					</DialogTitle>
					<DialogDescription>
						{selectedLid.name} - Batafsil ma'lumotlar
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle>Asosiy ma'lumotlar</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">Ism Familiya</p>
										<p className="font-medium">{selectedLid.name}</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">Telefon raqami</p>
										<p className="font-medium">{selectedLid.phoneNumber}</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<MessageSquare className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">Qiziqqan kurs</p>
										<p className="font-medium">{selectedLid.courseType}</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">Qiziqqan vaqti</p>
										<p className="font-medium">
											{new Date(selectedLid.interestedDate).toLocaleDateString("uz-UZ", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
									</div>
								</div>

								{selectedLid.source && (
									<div>
										<p className="text-sm text-muted-foreground">Manba</p>
										<Badge variant="secondary">
											{SOURCE_LABELS_UZ[selectedLid.source]}
										</Badge>
									</div>
								)}

								<div>
									<p className="text-sm text-muted-foreground">Status</p>
									<Badge>{STATUS_LABELS_UZ[selectedLid.status]}</Badge>
								</div>

								{selectedLid.managerName && (
									<div>
										<p className="text-sm text-muted-foreground">Mas'ul menedjer</p>
										<p className="font-medium">{selectedLid.managerName}</p>
									</div>
								)}

								{selectedLid.suitableGroup && (
									<div>
										<p className="text-sm text-muted-foreground">Mos guruh</p>
										<p className="font-medium">{selectedLid.suitableGroup}</p>
									</div>
								)}
							</div>

							{selectedLid.comments && (
								<div>
									<p className="text-sm text-muted-foreground mb-1">Izohlar</p>
									<p className="text-sm">{selectedLid.comments}</p>
								</div>
							)}

							<div>
								<p className="text-sm text-muted-foreground">Yaratilgan sana</p>
								<p className="text-sm">
									{new Date(selectedLid.createdAt).toLocaleDateString("uz-UZ", {
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Action Log */}
					<Card>
						<CardHeader>
							<CardTitle>Harakatlar logi</CardTitle>
							<CardDescription>
								Barcha qo'ng'iroqlar, status o'zgarishlari va izohlar
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{selectedLid.actionLog.length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-4">
										Hozircha harakatlar mavjud emas
									</p>
								) : (
									selectedLid.actionLog
										.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
										.map((log) => (
											<div key={log.id} className="flex gap-3 pb-4 border-b last:border-0">
												<div className="flex-shrink-0">
													{log.type === "call" && (
														<div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
															<Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
														</div>
													)}
													{log.type === "status_change" && (
														<div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
															<Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
														</div>
													)}
													{log.type === "comment" && (
														<div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
															<MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
														</div>
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium">{log.description}</p>
													<div className="flex items-center gap-2 mt-1">
													<p className="text-xs text-muted-foreground">
														{new Date(log.timestamp).toLocaleDateString("uz-UZ", {
															year: "numeric",
															month: "short",
															day: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														})}
													</p>
														{log.managerName && (
															<>
																<span className="text-xs text-muted-foreground">•</span>
																<p className="text-xs text-muted-foreground">{log.managerName}</p>
															</>
														)}
													</div>
												</div>
											</div>
										))
								)}
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="flex flex-wrap gap-2">
						<Button onClick={handleEdit} variant="outline">
							Tahrirlash
						</Button>
						<Button onClick={handleAddCall} variant="outline">
							<Phone className="h-4 w-4 mr-2" />
							Qo'ng'iroq qilindi
						</Button>
						{selectedLid.status !== "converted" && (
							<Button onClick={handleConvertToStudent} className="bg-green-600 hover:bg-green-700">
								Studentga aylantirish
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

