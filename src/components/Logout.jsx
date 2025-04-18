import { BACKEND_URL } from '@/config'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout() {
    const [loading, setLoading] = React.useState(false)
    const {toast} = useToast()
    const navigate = useNavigate()
    useEffect(()=>{
        const logout = async () => {
            try{
                localStorage.removeItem('type');
                setLoading(true)
                await axios.get(`${BACKEND_URL}/auth/logout`,{withCredentials:true})
                toast({
                    title:"Logout successful",
                    description:"You have been logged out successfully",
                    className:"bg-green-700 text-white"
                })
                navigate('/signin')
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }
        logout();
    },[])
  return (
    <div className='flex justify-center items-center h-screen'>
        {loading ? <div className='flex flex-col items-center gap-2'>
                <Loader2 className='animate-spin' size={32}/>
                <p>Logging out...</p>
            </div> : <p>Logged out successfully</p>}


    </div>
  )
}

export default Logout