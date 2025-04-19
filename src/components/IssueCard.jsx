import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ThumbsUp, 
  MapPin, 
  Calendar, 
  AlertCircle,
  Share2,
  MessageSquare
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import UpVoteButton from './UpVoteButton';

const IssueCard = ({issue,searchTerm}) => {
  const {id,title,description,createdAt,upVotes,address = "123 Main st",status,image,priority} = issue
  const [votes, setVotes] = useState(upVotes);
  const [isVoted, setIsVoted] = useState(false);
  const navigate = useNavigate();

  //const priority = upVotes?.length > 10 ? 'high' : upVotes?.length > 5 ? 'medium' : 'low';
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'severe':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'normal':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status || "Pending") {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in progress':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const handleUpvote = () => {
    if (!isVoted) {
      setVotes(prev => prev + 1);
      setIsVoted(true);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <TooltipProvider>
      <Card className="flex flex-col justify-between transition-all duration-300 hover:shadow-lg overflow-hidden w-full md:w-4/12">
        <div className="relative">
          {/* Image Container with Fixed Height */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={image} //Put image
              alt={title}
              className="w-full h-full object-cover"
            />
            
          </div>

          {/* Badges positioned over image */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${getPriorityColor(priority)} border`}>
              {priority}
            </Badge>
            <Badge className={`${getStatusColor(status)} border`}>
              {status}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Title and Description */}
            <div>
              <h2 className="text-lg font-semibold line-clamp-1 mb-2 flex items-center gap-2">
                <AlertCircle size={18} className="text-blue-600 flex-shrink-0" />
                {title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
            </div>

            {/* Metadata */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar size={14} className="mr-2 flex-shrink-0" />
                <span>{formatDate(createdAt)}</span>
              </div>
              <div className="flex items-start text-gray-500 text-sm">
                <MapPin size={14} className="mr-2 mt-1 flex-shrink-0" />
                <span className="line-clamp-1">{address}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex items-center gap-3">
           <UpVoteButton issueId={id} count={upVotes.length} upVotes={upVotes}/>

            
          </div>
          
          <Button 
            variant="default"
            size="sm"
            className="h-8"
            onClick={() => navigate(`/issue/${id}`,{state : {searchTerm}})}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default IssueCard;