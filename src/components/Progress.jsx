import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, CheckCircle2, Clock, FileText, ClipboardList, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import '../App.css'

function Progress({ issue }) {
  const getProgressSteps = () => {
    const steps = [
      { label: 'Filed', icon: FileText, complete: true },
      { label: 'Under Review', icon: ClipboardList, complete: ['IN_PROGRESS', 'RESOLVED', 'UNDER_REVIEW', 'FORWARDED'].includes(issue.status) },
      { label: 'Forwarded', icon: AlertTriangle, complete: ['IN_PROGRESS', 'RESOLVED', 'FORWARDED'].includes(issue.status) },
      { label: 'In Process', icon: Activity, complete: ['IN_PROGRESS', 'RESOLVED'].includes(issue.status) },
      { label: 'Resolved', icon: CheckCircle2, complete: issue.status === 'RESOLVED' }
    ];
    return steps;
  };

  const getCount = (status) => {
    const statusMap = {
      'RESOLVED': 4,
      'FORWARDED': 2,
      'PENDING': 0,
      'IN_PROGRESS': 3,
      'UNDER_REVIEW': 1
    };
    return statusMap[status] || 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="border-2 border-slate-300 shadow-md bg-white/98 backdrop-blur transition-all duration-300">
      <CardHeader className="pb-0 border-b-2 border-slate-200 bg-slate-50">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-slate-800 pb-3">
          <ClipboardList className="h-5 w-5 text-slate-700" />
          Case Status Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 bg-slate-50/30">
        {/* Progress Steps */}
        <div className="mb-8 md:mb-12 overflow-x-auto scrollbar-hidden pt-2">
          <div className="relative min-w-[600px] md:min-w-0">
            {/* Progress Bar */}
            <div className="absolute top-5 w-full h-1.5 bg-slate-200 rounded-full">
              <div 
                className="absolute h-full bg-gradient-to-r from-slate-700 to-slate-500 rounded-full transition-all duration-700 ease-in-out"
                style={{ width: `${(getCount(issue?.status)/4) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {getProgressSteps().map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                    step.complete ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-400 border-slate-300",
                  )}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "mt-2 text-sm font-medium transition-colors duration-300",
                    step.complete ? "text-slate-800" : "text-slate-500"
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Updates Timeline */}
        <div className="mt-6 border-t-2 border-slate-200 pt-4">
          <div className="flex items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Official Case Updates</h3>
            <div className="ml-3 flex-1 h-px bg-slate-200"></div>
          </div>
          
          <div className="space-y-4 px-2 md:px-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-transparent">
            {issue.updates.map((update, index) => (
              <div 
                key={update.id}
                className={cn(
                  "relative pl-6 md:pl-8 pb-6",
                  index !== issue.updates.length - 1 && "border-l-2 border-slate-300"
                )}
              >
                <div className="absolute left-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-slate-600 border-2 border-white" />
                <div className="bg-slate-50 rounded-lg p-4 md:p-5 ml-2 md:ml-4 border border-slate-200 hover:border-slate-300 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{update.description}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 text-sm text-slate-600">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>{formatDate(update.createdAt)}</span>
                        <Badge className="bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 px-2 py-0.5 rounded">
                          {update.type || "Official Update"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 border-t border-slate-200 pt-4 text-center">
          <p className="text-xs text-slate-500">
            This is an official government record of case #{issue.id || 'N/A'}.
            All updates are logged in compliance with departmental procedures.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default Progress;