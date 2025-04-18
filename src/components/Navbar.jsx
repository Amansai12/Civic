import React, { useState } from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, LogOut, User, FileText, Search, Info, Bell, HelpCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFetchUser } from "@/api/query";

// Custom NavLink component that handles active state
const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

    return (
        <Link to={to}>
            <div
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    isActive 
                    ? "border-blue-700 text-blue-900" 
                    : "border-transparent text-gray-700 hover:border-blue-300 hover:text-blue-800"
                }`}
            >
                {children}
            </div>
        </Link>
    );
};

// Custom mobile NavLink
const MobileNavLink = ({ to, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

    return (
        <Link to={to} className="block" onClick={onClick}>
            <div
                className={`px-4 py-3 text-base font-medium border-l-4 ${
                    isActive 
                    ? "border-blue-700 bg-blue-50 text-blue-900" 
                    : "border-transparent text-gray-700 hover:bg-gray-50 hover:border-blue-300"
                }`}
            >
                {children}
            </div>
        </Link>
    );
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Improved user fetch with proper error handling
    const { data: user, isLoading } = useFetchUser();

    // Function to close the mobile menu
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="bg-white">
            

            <nav className="sticky top-0 left-0 z-50 w-full border-b bg-white shadow-sm">
                <div className="mx-auto max-w-[1350px] px-4">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-700 rounded-full">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="text-white"
                                    >
                                        <path
                                            d="M12 2L2 7L12 12L22 7L12 2Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M2 17L12 22L22 17"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M2 12L12 17L22 12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-gray-900">Government Issue Tracker</span>
                                    <div className="text-xs text-gray-500">Department of Technical Services</div>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <NavigationMenu>
                                <NavigationMenuList className="flex">
                                    <NavigationMenuItem>
                                        <NavLink to="/">Issues Database</NavLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavLink to="/send-issue">Report an Issue</NavLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavLink to="/information">Information</NavLink>
                                    </NavigationMenuItem>
                                    {user && (
                                        <NavigationMenuItem>
                                            <NavLink to="/dashboard#notifications">My Dashboard</NavLink>
                                        </NavigationMenuItem>
                                    )}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Profile Section & Actions */}
                        <div className="flex items-center space-x-4">
                           
                            {/* User Menu */}
                            {!isLoading && user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="flex items-center space-x-2 p-2 border-gray-300"
                                        >
                                            <Avatar className="h-8 w-8 border border-gray-300">
                                                <AvatarImage
                                                    src={user.avatarUrl || "/api/placeholder/32/32"}
                                                    alt={user.name || "User"}
                                                />
                                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="hidden md:block text-left">
                                                <p className="text-sm font-medium">{user.name || "User"}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                                    {user.email || ""}
                                                </p>
                                            </div>
                                            <ChevronDown className="h-4 w-4 hidden md:block text-gray-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="border-gray-300">
                                        <DropdownMenuLabel className="text-gray-500 text-xs">Account Services</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className={location.pathname === "/profile" ? "bg-blue-50 text-blue-800" : ""}
                                        >
                                            <Link to="/profile#settings" className="flex items-center w-full">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>User Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={
                                                location.pathname === "/my-issues" ? "bg-blue-50 text-blue-800" : ""
                                            }
                                        >
                                            <Link to="/profile#myList" className="flex items-center w-full">
                                                <FileText className="mr-2 h-4 w-4" />
                                                <span>My Submitted Issues</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={
                                                location.pathname === "/notifications" ? "bg-blue-50 text-blue-800" : ""
                                            }
                                        >
                                            <Link to="/notifications" className="flex items-center w-full">
                                                <Bell className="mr-2 h-4 w-4" />
                                                <span>Notifications</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-700 focus:text-red-800 focus:bg-red-50">
                                            <Link to="/logout" className="flex items-center w-full">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link to="/signin">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hidden md:inline-flex border-blue-700 text-blue-800 hover:bg-blue-50"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="hidden md:inline-flex bg-blue-700 hover:bg-blue-800"
                                        >
                                            Create Account
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden text-gray-800"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-2 space-y-1 border-t border-gray-200">
                            <div className="py-2 px-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input 
                                        type="search" 
                                        placeholder="Search issues..." 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <MobileNavLink to="/issues" onClick={closeMenu}>
                                Issues Database
                            </MobileNavLink>
                            <MobileNavLink to="/send-issue" onClick={closeMenu}>
                                Report an Issue
                            </MobileNavLink>
                            <MobileNavLink to="/information" onClick={closeMenu}>
                                Information
                            </MobileNavLink>
                            {!isLoading && user ? (
                                <>
                                    <MobileNavLink to="/dashboard" onClick={closeMenu}>
                                        My Dashboard
                                    </MobileNavLink>
                                    <MobileNavLink to="/profile" onClick={closeMenu}>
                                        User Profile
                                    </MobileNavLink>
                                    <Link to="/logout" className="block" onClick={closeMenu}>
                                        <div className="px-4 py-3 mt-2 text-base font-medium text-red-700 hover:bg-red-50 border-l-4 border-red-700 flex items-center">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <MobileNavLink to="/signin" onClick={closeMenu}>
                                        Sign In
                                    </MobileNavLink>
                                    <div className="px-4 py-3">
                                        <Link to="/signup" className="block" onClick={closeMenu}>
                                            <Button variant="default" className="w-full justify-center bg-blue-700 hover:bg-blue-800">
                                                Create Account
                                            </Button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            
        </div>
    );
};

export default Navbar;