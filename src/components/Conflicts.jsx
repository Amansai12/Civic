import React, { useState } from "react";
import { 
    LayoutDashboard, 
    Users, 
    AlertTriangle, 
    CheckCircle, 
    BarChart2, 
    Forward, 
    Settings, 
    Menu, 
    X,
    Wrench, 
    Zap,
    MapPin, 
    Trash2,
    Droplet, 
    Leaf, 
    HardHat
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

function Conflicts() {
    
    const conflictIssues = [
        {
            id: 101,
            title: "Garbage Collection Not Completed",
            description: "Marked as completed on system but residents report garbage still not collected. Multiple complaints received about health hazards.",
            status: "Falsely Completed",
            location: "Green Valley Apartments, Block C",
            submittedBy: "Sarah Johnson",
            department: "Sanitation",
            markedCompletedBy: "John Smith",
            completedDate: "2024-12-30",
            reportedConflictDate: "2025-01-02",
            image: "https://media.istockphoto.com/id/1402864426/photo/overflowing-garbage-bins-and-trash-bags-on-the-street.jpg",
            relatedArticle: {
                title: "City Residents Complain About False Reporting",
                url: "https://www.theguardian.com/environment/2023/jun/15/waste-management-complaints-rise"
            },
            evidence: [
                "Multiple resident complaints",
                "Photographic evidence",
                "Local news coverage"
            ]
        },
        {
            id: 102,
            title: "Road Repair Quality Issues",
            description: "Road repair was marked complete but the quality of work is substandard. New potholes appearing within weeks of repair.",
            status: "Falsely Completed",
            location: "Main Street, Downtown",
            submittedBy: "Michael Chen",
            department: "Public Works",
            markedCompletedBy: "Robert Wilson",
            completedDate: "2024-12-25",
            reportedConflictDate: "2025-01-01",
            image: "https://media.istockphoto.com/id/1406795323/photo/asphalt-road-surface-of-the-damaged-highway.jpg",
            relatedArticle: {
                title: "Investigation Launched into Substandard Road Repairs",
                url: "https://www.bbc.com/news/uk-64773219"
            },
            evidence: [
                "Engineering inspection report",
                "Before/after photographs",
                "Contractor documentation discrepancies"
            ]
        }
    ];
  return (
    <>
    <div className="space-y-6">
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
                        
                        {conflictIssues.map((issue) => (
                            <Card key={issue.id} className="w-full border-red-200">
                                <CardHeader className="border-b border-red-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-red-800">{issue.title}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-gray-500">
                                                    Marked Complete: {"issue.completedDate"}
                                                </span>
                                                <span className="text-sm text-gray-500">•</span>
                                                <span className="text-sm text-red-600">
                                                    Conflict Reported: {"issue.reportedConflictDate"}
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
                                                        <span className="font-medium">Marked Complete By:</span> {"issue.markedCompletedBy"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Forward className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm">
                                                        <span className="font-medium">Location:</span> {"issue.location"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BarChart2 className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm">
                                                        <span className="font-medium">Department:</span> {"issue.department"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <h4 className="text-sm font-semibold mb-2">Evidence of False Completion:</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {/* {issue.evidence.map((item, index) => (
                                                        <li key={index} className="text-sm text-gray-600">{item}</li>
                                                    ))} */}
                                                </ul>
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
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-2"
                                                    onClick={() => {
                                                        // Handle reject logic
                                                        alert('Conflict report rejected');
                                                    }}
                                                >
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span>Citizen fault</span>
                                                </button>
                                                <button 
                                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
                                                    onClick={() => {
                                                        // Handle forward logic
                                                        alert('Case forwarded for investigation');
                                                    }}
                                                >
                                                    <Forward className="h-4 w-4" />
                                                    <span>Forward to Investigation</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    </>
  )
}

export default Conflicts