import { createBrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/dashboard/dashboard'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <div><Dashboard/></div>
	},
	{
		path: '*',
		element: <Navigate to='/' />
	}
])