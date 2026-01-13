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
    ArrowRightOnRectangleIcon,
    SparklesIcon,
    UserCircleIcon,
    PaintBrushIcon,
    BellIcon,
    LockClosedIcon,
    ChartBarIcon,
    UserGroupIcon,
    KeyIcon,
    RocketLaunchIcon,
    BookOpenIcon,
    CommandLineIcon,
    ChatBubbleLeftRightIcon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [expandedDropdown, setExpandedDropdown] = useState(null);

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

    const mainNavItems = [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon, description: "Resume ranking" },
        { name: "History", href: "/history", icon: ClockIcon, description: "Past sessions" },
        { name: "Analytics", href: "/analytics", icon: ChartBarIcon, description: "Trends & insights" },
    ];

    const dropdownNavItems = [
        {
            name: "Settings",
            href: "/settings",
            icon: Cog6ToothIcon,
            description: "Preferences",
            subItems: [
                { name: "Profile", icon: UserCircleIcon, section: "profile" },
                { name: "Appearance", icon: PaintBrushIcon, section: "appearance" },
                { name: "Notifications", icon: BellIcon, section: "notifications" },
                { name: "Data & Privacy", icon: LockClosedIcon, section: "privacy" },
            ]
        },
        {
            name: "Admin",
            href: "/admin",
            icon: ShieldCheckIcon,
            description: "Usage & team",
            subItems: [
                { name: "Overview", icon: ChartBarIcon, section: "overview" },
                { name: "Team", icon: UserGroupIcon, section: "team" },
                { name: "API Access", icon: KeyIcon, section: "api" },
            ]
        },
        {
            name: "Help & Docs",
            href: "/help",
            icon: QuestionMarkCircleIcon,
            description: "Get help",
            subItems: [
                { name: "Getting Started", icon: RocketLaunchIcon, section: "getting-started" },
                { name: "FAQ", icon: BookOpenIcon, section: "faq" },
                { name: "Shortcuts", icon: CommandLineIcon, section: "shortcuts" },
                { name: "Contact", icon: ChatBubbleLeftRightIcon, section: "contact" },
            ]
        },
    ];

    const NavItem = ({ item, index }) => {
        const isActive = pathname === item.href;

        return (
            <Link
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${isActive
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    } ${!isOpen ? "justify-center" : ""}`}
            >
                {isActive && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl transition-all duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-xl opacity-50 transition-opacity" />
                    </>
                )}

                <div className={`absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-xl transition-all duration-300 ${!isActive && hoveredItem === item.name ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`} />

                <div className={`relative transition-transform duration-300 ${hoveredItem === item.name && !isActive ? "scale-110" : ""}`}>
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${isActive ? "text-white" : ""}`} />
                </div>

                {isOpen && (
                    <span className={`relative font-medium whitespace-nowrap transition-transform duration-300 ${hoveredItem === item.name ? "translate-x-0.5" : ""
                        }`}>
                        {item.name}
                    </span>
                )}

                {!isOpen && hoveredItem === item.name && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl animate-fadeIn">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-slate-800 rotate-45" />
                    </div>
                )}
            </Link>
        );
    };

    const DropdownNavItem = ({ item, index }) => {
        const isActive = pathname === item.href;
        const isExpanded = expandedDropdown === item.name;
        const isHovered = hoveredItem === item.name;

        return (
            <div
                className="relative"
                onMouseEnter={() => {
                    setHoveredItem(item.name);
                    if (isOpen) setExpandedDropdown(item.name);
                }}
                onMouseLeave={() => {
                    setHoveredItem(null);
                    setExpandedDropdown(null);
                }}
            >
                {/* Main Nav Item */}
                <Link
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${isActive
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        } ${!isOpen ? "justify-center" : ""}`}
                >
                    {isActive && (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-xl opacity-50" />
                        </>
                    )}

                    <div className={`absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-xl transition-all duration-300 ${!isActive && isHovered ? "opacity-100" : "opacity-0"
                        }`} />

                    <div className={`relative transition-transform duration-300 ${isHovered && !isActive ? "scale-110" : ""}`}>
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                    </div>

                    {isOpen && (
                        <>
                            <span className={`relative flex-1 font-medium whitespace-nowrap transition-transform duration-300 ${isHovered ? "translate-x-0.5" : ""
                                }`}>
                                {item.name}
                            </span>
                            <ChevronDownIcon className={`relative w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                                } ${isActive ? "text-white" : "text-gray-400"}`} />
                        </>
                    )}
                </Link>

                {/* Dropdown Menu - Only when sidebar is open */}
                {isOpen && (
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                        }`}>
                        <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-white/10 mt-1 space-y-1">
                            {item.subItems.map((subItem, subIndex) => (
                                <Link
                                    key={subItem.name}
                                    href={`${item.href}?tab=${subItem.section}`}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200 group"
                                    style={{
                                        transitionDelay: isExpanded ? `${subIndex * 50}ms` : "0ms",
                                        transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
                                        opacity: isExpanded ? 1 : 0
                                    }}
                                >
                                    <subItem.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                                    <span className="text-sm font-medium">{subItem.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tooltip for collapsed sidebar */}
                {!isOpen && isHovered && (
                    <div className="absolute left-full ml-3 top-0 z-50 animate-fadeIn">
                        <div className="bg-gray-900 dark:bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden min-w-[180px]">
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                                <div className="font-semibold text-white flex items-center gap-2">
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </div>
                                <div className="text-xs text-gray-400">{item.description}</div>
                            </div>
                            {/* Sub Items */}
                            <div className="py-2">
                                {item.subItems.map((subItem, subIndex) => (
                                    <Link
                                        key={subItem.name}
                                        href={`${item.href}?tab=${subItem.section}`}
                                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        <subItem.icon className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{subItem.name}</span>
                                    </Link>
                                ))}
                            </div>
                            {/* Arrow */}
                            <div className="absolute left-0 top-4 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-slate-800 rotate-45" />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-500 ease-out ${isOpen ? "w-64" : "w-20"}`}
        >
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/10 transition-colors duration-300" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 pointer-events-none" />

            {/* Decorative orbs */}
            <div className="absolute top-20 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-40 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header / Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-white/10">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 overflow-hidden group ${!isOpen && "justify-center w-full"}`}
                    >
                        <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                                <SparklesIcon className="w-5 h-5" />
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity -z-10" />
                        </div>
                        {isOpen && (
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent whitespace-nowrap group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                                HireSight
                            </span>
                        )}
                    </Link>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
                    {/* Main Section */}
                    {isOpen && (
                        <div className="px-3 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                Main
                            </span>
                        </div>
                    )}
                    {mainNavItems.map((item, index) => (
                        <NavItem key={item.name} item={item} index={index} />
                    ))}

                    {/* Divider */}
                    <div className="my-4 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

                    {/* Account Section with Dropdowns */}
                    {isOpen && (
                        <div className="px-3 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                Account
                            </span>
                        </div>
                    )}
                    {dropdownNavItems.map((item, index) => (
                        <DropdownNavItem key={item.name} item={item} index={index} />
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-gray-200/50 dark:border-white/10 space-y-4">
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-center p-2.5 rounded-xl bg-gray-100/80 dark:bg-white/5 hover:bg-gray-200/80 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className={`transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}>
                            <ChevronLeftIcon className="w-5 h-5" />
                        </div>
                    </button>

                    {/* User Profile */}
                    <div className={`transition-all duration-300 ${!isOpen ? "justify-center" : "bg-gradient-to-r from-gray-100/80 to-gray-50/50 dark:from-white/5 dark:to-white/[0.02] p-3 rounded-2xl border border-gray-200/50 dark:border-white/10"}`}>
                        <div className={`flex items-center gap-3 ${!isOpen && "justify-center"}`}>
                            <div className="relative flex-shrink-0 group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[2px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-white">
                                        {userData?.firstName && userData?.lastName
                                            ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase()
                                            : user?.displayName?.split(" ").map(n => n[0]).join("").toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
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
                                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-white dark:hover:bg-slate-800 hover:scale-110 active:scale-95"
                                    title="Logout"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
