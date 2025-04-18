import React from 'react';
import { Download } from 'lucide-react';
import { BACKEND_URL } from '@/config';

const DownloadReportButton = ({ issueId }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      // Make request to download endpoint
      const response = await fetch(`${BACKEND_URL}/issue/${issueId}/report`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
          
        },
        credentials : 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `issue-report-${issueId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading report:', error);
      // You might want to add proper error handling/notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:bg-blue-400"
    >
      <Download className="w-4 h-4 mr-2" />
      {isLoading ? 'Generating...' : 'Report'}
    </button>
  );
};

export default DownloadReportButton;



