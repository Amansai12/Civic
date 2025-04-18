import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Lock, Shield } from "lucide-react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userAtom } from "@/store/user";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/config";

const LoginForm = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const setUser = useSetRecoilState(userAtom);
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validatePhone(formData.phone)) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${BACKEND_URL}/auth/userlogin`, formData, {
                withCredentials: true,
            });
            setUser(res.data?.user);
            localStorage.setItem("type", "citizen");
            queryClient.setQueryData(["user"], res.data?.user);

            navigate("/");
        } catch (e) {
            toast({
                title: "Error",
                description: e.response.data.message,
                variant: "destructive",
            });
            setError(e.response.data.message);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = async () => {
        navigate("/reset-password", {
            state: {
                type: "phone number",
            },
        });
    };

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
                        Welcome Back
                    </h2>
                    <p className="text-lg leading-relaxed text-center">
                        Access government services, track reported issues, and stay connected with your community through our secure citizen portal.
                    </p>
                    <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-2">Service Highlights</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-300 mr-2"></div>
                                <span>Report and track community issues</span>
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-300 mr-2"></div>
                                <span>Get realtime feed of your reports</span>
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-300 mr-2"></div>
                                <span>Communicate with local authorities</span>
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
                        <CardTitle className="text-2xl font-bold text-center text-gray-800">Citizen Login</CardTitle>
                        <p className="text-center text-gray-500 text-sm mt-1">
                            Access your government services account
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
                                <p className="text-xs text-gray-500">Enter the registered phone number</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700">Password</Label>
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
                            </div>

                            <div className="flex justify-end">
                                <p 
                                    className="cursor-pointer text-sm text-blue-600 hover:underline" 
                                    onClick={handleForgot}
                                >
                                    Forgot Password?
                                </p>
                            </div>

                            <div className="pt-2">
                                <Button 
                                    type="submit" 
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                                >
                                    {loading ? "Authenticating..." : "Sign In"}
                                </Button>
                            </div>

                            <div className="relative py-3">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-sm text-gray-500">OR</span>
                                </div>
                            </div>

                            <div>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                                    onClick={() => navigate("/signup")}
                                >
                                    Create New Account
                                </Button>
                            </div>

                            <p className="text-sm text-center text-gray-600 pt-2">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                                    Register Now
                                </Link>
                            </p>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <p className="text-xs text-center text-gray-500">
                                    By signing in, you agree to our{" "}
                                    <Link to="/terms" className="text-blue-600 hover:underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="/privacy" className="text-blue-600 hover:underline">
                                        Privacy Policy
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

export default LoginForm;