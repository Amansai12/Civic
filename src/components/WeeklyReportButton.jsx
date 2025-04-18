import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { DownloadCloud, Loader2 } from "lucide-react";
import { BACKEND_URL } from '@/config';

const ReportDownloadButton = ({toDate,fromDate}) => {

  const [loading,setLoading] = useState(false);
  const handleDownload = async () => {
    try {
    setLoading(true);
      const response = await fetch(BACKEND_URL+'/issue/reports/download?fromDate='+fromDate+'&toDate='+toDate, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `issue-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      // Handle error appropriately
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Button 
        onClick={handleDownload}
        className="flex items-center gap-2"
      >
        
        {loading ? <p className='flex justify-center items-center gap-2'><Loader2 className='animate-spin' /> generating report.. </p> : <p className='flex justify-center items-center gap-2'><DownloadCloud className="w-4 h-4" /> Download Report</p>}
      </Button>
    </div>
  );
};

export default ReportDownloadButton;