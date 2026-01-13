"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth, db } from "../../firebase/config";
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import {
    UserCircleIcon,
    PaintBrushIcon,
    BellIcon,
    ShieldCheckIcon,
    CheckIcon,
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

function SettingsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabFromUrl = searchParams.get("tab");

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });

    // Form states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [notifications, setNotifications] = useState({
        emailResults: true,
        weeklyDigest: false,
        productUpdates: true
    });
    const [currentTheme, setCurrentTheme] = useState("system");

    // Modal states
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showDeleteHistoryModal, setShowDeleteHistoryModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Watch for URL tab parameter changes
    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    // Load current theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setCurrentTheme(savedTheme);
        } else {
            setCurrentTheme("system");
        }
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (u) => {
            setUser(u);
            if (u) {
                try {
                    const userDoc = await getDoc(doc(db, "users", u.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData(data);
                        setFirstName(data.firstName || "");
                        setLastName(data.lastName || "");
                        if (data.notifications) {
                            setNotifications(data.notifications);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const showMessage = (text, type = "success") => {
        setSaveMessage({ text, type });
        setTimeout(() => setSaveMessage({ text: "", type: "" }), 4000);
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // Use setDoc with merge to create doc if it doesn't exist
            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                displayName: `${firstName} ${lastName}`,
                email: user.email,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`
            });

            // Update local userData to reflect in UI immediately
            setUserData(prev => ({
                ...prev,
                firstName,
                lastName,
                displayName: `${firstName} ${lastName}`
            }));

            showMessage("Profile updated successfully!", "success");
        } catch (error) {
            console.error("Error updating profile:", error);
            showMessage("Failed to update profile: " + error.message, "error");
        }
        setSaving(false);
    };

    const handleSaveNotifications = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                notifications,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            showMessage("Notification preferences saved!", "success");
        } catch (error) {
            console.error("Error saving notifications:", error);
            showMessage("Failed to save preferences: " + error.message, "error");
        }
        setSaving(false);
    };

    const handleThemeChange = (themeId) => {
        setCurrentTheme(themeId);

        if (themeId === "light") {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else if (themeId === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            // System preference
            localStorage.removeItem("theme");
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
        showMessage(`Theme changed to ${themeId}`, "success");
    };

    const handleDeleteAllHistory = async () => {
        if (!user) return;
        setDeleting(true);
        try {
            const q = query(collection(db, "history"), where("userId", "==", user.uid));
            const snapshot = await getDocs(q);

            const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
            await Promise.all(deletePromises);

            showMessage(`Deleted ${snapshot.docs.length} history items`, "success");
            setShowDeleteHistoryModal(false);
        } catch (error) {
            console.error("Error deleting history:", error);
            showMessage("Failed to delete history: " + error.message, "error");
        }
        setDeleting(false);
    };

    const handleExportData = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // Fetch user data
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};

            // Fetch history
            const q = query(collection(db, "history"), where("userId", "==", user.uid));
            const historySnapshot = await getDocs(q);
            const historyData = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Create export object
            const exportData = {
                exportDate: new Date().toISOString(),
                user: {
                    email: user.email,
                    ...userData
                },
                history: historyData
            };

            // Download as JSON
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `hiresight-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showMessage("Data exported successfully!", "success");
        } catch (error) {
            console.error("Error exporting data:", error);
            showMessage("Failed to export data: " + error.message, "error");
        }
        setSaving(false);
    };

    const handleDeleteAccount = async () => {
        if (!user || !deletePassword) return;
        setDeleting(true);
        try {
            // Re-authenticate user first
            const credential = EmailAuthProvider.credential(user.email, deletePassword);
            await reauthenticateWithCredential(user, credential);

            // Delete all history
            const q = query(collection(db, "history"), where("userId", "==", user.uid));
            const snapshot = await getDocs(q);
            const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
            await Promise.all(deletePromises);

            // Delete user document
            await deleteDoc(doc(db, "users", user.uid));

            // Delete the Firebase auth user
            await deleteUser(user);

            router.push("/login");
        } catch (error) {
            console.error("Error deleting account:", error);
            if (error.code === "auth/wrong-password") {
                showMessage("Incorrect password", "error");
            } else {
                showMessage("Failed to delete account: " + error.message, "error");
            }
        }
        setDeleting(false);
        setDeletePassword("");
    };

    const tabs = [
        { id: "profile", name: "Profile", icon: UserCircleIcon },
        { id: "appearance", name: "Appearance", icon: PaintBrushIcon },
        { id: "notifications", name: "Notifications", icon: BellIcon },
        { id: "privacy", name: "Data & Privacy", icon: ShieldCheckIcon },
    ];

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#0d0d14] flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Loading settings...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-[#0a0a0f] dark:via-[#0d0d14] dark:to-[#0a0a0f] transition-colors duration-300">
            {/* Background pattern */}
            <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100,100,100,0.15) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Ambient glows */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className={`relative z-10 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} min-h-screen`}>
                <header className="flex justify-between items-center px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Settings
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
                    </div>
                    <ThemeToggle />
                </header>

                <div className="max-w-4xl mx-auto px-8 pb-12">
                    {/* Message Toast */}
                    {saveMessage.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${saveMessage.type === "success"
                                ? "bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30"
                                : "bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30"
                            }`}>
                            {saveMessage.type === "success" ? (
                                <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                            )}
                            <span className={`font-medium ${saveMessage.type === "success"
                                    ? "text-green-700 dark:text-green-400"
                                    : "text-red-700 dark:text-red-400"
                                }`}>{saveMessage.text}</span>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Tabs */}
                        <div className="md:w-56 flex-shrink-0">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                                            }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-200/30 dark:shadow-none p-8">
                                {/* Profile Tab */}
                                {activeTab === "profile" && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Profile Information</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal details</p>
                                        </div>

                                        {/* Avatar */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[3px]">
                                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-white">
                                                    {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : "U"}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">{firstName} {lastName}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                            </div>
                                        </div>

                                        {/* Form */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={user?.email || ""}
                                                disabled
                                                className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                        </div>

                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                )}

                                {/* Appearance Tab */}
                                {activeTab === "appearance" && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Appearance</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Customize how HireSight looks</p>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { id: "light", name: "Light", icon: SunIcon },
                                                    { id: "dark", name: "Dark", icon: MoonIcon },
                                                    { id: "system", name: "System", icon: ComputerDesktopIcon }
                                                ].map((theme) => (
                                                    <button
                                                        key={theme.id}
                                                        onClick={() => handleThemeChange(theme.id)}
                                                        className={`flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-white/5 border-2 rounded-2xl transition-all group ${currentTheme === theme.id
                                                                ? "border-blue-500 ring-2 ring-blue-500/20"
                                                                : "border-gray-200 dark:border-white/10 hover:border-blue-500"
                                                            }`}
                                                    >
                                                        <theme.icon className={`w-8 h-8 transition-colors ${currentTheme === theme.id
                                                                ? "text-blue-500"
                                                                : "text-gray-400 group-hover:text-blue-500"
                                                            }`} />
                                                        <span className={`text-sm font-medium ${currentTheme === theme.id
                                                                ? "text-blue-500"
                                                                : "text-gray-600 dark:text-gray-300"
                                                            }`}>{theme.name}</span>
                                                        {currentTheme === theme.id && (
                                                            <CheckIcon className="w-5 h-5 text-blue-500" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === "notifications" && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Notifications</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your notification preferences</p>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { key: "emailResults", title: "Email Results", desc: "Get notified when ranking is complete" },
                                                { key: "weeklyDigest", title: "Weekly Digest", desc: "Summary of your hiring activity" },
                                                { key: "productUpdates", title: "Product Updates", desc: "New features and improvements" }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-white">{item.title}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                                        className={`relative w-12 h-7 rounded-full transition-colors ${notifications[item.key] ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}
                                                    >
                                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${notifications[item.key] ? "left-6" : "left-1"}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={handleSaveNotifications}
                                            disabled={saving}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {saving ? "Saving..." : "Save Preferences"}
                                        </button>
                                    </div>
                                )}

                                {/* Privacy Tab */}
                                {activeTab === "privacy" && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Data & Privacy</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your data and privacy settings</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-gray-800 dark:text-white mb-2">Data Retention</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your ranking history is stored securely and can be deleted at any time.</p>
                                                    </div>
                                                    <TrashIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <button
                                                    onClick={() => setShowDeleteHistoryModal(true)}
                                                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                                                >
                                                    Delete All History
                                                </button>
                                            </div>

                                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-gray-800 dark:text-white mb-2">Export Data</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Download a copy of all your data as JSON.</p>
                                                    </div>
                                                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <button
                                                    onClick={handleExportData}
                                                    disabled={saving}
                                                    className="text-sm text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
                                                >
                                                    {saving ? "Exporting..." : "Download Data Export"}
                                                </button>
                                            </div>

                                            <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                                                <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">Delete Account</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                                <button
                                                    onClick={() => setShowDeleteAccountModal(true)}
                                                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete History Modal */}
            {showDeleteHistoryModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-full">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Delete All History</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete all your ranking history? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteHistoryModal(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAllHistory}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete All"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteAccountModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-full">
                                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Delete Account</h3>
                            </div>
                            <button onClick={() => setShowDeleteAccountModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This will permanently delete your account, all your data, and ranking history. Enter your password to confirm.
                        </p>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-white mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowDeleteAccountModal(false); setDeletePassword(""); }}
                                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting || !deletePassword}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SettingsPage() {
    return (
        <AuthGuard>
            <SettingsContent />
        </AuthGuard>
    );
}
