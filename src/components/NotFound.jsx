import React from 'react';
import { AlertTriangle, Home, FileSearch, HelpCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white border-2 border-blue-300 rounded-lg shadow-md overflow-hidden">
          {/* Error Header */}
          <div className="bg-blue-700 text-white p-4 flex items-center border-b-4 border-amber-500">
            <AlertTriangle className="h-6 w-6 mr-3 text-amber-400" />
            <h1 className="text-xl font-semibold tracking-wide">ERROR 404: PAGE NOT FOUND</h1>
          </div>
          
          {/* Error Content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full border-2 border-blue-300">
                <span className="text-5xl font-bold text-blue-700">404</span>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">The requested resource could not be located</h2>
                <p className="text-blue-600 mb-6">
                  The page you are attempting to access is not available at this time. 
                  This may be due to an incorrect URL, a moved resource, or insufficient access privileges.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium mb-2">Reference Information:</p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li><span className="font-medium">Error Code:</span> 404</li>
                    <li><span className="font-medium">Request Time:</span> {new Date().toLocaleString()}</li>
                    <li><span className="font-medium">Session ID:</span> {Math.random().toString(36).substring(2, 10).toUpperCase()}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Footer */}
          <div className="bg-blue-100 border-t border-blue-200 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/" className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded font-medium transition-colors">
                <Home className="h-4 w-4" />
                Return to Homepage
              </a>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-blue-800 text-white py-4 px-6 text-center text-sm">
        <div className="max-w-5xl mx-auto">
          <p className="mb-2">This is an official government website. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="/privacy" className="text-blue-300 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/accessibility" className="text-blue-300 hover:text-white transition-colors">Accessibility</a>
            <a href="/security" className="text-blue-300 hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;