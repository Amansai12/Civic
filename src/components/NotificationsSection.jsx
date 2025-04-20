import React from 'react';
import { Bell } from "lucide-react";
import NotificationCard from './NotificationCard';

const NotificationsSection = ({ notifications, removeFromCache }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 min-h-[60vh]">
                <div className=" rounded-full p-4 mb-4">
                    <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800">No notifications</h3>
                <p className="text-gray-500 mt-2">You're all caught up!</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-6">
            <div className="space-y-3">
                {notifications.map((notification) => (
                    <NotificationCard 
                        notification={notification} 
                        key={notification.id} 
                        formatDate={formatDate} 
                        removeFromCache={removeFromCache} 
                    />
                ))}
            </div>
        </div>
    );
};

export default NotificationsSection;