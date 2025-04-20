import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  MapPin,
  Calendar,
  Share2,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Maximize2,
  FileText,
  Calendar as CalendarIcon,
  Info,
} from "lucide-react";
import MapWithMarkers from "./Map";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useFetchIssue } from "@/api/query";
import { cn } from "@/lib/utils";
import Progress from "@/components/Progress";
import Details from "@/components/Details";
import UpVoteButton from "@/components/UpVoteButton";
import Navbar from "@/components/Navbar";

const MapCard = ({ issue, isExpanded, onToggle }) => (
  <Card
    className={cn(
      "shadow-md transition-all duration-300 border-0 overflow-hidden",
      isExpanded ? "h-[70vh]" : "h-[300px] md:h-[400px]"
    )}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 bg-blue-900 text-white">
      <CardTitle className="flex items-center gap-1 md:gap-2 text-base md:text-lg font-medium">
        <MapPin className="h-4 w-4 md:h-5 md:w-5" />
        Location Details
      </CardTitle>
      <div className="flex gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-7 w-7 md:h-8 md:w-8 p-0 text-white hover:bg-blue-800"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`,
              "_blank"
            )
          }
          className="h-7 w-7 md:h-8 md:w-8 p-0 text-white hover:bg-blue-800"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-0 relative h-[calc(100%-49px)] md:h-[calc(100%-57px)]">
      <div className="absolute inset-0">
        <MapWithMarkers
          markers={[
            {
              title: issue.title,
              latitude: issue.latitude,
              longitude: issue.longitude,
              description: issue.address,
              imageUrl: issue.image,
            },
          ]}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-md p-3 md:p-4 border-t z-[999]">
        <div className="flex items-start gap-2 md:gap-3">
          <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-700 mt-1 flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="font-medium text-gray-900 text-sm md:text-base">
              {issue.address}
            </p>
            <p className="text-xs md:text-sm text-gray-500 truncate">
              {issue.latitude}, {issue.longitude}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVoted, setIsVoted] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const { data: issue, isLoading, isError } = useFetchIssue(id);

  const type = localStorage.getItem("type");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowDetails(scrollPosition < 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-11/12 max-w-sm md:max-w-md shadow-md border-0">
          <CardHeader className="bg-red-700 text-white">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
            <h3 className="text-xl font-semibold">Error Loading Issue</h3>
            <p className="text-gray-600">
              We're unable to retrieve this information at this time.
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="bg-blue-800 hover:bg-blue-900 w-full"
            >
              Return to Previous Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
        label: "Under Review",
      },
      FORWARDED: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        label: "Forwarded",
      },
      IN_PROGRESS: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Loader2,
        label: "In Progress",
      },
      RESOLVED: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle2,
        label: "Resolved",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Not Approved",
      },
    };
    return configs[status] || configs.PENDING;
  };
  const getPriorityConfig = (priority) => {
    const configs = {
      URGENT: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Loader2,
        label: "Urgent",
      },
      NORMAL: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle2,
        label: "Normal",
      },
      SEVERE: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Severe",
      },
    };

    return configs[priority] || configs.NORMAL;
  };
  const statusConfig = getStatusConfig(issue.status);
  const priorityConfig = getPriorityConfig(issue.priority);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <>
      {type === "citizen" && <Navbar />}
      <div className="min-h-screen bg-gray-50">
        {/* Issue ID banner */}
        <div className="bg-blue-800 text-white py-2 px-3 md:px-4">
          <div className="w-full px-1 mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 md:gap-2">
                <FileText className="h-3 w-3 md:h-4 md:w-4 hidden md:block" />
                <span className="text-xs md:text-sm">Issue ID: {issue.id}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-1 text-right md:text-left">
                  <CalendarIcon className="h-3 w-3 md:h-4 md:w-4 hidden md:block" />
                  <span className="hidden sm:inline">Reported:</span>{" "}
                  {formatDate(issue.createdAt)}
                </div>
                <Share2 className="h-3 w-3 md:h-4 md:w-4 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-2 md:max-w-7xl mx-auto md:p-6 space-y-4 md:space-y-6">
          {/* Header with Breadcrumbs */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <Card className="shadow-sm border border-gray-300 overflow-hidden">
                <CardHeader className="bg-blue-50 border-b border-blue-100 p-3 md:p-6">
                  <CardTitle className="text-blue-800 text-xl md:text-2xl">
                    {issue.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-6 space-y-4 md:space-y-6">
                  <div className="aspect-video rounded-md overflow-hidden border">
                    <img
                      src={issue.image || "/api/placeholder/1200/600"}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="prose max-w-none">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                      <Info className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-blue-700" />
                      Description
                    </h2>
                    <div className="bg-gray-50 border-l-4 border-blue-700 p-3 md:p-4 italic text-gray-700">
                      <p className="leading-relaxed text-sm md:text-base">
                        {issue.description}
                      </p>
                    </div>
                  </div>

                  
                  <div className="bg-white px-3">
                    <div className="max-w-3xl mx-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-between">
                        {/* Department & Priority - Left side */}
                        <div className="flex items-center flex-wrap gap-2 mb-3 sm:mb-0">
                          <span className="flex items-center text-sm text-gray-700">
                            <Building2 className="h-4 w-4 mr-1.5 text-blue-600" />
                            {issue.departmentName || "Unassigned"}
                          </span>

                          <span
                            className={cn(
                              `flex items-center px-2 py-0.5 rounded-md text-sm`,
                              priorityConfig.color
                            )}
                          >
                            <priorityConfig.icon className="h-4 w-4 mr-1" />
                            {priorityConfig.label}
                          </span>
                        </div>

                        {/* Status & UpVote - Right side */}
                        <div className="flex items-center justify-start gap-1 flex-wrap">
                          <Badge
                            className={cn(
                              "px-2 py-1 text-sm",
                              statusConfig.color
                            )}
                          >
                            <statusConfig.icon className="h-4 w-4 mr-1" />
                            {statusConfig.label}
                          </Badge>

                          <UpVoteButton
                            issueId={issue.id}
                            upVotes={issue.upVotes}
                            count={issue.upVotes.length}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 md:p-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-amber-800 text-sm md:text-base">
                          Important Notice
                        </h3>
                        <p className="text-xs md:text-sm text-amber-700">
                          This issue is being addressed according to our service
                          timeline guidelines. Please check the progress
                          timeline below for the latest updates.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Timeline */}
              <Progress issue={issue} />
            </div>

            {/* Sidebar */}
            <div className="space-y-4 md:space-y-6">
              {/* Map Card */}
              <MapCard
                issue={issue}
                isExpanded={isMapExpanded}
                onToggle={() => setIsMapExpanded(!isMapExpanded)}
              />

              {/* Issue Details Card */}
              <Details issue={issue} />
            </div>
          </div>
        </div>
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-xs md:text-sm mt-6">
          <p>© 2025 Municipal Citizen Services Portal</p>
        </footer>
      </div>
    </>
  );
};

export default IssueDetail;
