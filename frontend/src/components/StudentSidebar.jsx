import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GridIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>;
const ListIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;

export default function StudentSidebar({ onNavigate }) {
  const { user } = useAuth();

  const links = [
    { to: '/student-dashboard', label: 'Dashboard', icon: <GridIcon /> },
    { to: '/student-attendance', label: 'My Attendance', icon: <ListIcon /> },
    { to: '/student-events', label: 'Events', icon: <CalendarIcon /> },
  ];

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-green-200 animate-slideInDrawer">
      {/* Logo */}
      <div className="px-5 h-14 flex items-center border-b border-green-200 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-tight">U-EventTrack</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 pb-1.5">Menu</p>
        {links.map(link => (
          <NavLink key={link.to} to={link.to} onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-green-50 text-green-700 border-l-2 border-green-500 pl-[11px]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 border-l-2 border-transparent pl-[11px]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}>{link.icon}</span>
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-green-200 flex-shrink-0">
        <p className="text-xs text-gray-500 font-medium truncate">{user?.name}</p>
        <p className="text-[10px] text-gray-400">Student</p>
      </div>
    </aside>
  );
}







