import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Loader from "./Loader";
import { useFetchAnalytics } from "@/api/query";
import { endOfMonth, startOfMonth } from "date-fns";
import { AlertTriangle, Building2, CheckCircle, Droplet, LayoutDashboard, Leaf, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";

const SubordinateAnalyticsDashboard = () => {
  const [fromDate, setFromDate] = useState(startOfMonth(new Date()));
  const [analyticsData, setAnalyticsData] = useState({});
  const [recents,setRecents] = useState([]);
  const [toDate, setToDate] = useState(endOfMonth(new Date()));;
  const { data, isLoading, isSuccess, isError } = useFetchAnalytics(
    fromDate,
    toDate,
    localStorage.getItem("type")
  );

  const navigate = useNavigate()
  

  useEffect(()=>{
    if(isSuccess){
        let recentIssues = [];
        for(let i=0;i<4;i++){
            if(data.issues[i]) recentIssues.push(data.issues[i])
        }
        setRecents(recentIssues)
        let d = {
            totalIssues : 0,
            conflict: 0,
            percent: 0,
        }
        data.issues.forEach((issue) => {
            d[issue.status] = (d[issue.status] || 0) + 1;
            if(issue.dispute) d['conflict'] = (d['conflict'] || 0) + 1;
            d.totalIssues += 1;
            
        })

        setAnalyticsData(d)

    }
  },[isSuccess,data])
  


  

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Data Retrieval Error
          </h2>
          <p className="text-gray-600">
            Please try again later or contact system administrator.
          </p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Issues
            </CardTitle>
            <LayoutDashboard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.totalIssues}
            </div>
            <p className="text-xs text-gray-500 mt-1">Across all departments</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Resolved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.RESOLVED}
            </div>
            <div className="flex items-center mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(analyticsData.RESOLVED/analyticsData.totalIssues) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {(analyticsData.RESOLVED/analyticsData.totalIssues) * 100}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Pending
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(analyticsData.PENDING || 0) + (analyticsData.UNDER_REVIEW || 0) + (analyticsData.FORWARDED || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Awaiting resolution</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Conflicts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.conflict}
            </div>
            <p className="text-xs text-red-600 font-medium mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Department Status */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Recent Issue updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recents.map((issue,index) => 
            <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {issue.title}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {issue.updates.length} update(s)
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${issue.updates.length * 10}%` }}
              ></div>
            </div>
          </div>)}

              
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
            Detailed Breakdown of Pending Issue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {"Forwarded"}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {analyticsData.FORWARDED} 
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${analyticsData.FORWARDED * 10}%` }}
              ></div>
            </div>
          </div>
            <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {"Under review"}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {analyticsData.UNDER_REVIEW || 0} 
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${analyticsData.UNDER_REVIEW || 0 * 10}%` }}
              ></div>
            </div>
          </div>
            <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {"In progress"}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {analyticsData.IN_PROGRESS || 0} 
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${analyticsData.IN_PROGRESS || 0 * 10}%` }}
              ></div>
            </div>
          </div>

              
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Conflict Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.issues.filter((i) => i.dispute == true).map((issue,index) => 
            <div onClick={() => navigate(`/issue/${issue.id}`)} className="flex flex-col gap-2 border border-gray-200 p-3 rounded-md cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-500 cursor-pointer">
                  {issue.title}
                </span>
              </div>
              <span className="text-[12px] font-semibold text-gray-900">
                {formatDate(issue.resolvedDate)}
              </span>
            </div>
              <p className="text-[12px] text-gray-500">{issue.disputeMessage}</p>
            
          </div>)}

              
            </div>
          </CardContent>
        </Card>

        {/* Priority Issues */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Recent Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recents.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/issue/${issue.id}`)}
                >
                  <div
                    className={`mt-0.5 p-1.5 rounded-full ${
                      issue.status === "Critical"
                        ? "bg-red-100"
                        : issue.status === "High"
                        ? "bg-amber-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-3.5 w-3.5 ${
                        issue.status === "Critical"
                          ? "text-red-600"
                          : issue.status === "High"
                          ? "text-amber-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {issue.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {issue.address}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span
                        className={`text-xs font-medium ${
                          issue.status === "Critical"
                            ? "text-red-600"
                            : issue.status === "High"
                            ? "text-amber-600"
                            : "text-blue-600"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubordinateAnalyticsDashboard;
