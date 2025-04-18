import React, { useEffect, useState } from "react";
import {
  Forward,
  Clock,
  MapPin,
  Building2,
  ChevronDown,
  Eye,
  Loader2,
  ArrowBigUp,
  Mic,
  Shield,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useForwardIssue } from "@/api/query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import AudioPlayerButton from "./AudioControlButton";

import { departments, departmentAuthorities } from "@/lib/department";
import DownloadReportButton from "./DownloadReport";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: "bg-amber-50 text-amber-800 border border-amber-300 ring-1 ring-inset ring-amber-600/20",
    "In Progress": "bg-blue-50 text-blue-800 border border-blue-300 ring-1 ring-inset ring-blue-600/20",
    Completed: "bg-emerald-50 text-emerald-800 border border-emerald-300 ring-1 ring-inset ring-emerald-600/20",
  };

  const statusIcons = {
    Pending: <Clock className="h-3 w-3 mr-1" />,
    "In Progress": <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
    Completed: <Shield className="h-3 w-3 mr-1" />,
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusStyles[status]}`}>
      {statusIcons[status]}
      {status}
    </span>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200">
      <Icon className="h-4 w-4 text-slate-700" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  </div>
);

function AuthIssueCard({ issue, removeIssueFromCache }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, reset, isError } = useForwardIssue();
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess) {
      removeIssueFromCache(issue.id);
      setSelectedDepartment(null);
      setSelectedRole(null);
      reset();
      toast({
        title: "Success!",
        description: "Issue forwarded to the selected department.",
        className: "bg-green-700 text-white border-l-4 border-green-900",
      });
    }

    if (isError) {
      setIsConfirmOpen(false);
      toast({
        title: "Error",
        description: "Failed to forward issue. Please try again.",
        className: "bg-red-700 text-white border-l-4 border-red-900",
      });
    }
  }, [isSuccess, isError, issue.id, removeIssueFromCache, reset, toast]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const generateIssueId = (id) => {
    return `GOV-${id.toString().padStart(6, '0')}`;
  };

  return (
    <>
      <Card className="w-full bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden border border-slate-200">
        <CardHeader className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-1">
              <div className="mb-1 text-xs font-medium text-slate-500">
                ISSUE ID: {generateIssueId(issue.id)}
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2 leading-tight">
                {issue.title}
              </h2>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4" />
                <p className="text-sm">
                  Submitted by{" "}
                  <span className="font-medium text-slate-800">Amansai</span>
                  {" • "}
                  <span className="font-medium">{formatDate(issue.createdAt)}</span>
                </p>
              </div>
            </div>
            <StatusBadge status={issue.status} />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 order-2 md:order-1">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <h3 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Description
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4 text-base">
                  {issue.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoItem
                  icon={Building2}
                  label="Department"
                  value={issue.departmentName || "Awaiting Assignment"}
                />
                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={issue.address}
                />
                <InfoItem
                  icon={ArrowBigUp}
                  label="Citizen Votes"
                  value={issue.upVotes.length}
                />
                <InfoItem
                  icon={Mic}
                  label="Voice Recording"
                  value={issue.audio ? "Available" : "Not Available"}
                />
              </div>
            </div>

            <div className="relative h-72 rounded-lg overflow-hidden shadow-md group order-1 md:order-2 border border-slate-200">
              <img
                src={issue.image || "https://via.placeholder.com/400x300?text=No+Image"}
                alt={issue.title || "Issue Image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <div className="px-2 py-1 bg-white/90 text-slate-800 text-xs rounded inline-flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {issue.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end items-center gap-3 mt-6 pt-4 border-t border-slate-100">
            <DownloadReportButton issueId={issue.id} />
            
            <Button
              variant="outline"
              className="gap-2 hover:bg-slate-50 border-slate-300 text-slate-700"
              onClick={() => navigate(`/issue/${issue.id}`)}
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>

            {issue.audio && <AudioPlayerButton audioURL={issue.audio} />}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Forward className="h-4 w-4" />
                  Forward Issue
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border border-slate-200 shadow-lg rounded-lg p-1">
                {Object.entries(departments).map(([deptName, deptKey]) => (
                  <DropdownMenuSub key={deptKey}>
                    <DropdownMenuSubTrigger className="gap-2 rounded hover:bg-slate-100 transition-colors">
                      <Building2 className="h-4 w-4 text-slate-600" />
                      <span>{deptName}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-white border border-slate-200 shadow-lg rounded-lg p-1">
                        {departmentAuthorities[deptKey].map((role) => (
                          <DropdownMenuItem
                            key={role.value}
                            className="gap-2 cursor-pointer hover:bg-slate-100 rounded transition-colors"
                            onClick={() => {
                              setSelectedDepartment({ name: deptName, key: deptKey });
                              setSelectedRole(role);
                              setIsConfirmOpen(true);
                            }}
                          >
                            {role.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="max-w-md bg-white rounded-lg shadow-lg border border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-800">
              Confirm Issue Transfer
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              You are about to transfer issue <span className="font-medium text-slate-800">{generateIssueId(issue.id)}</span> to the{" "}
              <span className="font-medium text-slate-800">
                {selectedRole?.label}
              </span>{" "}
              in the{" "}
              <span className="font-medium text-slate-800">
                {selectedDepartment?.name}
              </span>{" "}
              department. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="mt-0 border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                mutate({
                  issueId: issue.id,
                  department: selectedDepartment?.key,
                  role: selectedRole?.value,
                });
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Transfer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default AuthIssueCard;