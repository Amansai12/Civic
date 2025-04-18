import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Search, Loader2, Meh } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFetchIssuesByAuthority } from "@/api/query";
import SubIssueCard from "./SubIssueCard";
import Loader from "./Loader";

const SubordinateIssues = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const observerTarget = useRef(null);

  const {
    data: issues,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    updateIssueInCache
  } = useFetchIssuesByAuthority(searchTerm);

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

  console.log(issues);

  return (
    <div className="min-h-screen">
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
                {page.data.issues.map((issue) => (
                  <SubIssueCard
                    issue={issue}
                    key={issue.id}
                    updateIssueInCache={updateIssueInCache}
                    className="transition-all duration-200 hover:shadow-lg"
                  />
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

export default SubordinateIssues;