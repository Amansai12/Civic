import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Search, Loader2, Meh, Users, Forward, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFetchConflictIssues} from "@/api/query";
import Loader from "./Loader";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useToast } from "@/hooks/use-toast";

const ConflictIssues = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [citizenLoading, setCitizenLoading] = useState(false);
  const [authorityLoading, setAuthorityLoading] = useState(false);
  const observerTarget = useRef(null);

  const {
    data: issues,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    removeIssueFromCache
  } = useFetchConflictIssues(searchTerm)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const {toast} = useToast()
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
    
};

  const handleCitizenFault = async (issueId) => {
    try {
      setCitizenLoading(true);
      const res = await axios.get(`${BACKEND_URL}/issue/citizen-fault/${issueId}`,{
        withCredentials: true,
      });
      removeIssueFromCache(issueId);
      toast({
        title: "Success",
        description: "Citizen faulted successfully",
        className: "bg-green-700 text-white",
      });
    }catch(err){
      console.log(err)
    }finally{
      setCitizenLoading(false);
    }
  };  
  const handleAuthorityFault = async (issueId) => {
    try {
      setAuthorityLoading(true);
      const res = await axios.get(`${BACKEND_URL}/issue/citizen-fault/${issueId}`,{
        withCredentials: true,
      });
      removeIssueFromCache(issueId);
      toast({
        title: "Success",
        description: "Citizen faulted successfully",
        className: "bg-green-700 text-white",
      });
    }catch(err){
      console.log(err)
    }finally{
      setAuthorityLoading(false);
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

  return (
    <div className="min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                                        <p className="text-red-700 font-medium">
                                            Attention Required: These issues require immediate investigation
                                        </p>
                                    </div>
                                    <p className="text-red-600 mt-1 text-sm">
                                        The following issues were reported as incorrectly marked complete. Each case needs verification and appropriate action.
                                    </p>
                                </div>
      <div className="max-w-7xl mx-auto ">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search issues..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-9 w-full bg-gray-100"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
           
                <Loader />
              
          </div>
        ) : issues?.pages[0]?.data?.issues?.length > 0 ? (
          <div className="space-y-4">
            {issues.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.data.issues.filter((i) => i.dispute == true).map((issue) => (
                  <Card key={issue.id} className="w-full border-red-200">
                  <CardHeader className="border-b border-red-100">
                      <div className="flex justify-between items-start">
                          <div>
                              <CardTitle className="text-xl font-bold text-red-800">{issue.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-gray-500">
                                      Marked Complete: {formatDate(issue.resolvedDate)}
                                  </span>
                                  <span className="text-sm text-gray-500">•</span>
                                  <span className="text-sm text-red-600">
                                      Conflict Reported: {formatDate(issue.conflictResolvedDate)}
                                  </span>
                              </div>
                          </div>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                              {issue.status}
                          </span>
                      </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                              <p className="text-gray-700">{issue.description}</p>
                              
                              <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                          <span className="font-medium">Marked Complete By:</span> {issue.assignedTo.name}
                                      </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <Forward className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                          <span className="font-medium">Location:</span> {issue.address}
                                      </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <BarChart2 className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                          <span className="font-medium">Department:</span> {issue.departmentName}
                                      </span>
                                  </div>
                              </div>

                              <div className="mt-4">
                                  <h4 className="text-sm font-semibold mb-2">Conflict Message:</h4>
                                  <p className="text-gray-600 text-sm">{issue.disputeMessage}</p>
                              </div>

                              
                          </div>
                          
                          <div className="space-y-4">
                              <div className="relative h-48 rounded-lg overflow-hidden">
                                  <img 
                                      src={issue.image} 
                                      alt={issue.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                          e.target.src = "https://via.placeholder.com/400x300?text=No+Image+Available";
                                      }}
                                  />
                              </div>
                              <div className="flex justify-end space-x-2">
                                  <button 
                                    disabled={authorityLoading || citizenLoading}
                                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-2"
                                      onClick={() => {
                                          handleAuthorityFault(issue.id);
                                      }}
                                  >
                                      {authorityLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <p className="flex gap-2 items-center justify-center"><AlertTriangle className="h-4 w-4" />
                                        <span>Authority Fault</span></p>}
                                  </button>
                                  <button 
                                      disabled={citizenLoading || authorityLoading}
                                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
                                      onClick={() => {
                                          handleCitizenFault(issue.id);
                                      }}
                                  >
                                      
                                      <span>{citizenLoading ? <Loader2 className="animate-spin h-4 w-4" /> :<p className="flex gap-2 items-center justify-center"><Forward className="h-4 w-4" /> Citizen Fault</p>}</span>
                                  </button>
                              </div>
                          </div>
                      </div>
                  </CardContent>
              </Card>
                ))}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <Meh className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-600 font-medium">No issues found</p>
            </div>
        )}

        <div
          ref={observerTarget}
          className="h-16 flex items-center justify-center"
        >
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConflictIssues;