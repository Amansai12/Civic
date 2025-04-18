import React, { useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConfirmResoultion, useRejectResoultion } from "@/api/query";

function NotificationCard({ notification, formatDate, removeFromCache }) {
  const {
    mutate: confirm,
    isPending: confirmPending,
    isSuccess: confirmSuccess,
    isError: confirmError,
    data: confirmData,
  } = useConfirmResoultion();
  const {
    mutate: reject,
    isPending: rejectPending,
    isSuccess: rejectSuccess,
    isError: rejectError,
    data: rejectData,
  } = useRejectResoultion();

  useEffect(() => {
    if (confirmSuccess || rejectSuccess) {
      removeFromCache(notification.id);
    }
  }, [confirmSuccess, rejectSuccess]);

  const handleConfirm = () => {
    confirm({
      issueId: notification.issueId,
      id: notification.id,
    });
  };
  const handleReject = () => {
    reject({
      issueId: notification.issueId,
      id: notification.id,
    });
  };
  return (
    <Card
      key={notification.id}
      className={`
                            transform transition-all duration-200 hover:shadow-md
                            ${
                              notification.isRead
                                ? "bg-gray-50"
                                : "bg-white border-l-4 border-l-blue-600"
                            }
                        `}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className="mt-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={`
                                                    p-2 rounded-full 
                                                bg-blue-50
                                                `}
                  >
                    <Bell className={`h-5 w-5 text-blue`} />
                  </div>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900">
                {notification.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(notification.createdAt)}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {notification.description}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 bg-gray-50 flex justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
                disabled={rejectPending}
                onClick={handleReject}
              >
                {rejectPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4" /> Reject
                  </>
                )}
              </Button>
            </TooltipTrigger>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleConfirm}
                disabled={confirmPending}
              >
                {confirmPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Confirm
                  </>
                )}
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

export default NotificationCard;
