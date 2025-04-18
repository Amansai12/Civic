import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  MapPin,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Meh,
  SearchIcon,
  ChevronDown,
  Shield
} from 'lucide-react';
import IssueCard from '@/components/IssueCard';
import MapWithMarkers from './Map';
import { useNavigate } from 'react-router-dom';
import { dummyIssues } from '@/lib/dummy';
import { useFetchNearByIssues } from '@/api/query';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';
import { useQueryClient } from '@tanstack/react-query';

const Issue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearch, setActualSearch] = useState('');
  const [view, setView] = useState('list');
  const [totalIssues, setTotalIssues] = useState(0);
  
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  
  const {data, status, isFetchingNextPage, isError, hasNextPage, fetchNextPage, isLoading, updateUpVote} = 
    useFetchNearByIssues(userData?.latitude, userData?.longitude, actualSearch);
 
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setActualSearch(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchButtonClick();
    }
  };

  const stats = [
    {
      label: 'Total Issues',
      value: totalIssues || 0,
      icon: MapPin,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
    },
    {
      label: 'In Progress',
      value: Math.floor((totalIssues || 0) * 0.4),
      icon: Clock,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
    },
    {
      label: 'Resolved',
      value: Math.floor((totalIssues || 0) * 0.3),
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
    },
    {
      label: 'Critical',
      value: Math.floor((totalIssues || 0) * 0.15),
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
    },
  ];

  let markers;
  if(isError) return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
      <div className="text-center p-8 bg-white shadow-md rounded-md">
        <AlertCircle className="h-12 w-12 text-red-700 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Issues</h2>
        <p className="text-gray-600 mb-4">We couldn't retrieve the community issues at this time.</p>
        <Button className="bg-blue-800 hover:bg-blue-900">Retry</Button>
      </div>
    </div>
  );
  
  if(!isFetchingNextPage && !isLoading && !isError){
    markers = data.pages?.map((page) => (
      [...page.data.issues]
    ));
  }
 
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[1400px] mx-auto p-4 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white border-l-4 border-blue-800 shadow-sm p-4 mb-6">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-800 mr-3" />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Community Issues Registry
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Track and manage community issues reported in your local area
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                        <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div> */}

            {/* Search and Filter Section */}
            <Card className="border-0 shadow-sm mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      className="pl-10 border-gray-300 focus:ring-blue-800 focus:border-blue-800"
                      placeholder="Search by issue title, location, or keywords..."
                      value={searchTerm}
                      onChange={handleSearch}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-gray-700 hover:bg-gray-800 text-white" 
                      onClick={handleSearchButtonClick}
                    >
                      <SearchIcon className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button 
                      onClick={() => navigate('/send-issue')} 
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                      Report New Issue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          {isLoading ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <Loader />
            </div>
          ) : data.pages[0].data.issues.length === 0 ? (
            <Card className="border-0 shadow-sm min-h-[60vh] flex justify-center items-center">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Meh size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg font-medium">No issues found</p>
                <p className="text-gray-500 mt-2">Try modifying your search or view all issues</p>
                <Button 
                  className="mt-4 bg-blue-800 hover:bg-blue-900 text-white"
                  onClick={() => setActualSearch('')}
                >
                  View All Issues
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50 border-b pb-3">
                <CardTitle className="text-gray-800">Issue Tracking Registry</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="list" className="w-full">
                  <div className="border-b bg-gray-50">
                    <TabsList className="bg-transparent p-0 h-auto">
                      <TabsTrigger 
                        value="list" 
                        onClick={() => setView('list')}
                        className="data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-800 rounded-none px-6 py-3"
                      >
                        List View
                      </TabsTrigger>
                      <TabsTrigger 
                        value="map" 
                        onClick={() => setView('map')}
                        className="data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-800 rounded-none px-6 py-3"
                      >
                        Map View
                      </TabsTrigger>
                      <TabsTrigger 
                        value="split" 
                        onClick={() => setView('split')}
                        className="data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-800 rounded-none px-6 py-3"
                      >
                        Split View
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="list" className="p-4 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.pages.map((page) => (
                        page.data.issues.map((issue) => (
                          <IssueCard key={issue.id} issue={issue} searchTerm={searchTerm} />
                        ))
                      ))}
                    </div>
                    {hasNextPage && (
                      <div className="flex justify-center mt-8">
                        <Button
                          onClick={fetchNextPage}
                          disabled={isFetchingNextPage}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          {isFetchingNextPage ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Loading more...
                            </>
                          ) : (
                            <>
                              Load More
                              <ChevronDown className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="map" className="mt-0">
                    <div className="h-[600px]">
                      <MapWithMarkers
                        markers={
                          markers?.flat().map((issue) => ({
                            latitude: issue.latitude,
                            longitude: issue.longitude,
                            title: issue.title,
                            description: issue.description,
                            imageUrl: issue.image,
                          }))
                        }
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="split" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="border-r border-gray-200 p-4 max-h-[600px] overflow-y-auto">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Issue List</h3>
                        <div className="space-y-4">
                          {data.pages.map((page) => (
                            page.data.issues.map((issue) => (
                              <IssueCard key={issue.id} issue={issue} />
                            ))
                          ))}
                        </div>
                        {hasNextPage && (
                          <div className="flex justify-center mt-8">
                            <Button
                              onClick={fetchNextPage}
                              disabled={isFetchingNextPage}
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              {isFetchingNextPage ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Loading more...
                                </>
                              ) : (
                                <>
                                  Load More
                                  <ChevronDown className="h-4 w-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="h-[600px]">
                        <MapWithMarkers
                          markers={
                            markers?.flat().map((issue) => ({
                              latitude: issue.latitude,
                              longitude: issue.longitude,
                              title: issue.title,
                              description: issue.description,
                              imageUrl: issue.image,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-sm mt-8">
          <p>© 2025 Municipal Issue Reporting System • All Rights Reserved</p>
        </footer>
      </div>
    </>
  );
};

export default Issue;