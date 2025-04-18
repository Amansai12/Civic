import React, { useEffect } from 'react';
import { Bell, CheckCircle2, XCircle, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConfirmResoultion } from '@/api/query';
import NotificationCard from './NotificationCard';

const NotificationsSection = ({notifications, removeFromCache}) => {
    
    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
        
    };

   


    return (
        <>
        <div className="max-w-3xl">
            {/* Header Section */}
            

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <NotificationCard notification={notification} key={notification.id} formatDate={formatDate} removeFromCache={removeFromCache} />
                ))}
            </div>

            {/* Empty State */}
            
        </div>
        {notifications.length === 0 && (
            <div className="text-center py-12 min-h-[70vh] flex flex-col justify-center items-center w-full">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                <p className="text-gray-500 mt-1">You're all caught up!</p>
            </div>
        )}
        </>
    );
};

export default NotificationsSection;