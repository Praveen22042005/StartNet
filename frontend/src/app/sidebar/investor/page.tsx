"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon,
  HomeIcon,
  RocketIcon,
  GearIcon,
  ExitIcon,
  IdCardIcon
} from "@radix-ui/react-icons";

export default function InvestorSidebar({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/signin');
  };

  if (!isMounted) {
    return null;
  }

  const linkClass = (path: string) => `
    flex items-center p-2 rounded-md transition-all duration-200
    ${pathname === path 
      ? 'bg-primary text-white font-medium shadow-sm' 
      : 'hover:bg-gray-100 text-gray-700'
    }
    ${isCollapsed ? 'justify-center' : 'justify-start'}
  `;

  const navItems = [
    { path: '/investor/home', icon: <HomeIcon className="w-5 h-5" />, text: 'Home' },
    { path: '/investor/startups', icon: <RocketIcon className="w-5 h-5" />, text: 'Startups' },
    { path: '/investor/profile', icon: <IdCardIcon className="w-5 h-5" />, text: 'Profile' },
    { path: '/investor/settings', icon: <GearIcon className="w-5 h-5" />, text: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col overflow-x-hidden ${
          isCollapsed ? 'w-16' : 'w-64'
        } bg-white border-r border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50`}
      >
        {/* Logo and Toggle Section */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between relative">
          <div className="flex items-center pl-3 sidebar-logo">
            <Link href="/investor/home" className="flex items-center">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="StartNet Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <span className={`text-xl font-bold whitespace-nowrap ml-2 text-black ${
                isCollapsed ? 'hidden' : 'block'
              }`}>
                StartNet
              </span>
            </Link>
          </div>
          
          {/* Desktop Collapse Toggle */}
          <div className="sidebar-toggle">
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors absolute right-1 mr-1"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className={linkClass(item.path)}>
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className={`transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-3'
                  }`}>
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center rounded-lg bg-red-500 p-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors ${
              isCollapsed ? 'px-2' : 'px-4'
            }`}
          >
            <ExitIcon className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-2'
            }`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 p-2 bg-white rounded-lg border border-gray-200 shadow-lg lg:hidden z-50"
      >
        {isMobileOpen ? (
          <ChevronLeftIcon className="w-5 h-5" />
        ) : (
          <ChevronRightIcon className="w-5 h-5" />
        )}
      </button>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      } w-full`}>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}