// src/components/TrackOrder.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const TrackingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const TrackingInfo = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
`;

const TrackingEvent = styled.div`
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;
`;

interface TrackingEventType {
  date: string;
  status: string;
  location: string;
}

interface TrackingInfoType {
  status: string;
  estimated_delivery_date: string;
  tracking_events: TrackingEventType[];
}

const TrackOrder: React.FC = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shipping/tracking/${trackingNumber}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTrackingInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tracking info:', error);
        setError('Failed to load tracking information. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [trackingNumber]);

  if (loading) return <p>Loading tracking information...</p>;
  if (error) return <p>{error}</p>;
  if (!trackingInfo) return <p>No tracking information available.</p>;

  return (
    <TrackingContainer>
      <h1>Tracking Information</h1>
      <TrackingInfo>
        <p>Tracking Number: {trackingNumber}</p>
        <p>Status: {trackingInfo.status}</p>
        <p>Estimated Delivery: {new Date(trackingInfo.estimated_delivery_date).toLocaleDateString()}</p>
        <h2>Tracking Events:</h2>
        {trackingInfo.tracking_events.map((event, index) => (
          <TrackingEvent key={index}>
            <p>Date: {new Date(event.date).toLocaleString()}</p>
            <p>Status: {event.status}</p>
            <p>Location: {event.location}</p>
          </TrackingEvent>
        ))}
      </TrackingInfo>
      <BackButton to="/my-orders">Back to My Orders</BackButton>
    </TrackingContainer>
  );
};

export default TrackOrder;