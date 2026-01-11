"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import {
    HomeIcon,
    ClockIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
        { name: "History", href: "/history", icon: ClockIcon },
        { name: "Settings", href: "#", icon: Cog6ToothIcon }, // Dummy
        { name: "Admin", href: "#", icon: ShieldCheckIcon },   // Dummy
        { name: "Help & Docs", href: "#", icon: QuestionMarkCircleIcon }, // Dummy
    ];

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50 flex flex-col ${isOpen ? "w-64" : "w-20"
                }`}
        >
            {/* Header / Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
                <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && "justify-center w-full"}`}>
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        HS
                    </div>
                    {isOpen && (
                        <span className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
                            HireSight
                        </span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200"
                                } ${!isOpen ? "justify-center" : ""}`}
                            title={!isOpen ? item.name : ""}
                        >
                            <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-300" : "group-hover:text-gray-900 dark:group-hover:text-gray-200"}`} />
                            {isOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions / User Info */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                {/* Toggle Button (Desktop friendly if simpler) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
                >
                    {isOpen ? <ChevronLeftIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>

                {/* User Profile */}
                <div className={`flex items-center gap-3 ${!isOpen ? "justify-center" : "bg-gray-50 dark:bg-slate-800 p-3 rounded-xl"}`}>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs flex-shrink-0">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>

                    {isOpen && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">
                                {user?.displayName || "User"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    )}

                    {isOpen && (
                        <button
                            onClick={handleLogout}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-white dark:hover:bg-slate-700 shadow-sm"
                            title="Logout"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
