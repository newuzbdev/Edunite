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
      name: 'GE-1',
      courseId: 'c1',
      course: {
        id: 'c1',
        name: 'General English',
        description: 'Umumiy ingliz tili kursi'
      },
      teacherId: 't1',
      teacher: {
        id: 't1',
        name: 'Akmal O\'qituvchi',
        phone: '+998901234567',
        email: 'akmal@example.com'
      },
      schedule: 'Dush-Chors-Juma, 18:00-19:30',
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
      createdDate: '2024-01-15',
      lessons: [
        {
          id: 'l1',
          groupId: '1',
          date: '2024-11-18',
          startTime: '18:00',
          endTime: '19:30',
          teacherId: 't1',
          roomId: 'r1',
          type: 'offline',
        },
        {
          id: 'l2',
          groupId: '1',
          date: '2024-11-20',
          startTime: '18:00',
          endTime: '19:30',
          teacherId: 't1',
          roomId: 'r1',
          type: 'offline',
        },
        {
          id: 'l3',
          groupId: '1',
          date: '2024-11-22',
          startTime: '18:00',
          endTime: '19:30',
          teacherId: 't1',
          roomId: 'r1',
          type: 'offline',
        },
        {
          id: 'l4',
          groupId: '1',
          date: '2024-11-25',
          startTime: '18:00',
          endTime: '19:30',
          teacherId: 't1',
          roomId: 'r1',
          type: 'offline',
        },
      ],
      zoomLink: 'https://zoom.us/j/example'
    },
    {
      id: '2',
      name: 'IELTS-E',
      courseId: 'c2',
      course: {
        id: 'c2',
        name: 'IELTS Exam Preparation',
        description: 'IELTS imtihoniga tayyorgarlik'
      },
      teacherId: 't2',
      teacher: {
        id: 't2',
        name: 'Gulnora O\'qituvchi',
        phone: '+998939876543',
        email: 'gulnora@example.com'
      },
      schedule: 'Sesh-Paysh, 10:00-11:30',
      roomId: 'r2',
      room: {
        id: 'r2',
        name: 'Xona-2',
        capacity: 12,
        type: 'classroom'
      },
      maxStudents: 10,
      currentStudents: 8,
      status: 'active',
      createdDate: '2024-01-20',
      lessons: [
        {
          id: 'l5',
          groupId: '2',
          date: '2024-11-19',
          startTime: '10:00',
          endTime: '11:30',
          teacherId: 't2',
          roomId: 'r2',
          type: 'offline',
        },
        {
          id: 'l6',
          groupId: '2',
          date: '2024-11-21',
          startTime: '10:00',
          endTime: '11:30',
          teacherId: 't2',
          roomId: 'r2',
          type: 'offline',
        },
        {
          id: 'l7',
          groupId: '2',
          date: '2024-11-26',
          startTime: '10:00',
          endTime: '11:30',
          teacherId: 't2',
          roomId: 'r2',
          type: 'offline',
        },
        {
          id: 'l8',
          groupId: '2',
          date: '2024-11-28',
          startTime: '10:00',
          endTime: '11:30',
          teacherId: 't2',
          roomId: 'r2',
          type: 'offline',
        },
      ],
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
    const newLesson: Lesson = {
      id: Date.now().toString(),
      ...lesson,
      groupId,
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
        lessons: g.lessons.map((l) =>
          l.id === lessonId ? { ...l, ...lessonUpdate } : l
        ),
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