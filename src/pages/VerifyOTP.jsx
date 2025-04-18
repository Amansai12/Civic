import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import { BACKEND_URL } from '@/config';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [error, setError] = React.useState('');
  const [timer, setTimer] = React.useState(30);
  const [loading,setLoading] = useState(false)
  const inputRefs = Array(6).fill(0).map(() => React.useRef(null));

  const credential = location.state?.credential;
  const type = location.state?.type;


  React.useEffect(() => {
    if (!credential) {
      navigate('/signup');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [credential, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOTP = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOTP[index] = char;
    });
    setOtp(newOTP);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.some(digit => !digit)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }


    // Here you would typically send the OTP to the backend for verification
    try{
        setLoading(true)
        if(type == 'phone'){
          const res = await axios.post(`${BACKEND_URL}/auth/user-verify-token`,{code : otp.join("")},{
              withCredentials : true
          })
          localStorage.setItem("type","citizen")
          navigate('/')
        }else{
          const res = await axios.post(`${BACKEND_URL}/auth/authority-verify-token`,{code : otp.join("")},{
              withCredentials : true
          })
          navigate('/dashboard')
        }
    }catch(e){
        console.log(e)
    }finally{
        setLoading(false)

    }
  };

  const handleResendOTP = async () => {
    setTimer(30);
    try{
        const res = axios.post(`${BACKEND_URL}/auth/userResentOTP`,{type : credential},{credential : credential,type : type},{
            withCredentials : true
        })
    }catch(e){
        console.log(e)
    }finally{
        console.log("otp sent")
        alert("otp sent")
    }
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify {type === 'phone' ? 'Phone' : 'Email'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="text-center text-sm text-gray-600">
              Enter the 6-digit code sent to<br />
              <span className="font-medium">{credential}</span>
            </div>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold"
                  autoComplete="off"
                />
              ))}
            </div>

            <Button type="submit" className="w-full">
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                disabled={timer > 0}
                onClick={handleResendOTP}
                className="text-sm"
              >
                {timer > 0 ? 
                  `Resend OTP in ${timer}s` : 
                  'Resend OTP'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;