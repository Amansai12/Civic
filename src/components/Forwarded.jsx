import React, { useState, useEffect } from "react";
import {
  Search,
  Wrench,
  Zap,
  MapPin,
  Trash2,
  Droplet,
  Leaf,
  HardHat,
  Meh,
  Loader2,
  AlertTriangle,
  User2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchForwardedIssues } from "@/api/query";
import { useInView } from "react-intersection-observer";
import { Button } from "./ui/button";
import "../App.css";
import Loader from "./Loader";
import SearchAndFilters from "./SearchandFilters";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import DownloadReportButton from "./DownloadReport";

function Forwarded() {
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();
  const navigate = useNavigate()
  const departments = [
    { id: "engineering", name: "Engineering", icon: Wrench },
    { id: "electrical", name: "Electrical", icon: Zap },
    { id: "roads", name: "Roads & Infrastructure", icon: MapPin },
    { id: "sanitation", name: "Sanitation", icon: Trash2 },
    { id: "water", name: "Water Supply", icon: Droplet },
    { id: "welfare", name: "welfare", icon: Leaf },
    { id: "construction", name: "Construction", icon: HardHat },
  ];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFetchForwardedIssues(searchTerm);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("Fetching next page...");
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDepartmentSelect = (departmentName) => {
    setSearchTerm(departmentName);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isError) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load issues. Please try again later or contact support if the
            problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  console.log(data);
  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <SearchAndFilters setSearchTerm={setSearchTerm} searchTerm={searchTerm} departments={departments} handleDepartmentSelect={handleDepartmentSelect} />

      {/* Forwarded Issues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading && !data ? (
          <div className="min-h-[60vh] min-w-[70vw] flex items-center justify-center">
           
          <Loader />
        
    </div>
        ) : data?.pages[0].data.issues.length > 0 ? (
          data?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.issues.map((issue) => (
                <Card key={issue.id} className="w-full overflow-hidden">
                  <CardHeader className="border-b p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-semibold truncate">
                            {issue.title}
                          </CardTitle>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Forwarded on {formatDate(issue.assignedToDate)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${getPriorityColor(
                          issue.upVotes?.length > 10
                            ? "high"
                            : issue.upVotes?.length > 5
                            ? "medium"
                            : "low"
                        )}`}
                      >
                        {issue.upVotes?.length > 10
                          ? "high"
                          : issue.upVotes?.length > 5
                          ? "medium"
                          : "low"}{" "}
                        Priority
                      </span>
                    </div>
                  </CardHeader>
                  <div className="aspect-video relative">
                    <img
                      src={
                        issue.image ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={issue.title || "No Image Available"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {issue.description}
                      </p>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium truncate">
                            {issue.address}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Department</p>
                          <p className="font-medium truncate">
                            {issue.departmentName}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <p className="font-medium truncate">{issue.status}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Assigned To</p>
                          <p className="font-medium truncate">
                            {issue.assignedTo?.name +
                              " (" +
                              issue.assignedTo?.role +
                              ")"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t">
                    {issue.isAnonymous ? <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                        <User2 size={17} />
                          Anonymous report
                        </p> : <p className="text-sm text-gray-500 truncate">
                          Raised by: {issue.user.name}
                        </p>}
                        <div className="flex gap-2 w-full sm:w-auto">
                          <DownloadReportButton issueId={issue.id} />
                          <button onClick={() => navigate(`/issue/${issue.id}`)} className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium">
                            Details
                          </button>
                         
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </React.Fragment>
          ))
        ) : (
            <div className="min-w-[70vw] min-h-[60vh] flex flex-col items-center justify-center h-full">
              <Meh className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-600 font-medium">No issues found</p>
            </div>
            
        )}
      </div>

      {/* Load More / Loading Indicator */}
      <div ref={ref} className="col-span-2 text-center p-4">
        {isFetchingNextPage ? (
          <div className="text-gray-500">Loading more issues...</div>
        ) : hasNextPage ? (
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            Load More Issues
          </Button>
        ) : data?.pages[0]?.data.issues.length ? (
          <p className="text-gray-500">No more issues to load</p>
        ) : null}
      </div>
    </div>
  );
}

export default Forwarded;
