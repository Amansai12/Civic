import React, { useState } from "react";
import { 
    LayoutDashboard, 
    AlertTriangle, 
    Settings, 
    Menu, 
    X,
    Bell,
    User,
    Phone,
    Image as ImageIcon,
    ChevronRight,
    Shield
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import SubordinateIssues from "@/components/SubordinateIssues";
import { useFetchUser } from "@/api/query";
import NotificationsSection from "@/components/NotificationsSection";
import SettingsSection from "@/components/CitizenProfile";
import { useNavigate } from "react-router-dom";
import MyList from "@/components/MyList";
import Navbar from "@/components/Navbar";

const CitizenDashboard = () => {
    const [activeTab, setActiveTab] = useState("notifications");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const navigate = useNavigate();
    const {data: user, isLoading, isError, removeFromCache} = useFetchUser();

    const navigationItems = [
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "myList", label: "My Issues", icon: AlertTriangle },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const EditProfileDialog = () => (
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
            <DialogContent className="sm:max-w-[425px] border-0 shadow-lg">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="text-gray-800 text-lg">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <Input 
                                id="name" 
                                defaultValue={user?.name} 
                                className="border-gray-300 focus:ring-blue-800 focus:border-blue-800"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <Input 
                                id="phone" 
                                defaultValue={user?.phone} 
                                className="border-gray-300 focus:ring-blue-800 focus:border-blue-800"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="avatar" className="text-gray-700">Profile Image</Label>
                        <div className="flex items-center space-x-2">
                            <ImageIcon className="w-4 h-4 text-gray-500" />
                            <Input 
                                id="avatar" 
                                type="file" 
                                accept="image/*" 
                                className="border-gray-300 focus:ring-blue-800 focus:border-blue-800"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsEditProfileOpen(false)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => {
                                // Handle profile update logic here
                                setIsEditProfileOpen(false);
                            }}
                            className="bg-blue-800 hover:bg-blue-900 text-white"
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "notifications":
                return <NotificationsSection notifications={user.Notifications} removeFromCache={removeFromCache} />;
            case "myList":
                return <MyList data={user.myList} />
            case "settings":
                return <SettingsSection user={user} />;
            default:
                return <div>Select a tab</div>;
        }
    };

    if(isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-800 rounded-full mb-3"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
    
    if(isError) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-8 bg-white shadow-md rounded-md">
                <AlertTriangle className="h-12 w-12 text-red-700 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Data</h2>
                <p className="text-gray-600 mb-4">We couldn't retrieve your information at this time.</p>
                <Button className="bg-blue-800 hover:bg-blue-900">Retry</Button>
            </div>
        </div>
    );

    return (
        <>
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside 
                className={`
                    fixed top-0 left-0 z-40 h-screen w-64 
                    bg-white border-r border-gray-200 shadow-sm
                    transform transition-transform duration-200 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                <div className="flex flex-col h-full">
                    <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-blue-800">
                        <div className="flex items-center">
                            <Shield className="h-6 w-6 text-white mr-2" />
                            <h1 className="text-lg font-semibold text-white">Citizen Portal</h1>
                        </div>
                    </div>
                    
                    {/* User Profile Summary */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 border-2 border-gray-200">
                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                    {user?.name?.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                                {user?.avatar && <AvatarImage src={user.avatar} />}
                            </Avatar>
                            <div>
                                <p className="font-medium text-gray-800">{user?.name}</p>
                                <p className="text-xs text-gray-500">Citizen ID: {user?.id || '12345'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <nav className="flex-1 overflow-y-auto p-4">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium
                                        transition-colors duration-150
                                        ${activeTab === item.id 
                                            ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-800' 
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                        my-1
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5" />
                                        {item.label}
                                    </div>
                                    {activeTab === item.id && <ChevronRight className="h-4 w-4" />}
                                </button>
                            );
                        })}
                    </nav>
                    
                    <div className="mt-auto p-4 border-t border-gray-200">
                        <Button onClick={() => navigate(-1)} className="w-full bg-blue-700 text-white mb-2">
                            Go Back
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
                            onClick={() => setIsEditProfileOpen(true)}
                        >
                            <User className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden bg-blue-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        <h1 className="text-lg font-semibold">Citizen Portal</h1>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-md hover:bg-blue-700"
                    >
                        {isSidebarOpen ? (
                            <X className="h-6 w-6 text-white" />
                        ) : (
                            <Menu className="h-6 w-6 text-white" />
                        )}
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <div className="mb-6 bg-white border-l-4 border-blue-800 p-4 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {navigationItems.find(item => item.id === activeTab)?.label}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {activeTab === "notifications" && "View your system notifications and updates"}
                                {activeTab === "myList" && "Manage and track your submitted issues"}
                                {activeTab === "settings" && "Manage your account settings and preferences"}
                            </p>
                        </div>
                        
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            {renderContent()}
                        </div>
                    </div>
                </main>
                
                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-sm">
                    <p>© 2025 Municipal Citizen Services Portal</p>
                </footer>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Edit Profile Dialog */}
            <EditProfileDialog />
        </div>
        </>
    );
};

export default CitizenDashboard;