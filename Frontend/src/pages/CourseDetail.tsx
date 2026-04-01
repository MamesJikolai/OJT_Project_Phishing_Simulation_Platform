import { useAuth } from '../context/AuthContext'
import AdminCourseViewer from '../components/Courses/AdminCourseViewer'
import PublicCourseViewer from '../components/Courses/PublicCourseViewer'

function CourseDetail() {
    const { user } = useAuth()
    const role = user?.role?.toLowerCase() || 'public'

    if (role === 'admin' || role === 'hr') {
        return <AdminCourseViewer role={role} />
    }

    return <PublicCourseViewer role={role} />
}

export default CourseDetail
