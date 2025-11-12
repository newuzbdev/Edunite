import { createBrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/dashboard/dashboard'
import Lidlar from '@/pages/lidlar'
import Oqituvchilar from '@/pages/oqituvchilar'
import Guruhlar from '@/pages/guruhlar'
import Talabalar from '@/pages/talabalar'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <div><Dashboard/></div>
	},
	{
		path: '/lidlar',
		element: <div><Lidlar/></div>
	},
	{
		path: '/oqituvchilar',
		element: <div><Oqituvchilar/></div>
	},
	{
		path: '/guruhlar',
		element: <div><Guruhlar/></div>
	},
	{
		path: '/talabalar',
		element: <div><Talabalar/></div>
	},
	{
		path: '*',
		element: <Navigate to='/' />
	}
])