import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Shield, Briefcase } from 'lucide-react';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '@/store/user';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/config';

const AuthorityLoginForm = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/authoritylogin`, formData, { withCredentials: true });
      localStorage.setItem('type', res.data.user.role);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (e) {
      toast({
        title: "Error",
        description: e.response.data.message,
        variant: "destructive"
      });
      setError(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgot = async () => {
    navigate('/reset-password', { 
      state: { 
        type: 'email'
      } 
    });
  }
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md border-gray-200 shadow-md">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-blue-700 mr-2" />
              <span className="text-sm font-semibold text-blue-700">AUTHORITY PORTAL</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Authority Login
            </CardTitle>
            <p className="text-center text-gray-500 text-sm mt-1">
              Secure access for government employees
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
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@department.gov"
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <p className="text-xs text-gray-500">Enter your official government email</p>
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
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                  {loading ? 'Authenticating...' : 'Access Portal'}
                </Button>
              </div>

              <p className="text-sm text-center text-gray-600 pt-2">
                                Don't have an account?{" "}
                                <Link to="/AuthoritySignup" className="text-blue-600 font-medium hover:underline">
                                    Register Now
                                </Link>
                            </p>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-center">
                  <p className="text-xs text-center text-gray-500">
                    For technical support, contact the IT department
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Image with gradient overlay and text */}
      <div className="w-1/2 relative hidden md:block bg-blue-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url(/api/placeholder/800/1200)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center px-12 text-white z-10">
          <div className="mb-8 flex items-center justify-center">
            <Briefcase className="h-16 w-16 mr-4" />
            <h1 className="text-3xl font-bold">STAFF MANAGEMENT PORTAL</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-center">
            Authority Access
          </h2>
          <p className="text-lg leading-relaxed text-center">
            Welcome to the secure staff portal. This system provides authorized personnel with tools to manage citizen reports, track community issues, and coordinate services.
          </p>
          <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-2">Administrative Functions</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-300 mr-2"></div>
                <span>Citizen issue management and resolution</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-300 mr-2"></div>
                <span>Department coordination and task assignment</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-300 mr-2"></div>
                <span>Analytics and reporting dashboard</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
          © 2025 National Government Services • For Official Use Only • Authorized Access Only
        </div>
      </div>
    </div>
  );
};

export default AuthorityLoginForm;