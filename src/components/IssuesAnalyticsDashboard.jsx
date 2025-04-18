import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import IssueHeatmap from "./PieChart";
import DashboardTopBar from "./DashboardTopBar";
import AnalyticsDashboard from "./Temp";
import DepartmentIssuesCard from "./DepartmentWiseBars";
import Loader from "./Loader";
import { useFetchAnalytics } from "@/api/query";
import { endOfMonth, startOfMonth } from "date-fns";
import { AlertTriangle, CheckCircle, LayoutDashboard, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import '../App.css'


const IssueAnalyticsDashboard = () => {
  const [fromDate, setFromDate] = useState(startOfMonth(new Date()));
  const [departmentsData, setDepartmentsData] = useState([]);
  const [recents,setRecents] = useState([]);
  const [toDate, setToDate] = useState(endOfMonth(new Date()));
  const [analyticsData, setAnalyticsData] = useState({});
  
  const { data, isLoading, isSuccess, isError } = useFetchAnalytics(
    fromDate,
    toDate,
    localStorage.getItem("type")
  );

  // Government color palette
  const GOV_COLORS = [
    "#1a4480", // Navy Blue
    "#2e8540", // Green
    "#d83933", // Red
    "#02bfe7", // Light Blue
    "#205493", // Darker Blue
    "#4c2c92"  // Purple
  ];

  useEffect(() => {
    if (isSuccess) {
      let departmentData = [];
      data.Issues?.forEach((issue) => {
        let department = issue.departmentName;
        if(department == null) department = "Not Assigned";

        const existingDepartment = departmentData.find(
          (d) => d.office === department
        );
        if (existingDepartment) {
          existingDepartment.total += 1;
          if (issue.status === "RESOLVED") {
            existingDepartment.resolved += 1;
          } else if (issue.status === "IN-PROGRESS") {
            existingDepartment.in_progress += 1;
          } else if (issue.status === "DISPUTED") {
            existingDepartment.disputed += 1;
          } else if (issue.status === "UNDER_REVIEW") {
            existingDepartment.under_review += 1;
          } else if (issue.status === "FORWARDED") {
            existingDepartment.forwarded += 1;
          }
        } else {
          departmentData.push({
            office: department,
            total: 1,
            resolved: issue.status === "RESOLVED" ? 1 : 0,
            disputed: issue.status === "DISPUTED" ? 1 : 0,
            in_progress: issue.status === "IN_PROGRESS" ? 1 : 0,
            under_review: issue.status === "UNDER_REVIEW" ? 1 : 0,
            forwarded: issue.status === "FORWARDED" ? 1 : 0,
          });
        }
      });
      setDepartmentsData(departmentData);
    }
  }, [isSuccess, data]);

  const navigate = useNavigate()
  

  useEffect(()=>{
    if(isSuccess){
      console.log()
        let recentIssues = [];
        for(let i=0;i<4;i++){
            if(data.Issues[i]) recentIssues.push(data.Issues[i])
        }
        setRecents(recentIssues)
        let d = {
            totalIssues : 0,
            conflict: 0,
            percent: 0,
        }
        data.Issues.forEach((issue) => {
            d[issue.status] = (d[issue.status] || 0) + 1;
            if(issue.dispute) d['conflict'] = (d['conflict'] || 0) + 1;
            d.totalIssues += 1;
            
        })

        setAnalyticsData(d)

    }
  },[isSuccess,data])

  if (isError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Data Retrieval Error</h2>
          <p className="text-gray-600">Please try again later or contact system administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 py-2 bg-slate-50">
      
      
      <DashboardTopBar setFromDate={setFromDate} setToDate={setToDate} />
      
      {isLoading ? (
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="max-h-[100vh] overflow-y-scroll flex flex-col gap-3 scrollbar-hidden">
          <h1 className="font-bold text-2xl my-4">Analytics</h1>
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
              {analyticsData.RESOLVED || 0}
            </div>
            <div className="flex items-center mt-1 overflow-hidden relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(analyticsData.RESOLVED || 0/analyticsData.totalIssues || 0) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs ml-2 text-green-400 z-50">
                {Math.floor(((analyticsData.RESOLVED || 0)/(analyticsData.totalIssues || 1)) * 100)}%
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
              Department Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentsData.length > 0 ? departmentsData.map((dep,index) => 
            <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {dep.office}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {dep.total}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(dep.total/analyticsData.totalIssues) * 100}%` }}
              ></div>
            </div>
          </div>) : <p className="text-center text-gray-500">No data available</p>}

              
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
                {analyticsData.FORWARDED || 0} 
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${((analyticsData.FORWARDED || 0) * 100/(analyticsData.totalIssues || 1))}%` }}
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
                style={{ width: `${(analyticsData.UNDER_REVIEW || 0 )* 10}%` }}
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
                style={{ width: `${((analyticsData.IN_PROGRESS || 0) * analyticsData.totalIssues) * 100}%` }}
              ></div>
            </div>
          </div>

              
            </div>
          </CardContent>
        </Card>
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
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Conflict Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.Issues.length <= 0 ? <p className="text-gray-500 text-center">No data available</p> : data?.Issues.filter((i) => i.dispute == true).map((issue,index) => 
            <div key={index} onClick={() => navigate(`/issue/${issue.id}`)} className="flex flex-col gap-2 border border-gray-200 p-3 rounded-md cursor-pointer">
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

        
        
      </div>
    </div>
    <h1 className="font-bold text-2xl my-4">Charts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issues by Office */}
          <Card className="shadow-md border border-gray-300 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <CardTitle className="text-gray-800 text-lg font-medium">Issues by Department</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <DepartmentIssuesCard
                departmentsData={departmentsData}
                isLoading={isLoading}
                error={false}
              />
            </CardContent>
          </Card>

          {/* Issue Status Distribution */}
          <Card className="shadow-md border border-gray-300 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <CardTitle className="text-gray-800 text-lg font-medium">Issue Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.byStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {data.byStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={GOV_COLORS[index % GOV_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Heatmap Card */}
          <Card className="shadow-md border border-gray-300 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <CardTitle className="text-gray-800 text-lg font-medium">Issue Type Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <IssueHeatmap issues={data.Issues} />
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card className="shadow-md border border-gray-300 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <CardTitle className="text-gray-800 text-lg font-medium">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <AnalyticsDashboard issues={data.Issues} />
            </CardContent>
          </Card>
        </div>
        </div>
      )}
      
      
    </div>
  );
};

export default IssueAnalyticsDashboard;