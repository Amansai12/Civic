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
    Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import AuthorityProfile from "@/components/AuthorityProfile";
import SubordinateIssues from "@/components/SubordinateIssues";
import SubordinateAnalyticsDashboard from "@/components/SubordinateAnalytics";

const SubordinateDashboardPage = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    
    const navigationItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "issues", label: "Issues", icon: AlertTriangle },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    
    

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <SubordinateAnalyticsDashboard />
                );
            case "issues":
                return (
                    <SubordinateIssues />
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
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside 
                className={`
                    fixed top-0 left-0 z-40 h-screen w-64 
                    bg-slate-800 text-white
                    transform transition-transform duration-200 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                <div className="flex flex-col h-full">
                    <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-900">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-6 w-6 text-blue-400" />
                            <h1 className="text-xl font-bold text-white">Municipal Portal</h1>
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
                                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                                        transition-colors duration-150
                                        ${activeTab === item.id 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
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
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white border-b shadow-sm sticky top-0 z-30">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                                {isSidebarOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                            <div className="ml-4 lg:hidden">
                                <h1 className="text-lg font-bold text-gray-900">Municipal Portal</h1>
                            </div>
                        </div>
                        
                        
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {navigationItems.find(item => item.id === activeTab)?.label}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {activeTab === "dashboard" ? "Overview of municipal operations and key metrics" : 
                                 activeTab === "issues" ? "Track and manage municipal service requests and issues" : 
                                 "Configure system settings and user permissions"}
                            </p>
                        </div>
                        {renderContent()}
                    </div>
                </main>
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

export default SubordinateDashboardPage;