import { useAuth } from '../context/AuthContext'
import AdminCourseViewer from '../components/Courses/Admin/AdminCourseViewer'
import PublicCourseViewer from '../components/Courses/Public/PublicCourseViewer'

function CourseDetail() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <div className="p-8">Loading...</div>
    }

    const role = user?.role?.toLowerCase() || 'public'

    if (role === 'admin' || role === 'hr') {
        return <AdminCourseViewer role={role} />
    }

    return <PublicCourseViewer role={role} />
}

export default CourseDetail
