import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Phone, Lock, MapPin, Shield } from "lucide-react";
import { useUserSignup } from "@/api/query";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const SignupForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [error, setError] = React.useState("");
    const [formData, setFormData] = React.useState({
        name: "",
        phone: "",
        password: "",
        latitude: null,
        longitude: null,
    });
    const { data, mutate: signup, isPending, isError, isSuccess, error: err } = useUserSignup();
    const { toast } = useToast();

    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Unable to get location. Please enable location services.");
                }
            );
        }
    }, []);

    useEffect(() => {
        if (isError) {
            toast({
                title: "Error",
                description: err.response?.data?.error,
                variant: "destructive",
            });
        }
    }, [isError]);

    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (!formData.name.trim()) {
                setError("Name is required");
                return;
            }

            if (!validatePhone(formData.phone)) {
                setError("Please enter a valid 10-digit phone number");
                return;
            }

            if (formData.password.length < 8) {
                setError("Password must be at least 8 characters long");
                return;
            }

            if (!formData.latitude || !formData.longitude) {
                setError("Location access is required");
                return;
            }

            signup(formData);
        } catch (error) {
            console.error("Error during signup:", error);
        }
    };

    if (isSuccess) {
        queryClient.setQueryData(["user"], data);
        navigate("/verify-otp", { state: { type: "phone", credential: formData.phone } });
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left side - Official branding */}
            <div className="w-1/2 relative hidden md:block bg-blue-900">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage: "url(/api/placeholder/800/1200)",
                    }}
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center px-12 text-white z-10">
                    <div className="mb-8 flex items-center justify-center">
                        <Shield className="h-16 w-16 mr-4" />
                        <h1 className="text-3xl font-bold">CITIZEN PORTAL</h1>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 text-center">
                        Serving Citizens Better
                    </h2>
                    <p className="text-lg leading-relaxed text-center">
                        A secure platform connecting citizens with government services. Report concerns, 
                        access public information, and engage with your community through our official portal.
                    </p>
                    <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-2">Benefits of Registration</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-300 mr-2"></div>
                                <span>Get realtime feed of your reports</span>
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-300 mr-2"></div>
                                <span>Efficient issue reporting and tracking</span>
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-300 mr-2"></div>
                                <span>Real-time updates on community matters</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
                    © 2025 National Government Services • Privacy Policy • Terms of Use
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
                <Card className="w-full max-w-md border-gray-200 shadow-md">
                    <CardHeader className="border-b bg-gray-50">
                        <div className="flex items-center justify-center mb-2">
                            <Shield className="h-6 w-6 text-blue-700 mr-2" />
                            <span className="text-sm font-semibold text-blue-700">OFFICIAL PORTAL</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center text-gray-800">Citizen Registration</CardTitle>
                        <p className="text-center text-gray-500 text-sm mt-1">
                            Create an account to access government services
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <Alert variant="destructive" className="border-red-200 bg-red-50">
                                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700">Full Legal Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="1234567890"
                                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Your phone will be used for verification</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700">Secure Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Minimum 8 characters required</p>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                <MapPin className="h-4 w-4 text-blue-700" />
                                <span className="text-sm text-gray-700">
                                    {formData.latitude ? "Location access granted" : "Accessing location..."}
                                </span>
                                <span className="text-xs text-gray-500 ml-auto">Required for local services</span>
                            </div>

                            <div className="pt-2">
                                <Button 
                                    type="submit" 
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                                >
                                    {isPending ? "Processing..." : "Register Account"}
                                </Button>
                            </div>

                            <p className="text-sm text-center text-gray-600 pt-2">
                                By registering, you agree to our{" "}
                                <Link to="/terms" className="text-blue-600 hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-blue-600 hover:underline">
                                    Privacy Policy
                                </Link>
                            </p>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <p className="text-sm text-center text-gray-600">
                                    Already have an account?{" "}
                                    <Link to="/signin" className="text-blue-600 font-medium hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SignupForm;