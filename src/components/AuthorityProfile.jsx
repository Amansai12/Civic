import React, { useState } from "react";
import {
    Mail,
    Phone,
    Building2,
    Users,
    PenSquare,
    LogOut,
    X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/store/user";
import { useFetchUser } from "@/api/query";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function AuthorityProfile() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const user = useRecoilValue(userAtom);
    const { data, isLoading, isError } = useFetchUser();
    const navigate = useNavigate()
    const queryClient = useQueryClient();
    const handleLogout = async () => {
        try{
            await axios.get(`${BACKEND_URL}/auth/logout`,{withCredentials: true});
            localStorage.removeItem("type");
            queryClient.clear()
            navigate("/authoritySignin")
        }catch(err){
            console.log(err);
        }
    };

    if (isLoading) return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <Loader />
        </div>
    );

    if (isError) return (
        <div className="p-8 text-center text-red-600">
            Error fetching user data. Please try again later.
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Profile Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-lg overflow-hidden shadow-md mb-6">
                <div className="px-6 py-8 relative">
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => handleLogout()}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/90 shadow-lg">
                            <img
                                src={data.profileImage}
                                alt={`${data.name}'s profile`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400x400?text=Profile";
                                }}
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-white mb-1">{data.name}</h2>
                            <p className="text-blue-100 mb-3">{data.role}</p>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                            >
                                <PenSquare className="h-3.5 w-3.5" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Contact Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 transition-colors border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Mail className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email Address</p>
                                    <p className="font-medium text-gray-800">{data.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 transition-colors border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Phone className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Department</p>
                                    <p className="font-medium text-gray-800">{data.departmentName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 transition-colors border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building2 className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Office Location</p>
                                    <p className="font-medium text-gray-800">{data.office.name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 transition-colors border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Department Role</p>
                                    <p className="font-medium text-gray-800">{data.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-5 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue={data.name}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    defaultValue={data.email}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Profile Image
                                </label>
                                <div className="flex gap-3 items-center">
                                    <img
                                        src={data.profileImage}
                                        alt="Profile Preview"
                                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                    />
                                    <input
                                        type="url"
                                        defaultValue={data.profileImage}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter image URL"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    alert("Profile updated successfully!");
                                }}
                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AuthorityProfile;