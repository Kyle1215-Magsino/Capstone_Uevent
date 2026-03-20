import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RegisterOfficerModal from './RegisterOfficerModal';

const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GridIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>;
const UsersIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CheckIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FaceIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const ListIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const ChartIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const StudentIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const PlusUserIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink to={to} onClick={onClick}
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
          <span className={isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}>
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}

function SectionLabel({ label }) {
  return <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 pt-5 pb-1.5">{label}</p>;
}

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-green-200">
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
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <SectionLabel label="Overview" />
        <NavItem to="/dashboard" icon={<GridIcon />} label="Dashboard" onClick={onNavigate} />

        <SectionLabel label="Management" />
        <NavItem to="/students" icon={<StudentIcon />} label="Students" onClick={onNavigate} />
        <NavItem to="/events" icon={<CalendarIcon />} label="Events" onClick={onNavigate} />
        {user?.role === 'admin' && <NavItem to="/users" icon={<UsersIcon />} label="Users" onClick={onNavigate} />}

        <SectionLabel label="Operations" />
        <NavItem to="/checkin" icon={<CheckIcon />} label="Check-In" onClick={onNavigate} />
        <NavItem to="/face-enrollment" icon={<FaceIcon />} label="Face Enrollment" onClick={onNavigate} />

        <SectionLabel label="Analytics" />
        <NavItem to="/attendance" icon={<ListIcon />} label="Attendance Logs" onClick={onNavigate} />
        <NavItem to="/reports" icon={<ChartIcon />} label="Reports" onClick={onNavigate} />

        {user?.role === 'admin' && (
          <>
            <SectionLabel label="Admin" />
            <button onClick={() => setRegisterOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150">
              <span className="text-gray-400"><PlusUserIcon /></span>
              Register Officer
            </button>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-green-200 flex-shrink-0">
        <p className="text-xs text-gray-400 truncate">{user?.name}</p>
        <p className="text-[10px] text-gray-300 capitalize">{user?.role}</p>
      </div>

      <RegisterOfficerModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </aside>
  );
}







