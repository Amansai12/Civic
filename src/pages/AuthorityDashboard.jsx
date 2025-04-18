import React, { useState } from "react";
import { 
    LayoutDashboard, 
    Users, 
    AlertTriangle, 
    CheckCircle, 
    BarChart2, 
    Forward, 
    Settings, 
    Menu, 
    X,
    Wrench, 
    Zap,
    MapPin, 
    Trash2,
    Droplet, 
    Leaf, 
    HardHat,
    UserCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Forwarded from "@/components/Forwarded";
import Conflicts from "@/components/Conflicts";
import RepresentativeIssues from "@/components/RepresentativeIssues";
import AuthorityProfile from "@/components/AuthorityProfile";
import Navbar from "@/components/Navbar";
import ConflictIssues from "@/components/ConflictIssues";
import IssueAnalyticsDashboard from "@/components/IssuesAnalyticsDashboard";
import '../App.css'
import Authorities from "@/components/Authorities";

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const navigationItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "issues", label: "Issues", icon: AlertTriangle },
        { id: "forwarded", label: "Forwarded", icon: Forward },
        { id: "conflicts", label: "Conflicts", icon: CheckCircle },
        { id: "Authorities", label: "Authorities", icon: UserCircle },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <IssueAnalyticsDashboard />
                );
            case "issues":
                return (
                    <RepresentativeIssues />
                );
            case "forwarded":
                return (
                    <Forwarded />
                );
            case "conflicts":
                return (
                    <ConflictIssues />
                );
            case "Authorities":
                return (
                    <Authorities/>
                );
            case "settings":
                return (
                    <AuthorityProfile />
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="max-h-screen bg-gray-50 overflow-y-scroll scrollbar-hidden">
            {/* Sidebar */}
            <aside 
                className={`
                    fixed top-0 left-0 z-40 h-screen w-[250px] 
                    bg-slate-800 border-r border-gray-200 shadow-sm
                    transform transition-transform duration-200 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                <div className="flex flex-col h-full ">
                    <div className="h-16 flex items-center px-6 border-b border-gray-600 bg-slate-900 text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-800 w-8 h-8 rounded flex items-center justify-center">
                                <HardHat className="h-4 w-4 text-white" />
                            </div>
                            <h1 className="text-lg font-semibold">Municipal Portal</h1>
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
                                        w-full flex items-center gap-3 mb-2 px-4 py-3 rounded-lg text-sm font-medium
                                        transition-colors duration-150
                                        ${activeTab === item.id 
                                            ? 'bg-blue-700 text-white border-l-4 border-blue-900' 
                                            : 'text-gray-400 hover:bg-blue-100 hover:text-gray-900'
                                        }
                                        my-1
                                    `}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                    
                    <Separator className="my-2" />
                    
                    <div className="p-4 text-xs text-white">
                        <p>Municipal Government Portal</p>
                        <p>v1.0.0</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
                            >
                                {isSidebarOpen ? (
                                    <X className="h-6 w-6 text-gray-600" />
                                ) : (
                                    <Menu className="h-6 w-6 text-gray-600" />
                                )}
                            </button>
                            <h1 className="text-xl font-bold text-gray-800 ml-2 lg:hidden">Municipal Dashboard</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto p-4 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {navigationItems.find(item => item.id === activeTab)?.label}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                {activeTab === "dashboard" && "Overview of municipal issues and statistics"}
                                {activeTab === "issues" && "Manage public issues and requests"}
                                {activeTab === "forwarded" && "Track forwarded requests"}
                                {activeTab === "conflicts" && "Handle conflicting issues"}
                                {activeTab === "Authorities" && "Manage municipal authorities"}
                                {activeTab === "settings" && "Manage your profile and settings"}
                            </p>
                        </div>
                        
                        {renderContent()}
                    </div>
                </main>
                
                <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-600">
                    © 2025 Municipal Government. All rights reserved.
                </footer>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardPage;