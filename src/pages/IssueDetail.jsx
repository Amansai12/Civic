import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ThumbsUp,
  MapPin,
  Calendar,
  Share2,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  MessageSquare,
  Clock,
  Building2,
  User2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Flag,
  FileText,
  Shield,
  Users,
  Calendar as CalendarIcon,
  Tag,
  Info,
  ChevronRight
} from "lucide-react";
import MapWithMarkers from "./Map";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFetchIssue } from "@/api/query";
import { cn } from "@/lib/utils";
import Progress from "@/components/Progress";
import Details from "@/components/Details";
import UpVoteButton from "@/components/UpVoteButton";
import Navbar from "@/components/Navbar";

const MapCard = ({ issue, isExpanded, onToggle }) => (
  <Card className={cn(
    "shadow-md transition-all duration-300 border-0 overflow-hidden",
    isExpanded ? "h-[70vh]" : "h-[400px]"
  )}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-blue-900 text-white">
      <CardTitle className="flex items-center gap-2 text-lg font-medium">
        <MapPin className="h-5 w-5" />
        Location Details
      </CardTitle>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 text-white hover:bg-blue-800"
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
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`, '_blank')}
          className="h-8 w-8 p-0 text-white hover:bg-blue-800"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-0 relative h-[calc(100%-57px)]">
      <div className="absolute inset-0">
        <MapWithMarkers
          markers={[{
            title: issue.title,
            latitude: issue.latitude,
            longitude: issue.longitude,
            description: issue.address,
            imageUrl: issue.image,
          }]}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t z-[999]">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-700 mt-1" />
          <div>
            <p className="font-medium text-gray-900">{issue.address}</p>
            <p className="text-sm text-gray-500">
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

  const type = localStorage.getItem('type');
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowDetails(scrollPosition < 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <Card className="w-96 shadow-md border-0">
          <CardHeader className="bg-red-700 text-white">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
            <h3 className="text-xl font-semibold">Error Loading Issue</h3>
            <p className="text-gray-600">We're unable to retrieve this information at this time.</p>
            <Button onClick={() => navigate(-1)} className="bg-blue-800 hover:bg-blue-900 w-full">Return to Previous Page</Button>
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
        label: "Under Review"
      },
      FORWARDED : {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        icon: Clock,
        label: "Forwarded"
      },
      IN_PROGRESS: { 
        color: "bg-blue-100 text-blue-800 border-blue-200", 
        icon: Loader2,
        label: "In Progress"
      },
      RESOLVED: { 
        color: "bg-green-100 text-green-800 border-green-200", 
        icon: CheckCircle2,
        label: "Resolved"
      },
      REJECTED: { 
        color: "bg-red-100 text-red-800 border-red-200", 
        icon: XCircle,
        label: "Not Approved"
      },
    };
    return configs[status] || configs.PENDING;
  };

  const statusConfig = getStatusConfig(issue.status);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <>
    {type === 'citizen' && <Navbar />}
    <div className="min-h-screen bg-gray-50">
      
      
      {/* Issue ID banner */}
      <div className="bg-blue-800 text-white py-2 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Issue ID: {issue.id}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Reported: {formatDate(issue.createdAt)}</span>
              </div>
              <Share2 className="h-4 w-4 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Breadcrumbs */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="container mx-auto py-4 px-6">
            
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{issue.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-blue-700" />
                    {issue.departmentName || "Unassigned Department"}
                  </span>
                  <span className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-blue-700" />
                    {issue.category || "General"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={cn("px-3 py-1.5 text-sm font-medium", statusConfig.color)}>
                  <statusConfig.icon className="h-4 w-4 mr-2" />
                  {statusConfig.label}
                </Badge>
                <UpVoteButton issueId={issue.id} upVotes={issue.upVotes} count={issue.upVotes.length} />
                <Button variant="outline" onClick={() => navigate(-1)} className="border-blue-800 text-blue-800 hover:bg-blue-50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-0">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="text-blue-800">Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="aspect-video rounded-md overflow-hidden border">
                  <img
                    src={issue.image || "/api/placeholder/1200/600"}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-700" />
                    Description
                  </h2>
                  <div className="bg-gray-50 border-l-4 border-blue-700 p-4 italic text-gray-700">
                    <p className="leading-relaxed">{issue.description}</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-amber-800">Important Notice</h3>
                      <p className="text-sm text-amber-700">
                        This issue is being addressed according to our service timeline guidelines. Please check the progress timeline below for the latest updates.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Timeline */}
            <Card className="shadow-sm border-0">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="text-blue-800 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Progress Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <Progress issue={issue} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Card */}
            <MapCard 
              issue={issue}
              isExpanded={isMapExpanded}
              onToggle={() => setIsMapExpanded(!isMapExpanded)}
            />

            {/* Issue Details Card */}
            {/* <Card className="shadow-sm border-0">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="text-blue-800 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                <div className="py-3 flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-700" />
                    Department
                  </span>
                  <span className="font-medium text-gray-900">{issue.departmentName || "Pending Assignment"}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <User2 className="h-4 w-4 mr-2 text-blue-700" />
                    Reported By
                  </span>
                  <span className="font-medium text-gray-900">{issue.author?.name || "Anonymous"}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-blue-700" />
                    Date Reported
                  </span>
                  <span className="font-medium text-gray-900">{formatDate(issue.createdAt)}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-blue-700" />
                    Community Support
                  </span>
                  <span className="font-medium text-gray-900">{issue.upVotes?.length || 0} endorsements</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-blue-700" />
                    Category
                  </span>
                  <span className="font-medium text-gray-900">{issue.category || "General"}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-blue-700" />
                    Updates
                  </span>
                  <span className="font-medium text-gray-900">{issue.updates?.length || 0}</span>
                </div>
              </CardContent>
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50">
                  <Flag className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </Card> */}

            <Details issue={issue} />

            
          </div>
        </div>
        
      </div>
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-sm">
                    <p>© 2025 Municipal Citizen Services Portal</p>
                </footer>
    </div>
    </>
  );
};

export default IssueDetail;