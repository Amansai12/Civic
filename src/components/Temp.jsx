import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnalyticsDashboard = ({issues}) => {
   
   

  // Prepare data for status distribution
  const statusData = useMemo(() => {
    const statusCounts = issues.reduce((acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));
  }, []);

  // Prepare data for department distribution
  const departmentData = useMemo(() => {
    const deptCounts = issues.reduce((acc, issue) => {
      acc[issue.departmentName] = (acc[issue.departmentName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(deptCounts).map(([department, count]) => ({
      department,
      count
    }));
  }, []);

  // Prepare data for timeline analysis
  const timelineData = useMemo(() => {
    const timeline = issues.reduce((acc, issue) => {
      const date = new Date(issue.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(timeline).map(([date, count]) => ({
      date,
      issues: count
    }));
  }, []);

  // Prepare data for engagement analysis (upvotes)
  const engagementData = useMemo(() => {
    return issues.map(issue => ({
      title: issue.title.substring(0, 20) + '...',
      upvotes: issue.upVotes.length,
      updates: issue.updates.length
    }));
  }, []);

  return (
    <div className="space-y-8 p-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Issues by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="department" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="upvotes" fill="#8884d8" name="Upvotes" />
                    <Bar dataKey="updates" fill="#82ca9d" name="Updates" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;