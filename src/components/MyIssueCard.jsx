import React from "react";
import {
  Clock,
  MapPin,
  Building2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


function SubIssueCard({ data}) {
  const navigate = useNavigate();




  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

 
  
  return (
    <>
      <Card className="w-full mb-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl overflow-hidden border border-gray-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                {data.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <p className="text-sm">
                  Submitted by <span className="font-medium">Amansai</span> on{" "}
                  <span className="font-medium">
                    {formatDate(data.createdAt)}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:ml-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                  data.status === "PENDING"
                    ? "bg-amber-100 text-amber-800"
                    : data.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {data.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {data.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700">
                      Department:{" "}
                      <span className="font-semibold">
                        {data.departmentName || "Not Assigned"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700">
                      Location:{" "}
                      <span className="font-semibold">{data.address}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden shadow-sm">
              <img
                src={data.image || ""}
                alt={data.title || "No Image Available"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "";
                }}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              className="gap-2 cursor-pointer"
              onClick={() => navigate(`/issue/${data.id}`)}
            >
              <Eye className="h-4 w-4" />
              Details
            </Button>

          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default SubIssueCard;