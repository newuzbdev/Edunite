import { createBrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/dashboard/dashboard'
import Lidlar from '@/pages/lidlar'
import Oqituvchilar from '@/pages/oqituvchilar'
import Guruhlar from '@/pages/guruhlar'
import Talabalar from '@/pages/talabalar'
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
				path: '/lidlar',
				element: <Lidlar />
			},
			{
				path: '/oqituvchilar',
				element: <Oqituvchilar />
			},
			{
				path: '/guruhlar',
				element: <Guruhlar />
			},
			{
				path: '/talabalar',
				element: <Talabalar />
			},
			{
				path: '*',
				element: <Navigate to='/' />
			}
		]
	}
])