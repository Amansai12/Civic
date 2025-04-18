import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Building2, 
  User, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Users,
  User2,
  Phone,
  FileText
} from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

function Details({ issue }) {
  const formatDate = (date) => {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-amber-50 text-amber-900 border-amber-200',
      IN_PROGRESS: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      RESOLVED: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      UNDER_REVIEW: 'bg-slate-50 text-slate-900 border-slate-200',
      FORWARDED: 'bg-blue-50 text-blue-900 border-blue-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-900 border-gray-200';
  };

  return (
    <Card className="border border-blue-700 shadow-md bg-white/98 backdrop-blur sticky top-6 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-0 border-b-2 border-slate-200 bg-slate-50">
        <div className="flex items-center mb-2">
          <FileText className="h-5 w-5 text-slate-700 mr-2" />
          <CardTitle className="text-xl font-semibold text-slate-800">Case File: {issue.id || 'N/A'}</CardTitle>
        </div>
        <div className="flex justify-between items-center pb-3">
          <span className="text-sm font-medium text-slate-600">Official Record</span>
          <Badge className={cn("px-3 py-1 border font-medium", getStatusColor(issue.status))}>
            {issue.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 bg-slate-50/30">
        <div className="space-y-6">
          {/* Department Section */}
          <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
            <Building2 className="h-5 w-5 text-slate-700 mt-1" />
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-600">Responsible Department</label>
              <p className="text-lg font-semibold text-slate-800">
                {issue.departmentName || "Pending Assignment"}
              </p>
            </div>
          </div>

          {/* Assignment Section */}
          <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
            <User className="h-5 w-5 text-slate-700 mt-1" />
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-600">Case Officer</label>
              <p className="text-lg font-semibold text-slate-800">
                {issue.assignedTo?.name || "Awaiting Assignment"}
              </p>
              {issue.assignedTo && (
                <>
                  <p className="text-sm text-slate-600">{issue.assignedTo.role}</p>
                  <p className="text-sm text-slate-600">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Date Assigned: {formatDate(issue.assignedToDate)}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Office Section */}
          <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
            <Building2 className="h-5 w-5 text-slate-700 mt-1" />
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-600">Governing Office</label>
              <p className="text-lg font-semibold text-slate-800">
                {issue.office?.name || "Not Specified"}
              </p>
            </div>
          </div>

          {/* Location Section */}
          <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
            <MapPin className="h-5 w-5 text-slate-700 mt-1" />
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-600">Incident Location</label>
              <p className="text-lg font-semibold text-slate-800">{issue.location || "Not Specified"}</p>
              <p className="text-sm text-slate-600">{issue.address || "Address not provided"}</p>
            </div>
          </div>
          
          {!issue.isAnonymous && (
            <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
              <User2 className="h-5 w-5 text-slate-700 mt-1" />
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-600">Reporting Citizen</label>
                <p className="text-lg font-semibold text-slate-800">{issue.user.name}</p>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <Phone size={13} /> {issue.user.phone}
                </p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="pt-4 bg-slate-50 p-4 rounded-md border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Case Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-700" />
                <span className="text-sm text-slate-700 font-medium">
                  Filing Date: {formatDate(issue.createdAt)}
                </span>
              </div>
              
              {issue.isAnonymous && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-700" />
                  <span className="text-sm text-slate-700 font-medium">Confidential Report</span>
                </div>
              )}

              {issue.dispute && (
                <div className="col-span-2 flex items-start gap-2 bg-red-50 p-3 rounded-md border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-700 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-red-800 block">Resolution Disputed</span>
                    <span className="text-sm text-red-700">{issue.disputeMessage}</span>
                  </div>
                </div>
              )}

              {issue.ResolutionConfirmation && (
                <div className="col-span-2 flex items-start gap-2 bg-emerald-50 p-3 rounded-md border border-emerald-200">
                  <CheckCircle className="h-4 w-4 text-emerald-700 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-emerald-800 block">Case Resolved</span>
                    <span className="text-sm text-emerald-700">Resolution confirmed on {formatDate(issue.ResolutionConfirmation.date)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Details;