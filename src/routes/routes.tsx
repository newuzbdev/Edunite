import { createBrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/dashboard/dashboard'
import Lidlar from '@/pages/lidlar/lids'
import LidProfile from '@/pages/lidlar/profile'
import Oqituvchilar from '@/pages/teachers.tsx'
import Guruhlar from '@/pages/group'
import GroupSchedule from '@/pages/group/ui/group-schedule'
import Schedule from '@/pages/schedule'
import Talabalar from '@/pages/talabalar'
import StudentProfile from '@/pages/talabalar/profile'
import Payments from '@/pages/payments'
import Debtors from '@/pages/payments/debtors'
import PaymentsStatistics from '@/pages/payments/statistics'
import Reports from '@/pages/reports'
import FinancialReports from '@/pages/reports/financial'
import StudentsReport from '@/pages/reports/students'
import TeachersReport from '@/pages/reports/teachers'
import AttendanceReport from '@/pages/reports/attendance'
import Exams from '@/pages/exams'
import CreateExam from '@/pages/exams/create'
import ExamResults from '@/pages/exams/results'
import StudentScores from '@/pages/exams/scores'
import { AppLayout } from '@/shared/layout/app-layout'

export const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: '/',
				element: <Dashboard />
			},
			{
				path: '/lids',
				element: <Lidlar />
			},
			{
				path: '/lids/:id',
				element: <LidProfile />
			},
			{
				path: '/teachers',
				element: <Oqituvchilar />
			},
			{
				path: '/groups',
				element: <Guruhlar />
			},
			{
				path: '/groups/:id/schedule',
				element: <GroupSchedule />
			},
			{
				path: '/schedule',
				element: <Schedule />
			},
			{
				path: '/talabalar',
				element: <Talabalar />
			},
			{
				path: '/talabalar/:id',
				element: <StudentProfile />
			},
			{
				path: '/payments',
				element: <Payments />
			},
			{
				path: '/payments/debtors',
				element: <Debtors />
			},
			{
				path: '/payments/statistics',
				element: <PaymentsStatistics />
			},
			{
				path: '/reports',
				element: <Reports />
			},
			{
				path: '/reports/financial',
				element: <FinancialReports />
			},
			{
				path: '/reports/financial/daily-monthly',
				element: <Navigate to="/reports/financial" replace />
			},
			{
				path: '/reports/financial/by-courses',
				element: <Navigate to="/reports/financial" replace />
			},
			{
				path: '/reports/financial/teachers',
				element: <Navigate to="/reports/financial" replace />
			},
			{
				path: '/reports/students',
				element: <StudentsReport />
			},
			{
				path: '/reports/teachers',
				element: <TeachersReport />
			},
			{
				path: '/reports/attendance',
				element: <AttendanceReport />
			},
			{
				path: '/exams',
				element: <Exams />
			},
			{
				path: '/exams/create',
				element: <CreateExam />
			},
			{
				path: '/exams/results',
				element: <ExamResults />
			},
			{
				path: '/exams/scores',
				element: <StudentScores />
			},
			{
				path: '*',
				element: <Navigate to='/' />
			}
		]
	}
])