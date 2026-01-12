"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth, db } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (u) => {
            setUser(u);
            if (u) {
                try {
                    const userDoc = await getDoc(doc(db, "users", u.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUserData(null);
            }
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
        { name: "Settings", href: "#", icon: Cog6ToothIcon },
        { name: "Admin", href: "#", icon: ShieldCheckIcon },
        { name: "Help & Docs", href: "#", icon: QuestionMarkCircleIcon },
    ];

    return (
        <aside
            className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}
        >
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/10" />

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header / Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-white/10">
                    <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && "justify-center w-full"}`}>
                        {/* Gradient Logo */}
                        <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25">
                                H
                            </div>
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 blur-lg opacity-40 -z-10" />
                        </div>
                        {isOpen && (
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent whitespace-nowrap">
                                HireSight
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group overflow-hidden ${isActive
                                        ? "text-white"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    } ${!isOpen ? "justify-center" : ""}`}
                                title={!isOpen ? item.name : ""}
                            >
                                {/* Active background */}
                                {isActive && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-xl opacity-50" />
                                    </>
                                )}

                                {/* Hover background */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}

                                <item.icon className={`relative w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                                {isOpen && <span className="relative font-medium whitespace-nowrap">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-gray-200/50 dark:border-white/10 space-y-4">
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-center p-2.5 rounded-xl bg-gray-100/80 dark:bg-white/5 hover:bg-gray-200/80 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-all duration-200"
                    >
                        {isOpen ? <ChevronLeftIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                    </button>

                    {/* User Profile */}
                    <div className={`flex items-center gap-3 ${!isOpen ? "justify-center" : "bg-gradient-to-r from-gray-100/80 to-gray-50/50 dark:from-white/5 dark:to-white/[0.02] p-3 rounded-2xl border border-gray-200/50 dark:border-white/10"}`}>
                        {/* Avatar with gradient ring */}
                        <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-white">
                                    {userData?.firstName && userData?.lastName
                                        ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase()
                                        : user?.displayName?.split(" ").map(n => n[0]).join("").toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                                </div>
                            </div>
                            {/* Online indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                        </div>

                        {isOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                                    {userData?.firstName && userData?.lastName
                                        ? `${userData.firstName} ${userData.lastName}`
                                        : user?.displayName || "User"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        )}

                        {isOpen && (
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-white dark:hover:bg-slate-800"
                                title="Logout"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
