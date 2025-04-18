import { useFetchAuthorities } from '@/api/query';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Mail, UserRound} from 'lucide-react';
import Loader from './Loader';

function Authorities() {
  const { data, isLoading, isError } = useFetchAuthorities();

  if (isError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md border-2 border-red-700">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>System Error</AlertTitle>
          <AlertDescription>
            Unable to load authority records. Please contact the system administrator or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Function to get role badge color
  const getRoleBadgeVariant = (role) => {
    const roleMap = {
      admin: "destructive",
      director: "destructive",
      secretary: "default",
      officer: "secondary",
      agent: "outline",
      representative: "outline"
    };
    return roleMap[role.toLowerCase()] || "default";
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex flex-col space-y-6">
        

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[40vh] bg-slate-50 border border-slate-200">
            <div className="text-center">
              <Loader />
              <p className="mt-4 text-sm text-slate-600">Retrieving official records...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.map((authority) => (
              <Card key={authority.id} className="overflow-hidden border-2 border-slate-300 shadow-sm">
                <CardHeader className="bg-slate-100 pb-2 border-b border-slate-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-14 w-14 border-2 border-slate-400">
                        <AvatarImage src={authority.profileImage} alt={authority.name} />
                        <AvatarFallback className="bg-blue-900 text-white font-semibold">{getInitials(authority.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="font-bold">{authority.name.toUpperCase()}</CardTitle>
                        <div className="flex items-center mt-1 text-xs text-slate-700">
                          <Mail className="h-3 w-3 mr-1" />
                          {authority.email}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={getRoleBadgeVariant(authority.role)}
                      className="uppercase text-xs px-3"
                    >
                      {authority.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-xs bg-slate-50 p-2 border border-slate-200">
                      <UserRound className="h-4 w-4 mr-2 text-slate-600" />
                      <span className="font-mono">
                        ID: {authority.id.toString().padStart(6, '0')}
                      </span>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        
      </div>
    </div>
  );
}

export default Authorities;