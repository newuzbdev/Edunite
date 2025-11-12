import { router } from '@/routes/routes'
import { RouterProvider as RouterProvider } from 'react-router-dom'

export const RouterProviders = () => {
	return <RouterProvider router={router} />
}