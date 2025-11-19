import { createBrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/dashboard/dashboard'
import Lidlar from '@/pages/lidlar/lids'
import LidProfile from '@/pages/lidlar/profile'
import Oqituvchilar from '@/pages/teachers.tsx'
import Guruhlar from '@/pages/group'
import Schedule from '@/pages/schedule'
import Talabalar from '@/pages/talabalar'
import StudentProfile from '@/pages/talabalar/profile'
import Payments from '@/pages/payments'
import Debtors from '@/pages/payments/debtors'
import PaymentsStatistics from '@/pages/payments/statistics'
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
				path: '*',
				element: <Navigate to='/' />
			}
		]
	}
])