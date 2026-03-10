import { Link } from 'react-router-dom'
import MenuItem from '../components/MenuItem.tsx'
import logo from '../assets/logo-default.png'
import { Icons } from '../assets/icons.ts'

const navLinksTop = [
    {
        title: 'Dashboard',
        link: '/dashboard',
        href: Icons.dashboard,
        hrefActive: Icons.dashboardActive,
    },
    {
        title: 'Campaigns',
        link: '/campaigns',
        href: Icons.campaigns,
        hrefActive: Icons.campaignsActive,
    },
    {
        title: 'User Management',
        link: '/users',
        href: Icons.users,
        hrefActive: Icons.usersActive,
    },
    {
        title: 'My Courses',
        link: '/courses',
        href: Icons.courses,
        hrefActive: Icons.coursesActive,
    },
    {
        title: 'Analytics & Reports',
        link: '/analytics',
        href: Icons.analytics,
        hrefActive: Icons.analyticsActive,
    },
    {
        title: 'Achievements',
        link: '/achievements',
        href: Icons.achievements,
        hrefActive: Icons.achievementsActive,
    },
    {
        title: 'Settings',
        link: '/settings',
        href: Icons.settings,
        hrefActive: Icons.settingsActive,
    },
]

const navLinksBottom = [
    {
        title: 'Notifications',
        link: '/notifications',
        href: Icons.notifications,
        hrefActive: Icons.notificationsActive,
    },
    {
        title: 'Account',
        link: '/account',
        href: Icons.account,
        hrefActive: Icons.accountActive,
    },
]

function Sidebar() {
    return (
        <div className="flex flex-col justify-between w-[320px] text-[#4A4A4A] h-full">
            <div>
                {/* logo */}
                <Link
                    to="/dashboard"
                    className="flex flex-row items-center gap-2 pl-4 py-4"
                >
                    <img src={logo} alt="Logo" className="w-20 h-20" />
                    App Name
                </Link>

                {/* nav links */}
                <MenuItem items={navLinksTop} />
            </div>

            <div>
                <MenuItem items={navLinksBottom} />
            </div>
        </div>
    )
}

export default Sidebar
