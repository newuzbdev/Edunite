import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useCoursesStore } from "./utils/courses-store"

export default function YangiKurs() {
	// Redirect to courses list and open drawer
	const onOpen = useCoursesStore((state) => state.onOpen)
	
	useEffect(() => {
		// Open drawer for creating new course
		onOpen()
	}, [onOpen])
	
	return <Navigate to="/kurslar" replace />
}

