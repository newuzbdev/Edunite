import { create } from 'zustand'

export type GroupStatus = 'active' | 'new' | 'finished'
export type LessonType = 'online' | 'offline'

export interface Teacher {
  id: string
  name: string
  phone: string
  email?: string
}

export interface Course {
  id: string
  name: string
  description?: string
}

export interface Room {
  id: string
  name: string
  capacity: number
  type: 'classroom' | 'lab' | 'online'
}

export interface Lesson {
  groupName: string
  courseName: string
  roomName: string
  studentCount: number
  id: string
  groupId: string
  date: string
  startTime: string
  endTime: string
  teacherId: string
  roomId?: string
  type: LessonType
  notes?: string
}

export interface Group {
  id: string
  name: string
  courseId: string
  course: Course
  teacherId: string
  teacher: Teacher
  schedule: string // e.g., "Dush-Chors-Juma, 18:00-19:30"
  roomId?: string
  room?: Room
  maxStudents: number
  currentStudents: number
  status: GroupStatus
  createdDate: string
  lessons: Lesson[]
  zoomLink?: string
}

interface GroupsStore {
  open: boolean
  groups: Group[]
  data: Group | null
  onOpen: (data?: Group | null) => void
  onClose: () => void
  addGroup: (group: Omit<Group, 'id' | 'lessons' | 'currentStudents'>) => void
  updateGroup: (group: Group) => void
  deleteGroup: (id: string) => void
  addLesson: (groupId: string, lesson: Omit<Lesson, 'id'>) => void
  updateLesson: (lessonId: string, lesson: Partial<Lesson>) => void
  deleteLesson: (lessonId: string) => void
  getLessonsByDateRange: (startDate: string, endDate: string) => Lesson[]
  checkScheduleConflict: (lesson: Omit<Lesson, 'id'>) => boolean
}

export const GROUP_STATUS_LABELS_UZ: Record<GroupStatus, string> = {
  active: 'Aktiv',
  new: 'Yangi',
  finished: 'Tugagan',
}

export const LESSON_TYPE_LABELS_UZ: Record<LessonType, string> = {
  online: 'Online',
  offline: 'Offline',
}

export const DAYS_OF_WEEK = [
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
  'Yakshanba'
]

export const useGroupsStore = create<GroupsStore>((set, get) => ({
  open: false,
  groups: [
    {
      id: '1',
      name: 'Ona-Tili-1',
      courseId: 'c1',
      course: {
        id: 'c1',
        name: 'Ona tili - Boshlang\'ich',
        description: 'O\'zbek tili grammatikasi va adabiyot asoslari'
      },
      teacherId: 't1',
      teacher: {
        id: 't1',
        name: 'Dilbar Toshmatova',
        phone: '+998901234567',
        email: 'dilbar@edunite.uz'
      },
      schedule: 'Dush-Chors-Juma, 16:00-17:30',
      roomId: 'r1',
      room: {
        id: 'r1',
        name: 'Xona-1',
        capacity: 20,
        type: 'classroom'
      },
      maxStudents: 18,
      currentStudents: 15,
      status: 'active',
      createdDate: '2024-01-15',
      lessons: [],
    },
    {
      id: '2',
      name: 'English-Beginner-1',
      courseId: 'c2',
      course: {
        id: 'c2',
        name: 'English - Beginner',
        description: 'Ingliz tili boshlang\'ich daraja'
      },
      teacherId: 't2',
      teacher: {
        id: 't2',
        name: 'Akmal O\'qituvchi',
        phone: '+998901234568',
        email: 'akmal@edunite.uz'
      },
      schedule: 'Sesh-Paysh-Shanba, 17:00-18:30',
      roomId: 'r2',
      room: {
        id: 'r2',
        name: 'Xona-2',
        capacity: 20,
        type: 'classroom'
      },
      maxStudents: 16,
      currentStudents: 14,
      status: 'active',
      createdDate: '2024-01-20',
      lessons: [],
    },
    {
      id: '3',
      name: 'English-Intermediate-1',
      courseId: 'c3',
      course: {
        id: 'c3',
        name: 'English - Intermediate',
        description: 'Ingliz tili o\'rta daraja'
      },
      teacherId: 't3',
      teacher: {
        id: 't3',
        name: 'Gulnora Karimova',
        phone: '+998901234569',
        email: 'gulnora@edunite.uz'
      },
      schedule: 'Dush-Chors-Juma, 18:00-19:30',
      roomId: 'r3',
      room: {
        id: 'r3',
        name: 'Xona-3',
        capacity: 18,
        type: 'classroom'
      },
      maxStudents: 15,
      currentStudents: 12,
      status: 'active',
      createdDate: '2024-01-18',
      lessons: [],
    },
    {
      id: '4',
      name: 'English-Advanced-1',
      courseId: 'c4',
      course: {
        id: 'c4',
        name: 'English - Advanced',
        description: 'Ingliz tili yuqori daraja'
      },
      teacherId: 't4',
      teacher: {
        id: 't4',
        name: 'Bobur Ismoilov',
        phone: '+998901234570',
        email: 'bobur@edunite.uz'
      },
      schedule: 'Sesh-Paysh, 19:00-21:00',
      roomId: 'r4',
      room: {
        id: 'r4',
        name: 'Xona-4',
        capacity: 15,
        type: 'classroom'
      },
      maxStudents: 12,
      currentStudents: 10,
      status: 'active',
      createdDate: '2024-01-22',
      lessons: [],
    },
    {
      id: '5',
      name: 'IELTS-1',
      courseId: 'c5',
      course: {
        id: 'c5',
        name: 'IELTS tayyorlov',
        description: 'IELTS imtihoniga tayyorlov kursi'
      },
      teacherId: 't5',
      teacher: {
        id: 't5',
        name: 'Malika Yusupova',
        phone: '+998901234571',
        email: 'malika@edunite.uz'
      },
      schedule: 'Dush-Chors-Juma, 17:00-19:00',
      roomId: 'r5',
      room: {
        id: 'r5',
        name: 'Xona-5',
        capacity: 12,
        type: 'classroom'
      },
      maxStudents: 10,
      currentStudents: 9,
      status: 'active',
      createdDate: '2024-01-25',
      lessons: [],
    },
    {
      id: '6',
      name: 'Ona-Tili-2',
      courseId: 'c6',
      course: {
        id: 'c6',
        name: 'Ona tili - O\'rta',
        description: 'O\'zbek tili o\'rta daraja'
      },
      teacherId: 't6',
      teacher: {
        id: 't6',
        name: 'Feruza Alimova',
        phone: '+998901234572',
        email: 'feruza@edunite.uz'
      },
      schedule: 'Sesh-Paysh, 16:00-17:30',
      roomId: 'r1',
      room: {
        id: 'r1',
        name: 'Xona-1',
        capacity: 20,
        type: 'classroom'
      },
      maxStudents: 18,
      currentStudents: 16,
      status: 'active',
      createdDate: '2024-01-16',
      lessons: [],
    },
    {
      id: '7',
      name: 'Ona-Tili-3',
      courseId: 'c7',
      course: {
        id: 'c7',
        name: 'Ona tili - Yuqori',
        description: 'O\'zbek tili yuqori daraja'
      },
      teacherId: 't7',
      teacher: {
        id: 't7',
        name: 'Sardor Valiyev',
        phone: '+998901234573',
        email: 'sardor@edunite.uz'
      },
      schedule: 'Dush-Chors-Juma, 17:00-18:30',
      roomId: 'r2',
      room: {
        id: 'r2',
        name: 'Xona-2',
        capacity: 20,
        type: 'classroom'
      },
      maxStudents: 16,
      currentStudents: 13,
      status: 'active',
      createdDate: '2024-01-19',
      lessons: [],
    },
    {
      id: '8',
      name: 'Rus-Tili-1',
      courseId: 'c8',
      course: {
        id: 'c8',
        name: 'Rus tili - Boshlang\'ich',
        description: 'Rus tili boshlang\'ich daraja'
      },
      teacherId: 't8',
      teacher: {
        id: 't8',
        name: 'Nigora Xasanova',
        phone: '+998901234574',
        email: 'nigora@edunite.uz'
      },
      schedule: 'Sesh-Paysh-Shanba, 15:00-16:30',
      roomId: 'r3',
      room: {
        id: 'r3',
        name: 'Xona-3',
        capacity: 18,
        type: 'classroom'
      },
      maxStudents: 16,
      currentStudents: 14,
      status: 'active',
      createdDate: '2024-01-21',
      lessons: [],
    },
    {
      id: '9',
      name: 'Rus-Tili-2',
      courseId: 'c9',
      course: {
        id: 'c9',
        name: 'Rus tili - O\'rta',
        description: 'Rus tili o\'rta daraja'
      },
      teacherId: 't9',
      teacher: {
        id: 't9',
        name: 'Azizbek Usmonov',
        phone: '+998901234575',
        email: 'azizbek@edunite.uz'
      },
      schedule: 'Dush-Chors-Juma, 18:00-19:30',
      roomId: 'r4',
      room: {
        id: 'r4',
        name: 'Xona-4',
        capacity: 15,
        type: 'classroom'
      },
      maxStudents: 14,
      currentStudents: 11,
      status: 'active',
      createdDate: '2024-01-23',
      lessons: [],
    },
    {
      id: '10',
      name: 'Matematika-5-9-1',
      courseId: 'c10',
      course: {
        id: 'c10',
        name: 'Matematika - 5-9 sinf',
        description: 'Matematika maktab dasturi'
      },
      teacherId: 't10',
      teacher: {
        id: 't10',
        name: 'Javohir Karimov',
        phone: '+998901234576',
        email: 'javohir@edunite.uz'
      },
      schedule: 'Sesh-Paysh, 16:00-17:30',
      roomId: 'r5',
      room: {
        id: 'r5',
        name: 'Xona-5',
        capacity: 12,
        type: 'classroom'
      },
      maxStudents: 12,
      currentStudents: 10,
      status: 'active',
      createdDate: '2024-01-17',
      lessons: [],
    },
    {
      id: '11',
      name: 'Matematika-10-11-1',
      courseId: 'c11',
      course: {
        id: 'c11',
        name: 'Matematika - 10-11 sinf',
        description: 'Matematika yuqori sinflar'
      },
      teacherId: 't11',
      teacher: {
        id: 't11',
        name: 'Kamola Rahimova',
        phone: '+998901234577',
        email: 'kamola@edunite.uz'
      },
      schedule: 'Dush-Chors-Juma, 17:00-19:00',
      roomId: 'r1',
      room: {
        id: 'r1',
        name: 'Xona-1',
        capacity: 20,
        type: 'classroom'
      },
      maxStudents: 18,
      currentStudents: 15,
      status: 'active',
      createdDate: '2024-01-24',
      lessons: [],
    },
    {
      id: '12',
      name: 'Fizika-1',
      courseId: 'c12',
      course: {
        id: 'c12',
        name: 'Fizika - O\'rta maktab',
        description: 'Fizika asoslari'
      },
      teacherId: 't12',
      teacher: {
        id: 't12',
        name: 'Shohruh Mirzayev',
        phone: '+998901234578',
        email: 'shohruh@edunite.uz'
      },
      schedule: 'Sesh-Paysh, 17:00-18:30',
      roomId: 'r2',
      room: {
        id: 'r2',
        name: 'Xona-2',
        capacity: 20,
        type: 'classroom'
      },
      maxStudents: 16,
      currentStudents: 13,
      status: 'active',
      createdDate: '2024-01-26',
      lessons: [],
    },
    {
      id: '13',
      name: 'Kimyo-1',
      courseId: 'c13',
      course: {
        id: 'c13',
        name: 'Kimyo - O\'rta maktab',
        description: 'Kimyo fanining asoslari'
      },
      teacherId: 't13',
      teacher: {
        id: 't13',
        name: 'Dilshoda Toshmatova',
        phone: '+998901234579',
        email: 'dilshoda@edunite.uz'
      },
      schedule: 'Dush-Chors, 16:00-17:30',
      roomId: 'r3',
      room: {
        id: 'r3',
        name: 'Xona-3',
        capacity: 18,
        type: 'classroom'
      },
      maxStudents: 15,
      currentStudents: 12,
      status: 'active',
      createdDate: '2024-01-27',
      lessons: [],
    },
    {
      id: '14',
      name: 'Biologiya-1',
      courseId: 'c14',
      course: {
        id: 'c14',
        name: 'Biologiya - O\'rta maktab',
        description: 'Biologiya fanining asoslari'
      },
      teacherId: 't14',
      teacher: {
        id: 't14',
        name: 'Madina Sobirova',
        phone: '+998901234580',
        email: 'madina@edunite.uz'
      },
      schedule: 'Paysh-Shanba, 15:00-16:30',
      roomId: 'r4',
      room: {
        id: 'r4',
        name: 'Xona-4',
        capacity: 15,
        type: 'classroom'
      },
      maxStudents: 14,
      currentStudents: 11,
      status: 'active',
      createdDate: '2024-01-28',
      lessons: [],
    },
    {
      id: '15',
      name: 'Tarix-1',
      courseId: 'c15',
      course: {
        id: 'c15',
        name: 'Tarix - O\'zbekiston tarixi',
        description: 'O\'zbekiston tarixi'
      },
      teacherId: 't15',
      teacher: {
        id: 't15',
        name: 'Rustam Abdurahmonov',
        phone: '+998901234581',
        email: 'rustam@edunite.uz'
      },
      schedule: 'Juma-Shanba, 14:00-15:30',
      roomId: 'r5',
      room: {
        id: 'r5',
        name: 'Xona-5',
        capacity: 12,
        type: 'classroom'
      },
      maxStudents: 12,
      currentStudents: 9,
      status: 'active',
      createdDate: '2024-01-29',
      lessons: [],
    },
    {
      id: '16',
      name: 'English-Kids-1',
      courseId: 'c16',
      course: {
        id: 'c16',
        name: 'English - Kids (5-8 yosh)',
        description: 'Ingliz tili bolalar uchun'
      },
      teacherId: 't16',
      teacher: {
        id: 't16',
        name: 'Zarina Qodirova',
        phone: '+998901234582',
        email: 'zarina@edunite.uz'
      },
      schedule: 'Shanba-Yakshanba, 10:00-11:00',
      roomId: 'r1',
      room: {
        id: 'r1',
        name: 'Xona-1',
        capacity: 20,
        type: 'classroom'
      },
      maxStudents: 15,
      currentStudents: 12,
      status: 'active',
      createdDate: '2024-01-30',
      lessons: [],
    },
    {
      id: '17',
      name: 'English-Teens-1',
      courseId: 'c17',
      course: {
        id: 'c17',
        name: 'English - Teens (13-17 yosh)',
        description: 'Ingliz tili o\'smirlar uchun'
      },
      teacherId: 't17',
      teacher: {
        id: 't17',
        name: 'Farhod Jalilov',
        phone: '+998901234583',
        email: 'farhod@edunite.uz'
      },
      schedule: 'Dush-Chors-Juma, 16:00-17:30',
      roomId: 'r2',
      room: {
        id: 'r2',
        name: 'Xona-2',
        capacity: 20,
        type: 'classroom'
      },
      maxStudents: 16,
      currentStudents: 14,
      status: 'active',
      createdDate: '2024-02-01',
      lessons: [],
    },
    {
      id: '18',
      name: 'Ona-Tili-Imtihon-1',
      courseId: 'c18',
      course: {
        id: 'c18',
        name: 'Ona tili - Imtihon tayyorlov',
        description: 'Ona tili imtihonlarga tayyorlov'
      },
      teacherId: 't18',
      teacher: {
        id: 't18',
        name: 'Yulduz Toshmatova',
        phone: '+998901234584',
        email: 'yulduz@edunite.uz'
      },
      schedule: 'Sesh-Paysh, 18:00-20:00',
      roomId: 'r3',
      room: {
        id: 'r3',
        name: 'Xona-3',
        capacity: 18,
        type: 'classroom'
      },
      maxStudents: 15,
      currentStudents: 13,
      status: 'active',
      createdDate: '2024-02-02',
      lessons: [],
    },
    {
      id: '19',
      name: 'English-Conversation-1',
      courseId: 'c19',
      course: {
        id: 'c19',
        name: 'English Conversation',
        description: 'Ingliz tili gapirish kursi'
      },
      teacherId: 't19',
      teacher: {
        id: 't19',
        name: 'Nodira Xamidova',
        phone: '+998901234585',
        email: 'nodira@edunite.uz'
      },
      schedule: 'Dush-Chors-Juma, 19:00-20:30',
      roomId: 'r4',
      room: {
        id: 'r4',
        name: 'Xona-4',
        capacity: 15,
        type: 'classroom'
      },
      maxStudents: 12,
      currentStudents: 10,
      status: 'active',
      createdDate: '2024-02-03',
      lessons: [],
    },
    {
      id: '20',
      name: 'Rus-Tili-Imtihon-1',
      courseId: 'c20',
      course: {
        id: 'c20',
        name: 'Rus tili - Imtihon tayyorlov',
        description: 'Rus tili imtihonlarga tayyorlov'
      },
      teacherId: 't20',
      teacher: {
        id: 't20',
        name: 'Sanjar Rahimov',
        phone: '+998901234586',
        email: 'sanjar@edunite.uz'
      },
      schedule: 'Sesh-Paysh, 17:00-19:00',
      roomId: 'r5',
      room: {
        id: 'r5',
        name: 'Xona-5',
        capacity: 12,
        type: 'classroom'
      },
      maxStudents: 10,
      currentStudents: 8,
      status: 'active',
      createdDate: '2024-02-04',
      lessons: [],
    },
  ],
  data: null,
  onOpen: (data?: Group | null) => set({ open: true, data: data || null }),
  onClose: () => set({ open: false, data: null }),
  addGroup: (group) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      ...group,
      lessons: [],
      currentStudents: 0,
    }
    set({ groups: [...get().groups, newGroup], open: false, data: null })
  },
  updateGroup: (group) => {
    set({
      groups: get().groups.map((g) => (g.id === group.id ? group : g)),
      open: false,
      data: null,
    })
  },
  deleteGroup: (id) => {
    set({ groups: get().groups.filter((g) => g.id !== id) })
  },
  addLesson: (groupId, lesson) => {
    const group = get().groups.find((g) => g.id === groupId)
    if (!group) return

    const newLesson: Lesson = {
      id: Date.now().toString(),
      ...lesson,
      groupId,
      groupName: lesson.groupName || group.name,
      courseName: lesson.courseName || group.course.name,
      roomName: lesson.roomName || group.room?.name || (lesson.roomId === 'online' ? 'Online' : ''),
      studentCount: lesson.studentCount ?? group.currentStudents,
    }
    set({
      groups: get().groups.map((g) =>
        g.id === groupId ? { ...g, lessons: [...g.lessons, newLesson] } : g
      ),
    })
  },
  updateLesson: (lessonId, lessonUpdate) => {
    set({
      groups: get().groups.map((g) => ({
        ...g,
        lessons: g.lessons.map((l) => {
          if (l.id === lessonId) {
            const updatedLesson = { ...l, ...lessonUpdate }
            // Update derived fields if groupId or roomId changed
            if (lessonUpdate.groupId && lessonUpdate.groupId !== l.groupId) {
              const group = get().groups.find((gr) => gr.id === lessonUpdate.groupId)
              if (group) {
                updatedLesson.groupName = group.name
                updatedLesson.courseName = group.course.name
                updatedLesson.studentCount = group.currentStudents
              }
            }
            if (lessonUpdate.roomId !== undefined) {
              const group = get().groups.find((gr) => gr.id === updatedLesson.groupId)
              if (group) {
                updatedLesson.roomName = lessonUpdate.roomId === 'online' 
                  ? 'Online' 
                  : group.room?.name || ''
              }
            }
            return updatedLesson
          }
          return l
        }),
      })),
    })
  },
  deleteLesson: (lessonId) => {
    set({
      groups: get().groups.map((g) => ({
        ...g,
        lessons: g.lessons.filter((l) => l.id !== lessonId),
      })),
    })
  },
  getLessonsByDateRange: (startDate, endDate) => {
    const allLessons: Lesson[] = []
    get().groups.forEach((group) => {
      allLessons.push(...group.lessons.filter((lesson) =>
        lesson.date >= startDate && lesson.date <= endDate
      ))
    })
    return allLessons
  },
  checkScheduleConflict: (newLesson) => {
    const allLessons = get().getLessonsByDateRange(newLesson.date, newLesson.date)
    return allLessons.some((lesson) =>
      lesson.id !== (newLesson as any).id && // Exclude current lesson if updating
      lesson.date === newLesson.date &&
      ((lesson.startTime <= newLesson.startTime && lesson.endTime > newLesson.startTime) ||
       (lesson.startTime < newLesson.endTime && lesson.endTime >= newLesson.endTime) ||
       (lesson.startTime >= newLesson.startTime && lesson.endTime <= newLesson.endTime))
    )
  },
}))