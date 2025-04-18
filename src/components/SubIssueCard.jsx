import React, { useEffect, useState } from "react";
import {
  Forward,
  Clock,
  MapPin,
  Building2,
  ChevronDown,
  Eye,
  Loader2,
  PenSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateIssue } from "@/api/query";
import { useToast } from "@/hooks/use-toast";
import DownloadReportButton from "./DownloadReport";
import { useNavigate } from "react-router-dom";
import AudioPlayerButton from "./AudioControlButton";

function SubIssueCard({ issue ,updateIssueInCache}) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState(issue.description);
  const [updatedStatus, setUpdatedStatus] = useState(issue.status);
  console.log(issue);

  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutate, isPending, isError, isSuccess,  } = useUpdateIssue();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Issue updated successfully",
        description: "Your issue has been updated successfully",
        variant: "success",
      });
      setIsUpdateOpen(false);
      updateIssueInCache(issue.id,updatedStatus);
      
    }
  }, [isSuccess]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleUpdate = () => {
    mutate({
      issueId: issue.id,
      description: updatedDescription,
      status: updatedStatus,
    });
  };

  if (isError) return <div>Error updating data</div>;
  
  return (
    <>
      <Card className="w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                {issue.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <p className="text-sm">
                  Submitted by <span className="font-medium">Amansai</span> on{" "}
                  <span className="font-medium">
                    {formatDate(issue.createdAt)}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:ml-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                  issue.status === "PENDING"
                    ? "bg-amber-100 text-amber-800"
                    : issue.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {issue.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {issue.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700">
                      Department:{" "}
                      <span className="font-semibold">
                        {issue.departmentName || "Not Assigned"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700">
                      Location:{" "}
                      <span className="font-semibold">{issue.address}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden shadow-sm">
              <img
                src={issue.image || ""}
                alt={issue.title || "No Image Available"}
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
              onClick={() => navigate(`/issue/${issue.id}`)}
            >
              <Eye className="h-4 w-4" />
              Details
            </Button>
            {issue.audio && <AudioPlayerButton audioURL={issue.audio} />}
            <DownloadReportButton issueId={issue.id} />

            <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" onClick={() => setIsUpdateOpen(true)}>
                  <PenSquare className="h-4 w-4" />
                  Add Progress
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Update Progress</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={updatedStatus}
                      onValueChange={setUpdatedStatus}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={updatedDescription}
                      onChange={(e) => setUpdatedDescription(e.target.value)}
                      placeholder="Enter updated description..."
                      className="min-h-32"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate}>
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Add Progress"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default SubIssueCard;