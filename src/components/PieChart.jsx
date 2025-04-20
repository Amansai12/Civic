import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';


// Helper function to calculate intensity based on multiple factors
const calculateIntensity = (issue) => {
  let intensity = 0;
  
  // 1. Base intensity from upvotes
  intensity += issue.upVotes?.length || 0;
  
  // 2. Status-based weightage
  const statusWeights = {
    PENDING: 1,
    IN_PROGRESS: 2,
    FORWARDED: 1.5,
    UNDER_REVIEW: 1.5,
    RESOLVED: 0.5,
    DISPUTED: 3
  };
  intensity += statusWeights[issue.status] || 1;

  // 3. Time-based factor (newer issues get higher intensity)
  const ageInDays = (new Date() - new Date(issue.createdAt)) / (1000 * 60 * 60 * 24);
  const timeFactor = Math.max(0, 1 - (ageInDays / 30)); // Decreases over 30 days
  intensity += timeFactor * 2;

  return intensity;
};

// Function to group nearby issues
const groupNearbyIssues = (issues, radiusKm = 0.5) => {
  const groups = {};
  
  issues.forEach(issue => {
    const key = `${Math.round(issue.latitude / radiusKm)},${Math.round(issue.longitude / radiusKm)}`;
    if (!groups[key]) {
      groups[key] = {
        latitude: parseFloat(issue.latitude),
        longitude: parseFloat(issue.longitude),
        issues: []
      };
    }
    groups[key].issues.push(issue);
  });

  return Object.values(groups).map(group => ({
    lat: group.latitude,
    lng: group.longitude,
    intensity: group.issues.reduce((sum, issue) => sum + calculateIntensity(issue), 0),
    issues: group.issues
  }));
};

const HeatmapLayer = ({ issues }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !issues.length) return;


    // Group nearby issues and calculate intensities
    const heatPoints = groupNearbyIssues(issues);

    // Convert to format expected by Leaflet.heat
    const heatData = heatPoints.map(point => [
      point.lat,
      point.lng,
      point.intensity
    ]);

    // Create and add heatmap layer
    const heatLayer = L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 12,
      gradient: {
        0.4: 'blue',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, issues]);

  return null;
};

const IssueHeatmap = ({ issues }) => {
 

  // Calculate center based on average of all issue coordinates
  const center = issues.length ? [
    issues.reduce((sum, issue) => sum + parseFloat(issue.latitude), 0) / issues.length,
    issues.reduce((sum, issue) => sum + parseFloat(issue.longitude), 0) / issues.length
  ] : [0, 0];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Issue Distribution Heatmap</CardTitle>
          
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full rounded-lg overflow-hidden">
          <MapContainer
            center={center}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HeatmapLayer 
              issues={issues} 
            />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueHeatmap;