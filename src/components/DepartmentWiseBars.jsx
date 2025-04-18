import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

const DepartmentIssuesCard = ({ departmentsData, isLoading, error }) => {

    
  const colors = {
    resolved: '#00C49F',
    under_review: '#FFBB28',
    disputed: '#FF8042',
    in_progress: '#8884d8',
    forwarded: '#82ca9d'
  };

  const statusLabels = {
    resolved: 'Resolved',
    under_review: 'Under Review',
    disputed: 'Disputed',
    in_progress: 'In Progress',
    forwarded: 'Forwarded'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.fill }}
            />
            <span>{statusLabels[entry.dataKey]}: {entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Issues by Departments</span>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p>Error loading data: {error.message}</p>
          </div>
        ) : !departmentsData?.length ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No data available</p>
            <p className="text-sm mt-2">Please check back later</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="office"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => statusLabels[value]}
                  wrapperStyle={{ fontSize: 12, paddingTop: '20px' }}
                />
                {Object.keys(colors).map((status) => (
                  <Bar
                    key={status}
                    dataKey={status}
                    fill={colors[status]}
                    radius={[4, 4, 0, 0]}
                  >
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentIssuesCard;