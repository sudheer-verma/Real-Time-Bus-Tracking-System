import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';

export const useBusTracking = (busId) => {
  const { token } = useAuth();
  const [connected, setConnected] = useState(false);
  const [busInfo, setBusInfo] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !busId) return undefined;

    socket.auth = { token };
    socket.connect();

    const handleConnect = () => {
      setConnected(true);
      setError('');
      socket.emit('join-bus-room', busId);
    };

    const handleDisconnect = () => setConnected(false);
    const handleBusRoomJoined = (payload) => {
      setBusInfo(payload);
      setStatus(payload.status || '');
      setLiveLocation(payload.currentLocation || null);
    };
    const handleLocationUpdate = (payload) => {
      if (payload.busId !== busId) return;
      setLiveLocation({ latitude: payload.latitude, longitude: payload.longitude, updatedAt: payload.updatedAt });
    };
    const handleStatusUpdate = (payload) => {
      if (payload.busId !== busId) return;
      setStatus(payload.status || '');
      setBusInfo((prev) => ({ ...prev, status: payload.status }));
    };
    const handleSocketError = (payload) => setError(payload?.message || 'Socket error');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('bus-room-joined', handleBusRoomJoined);
    socket.on('bus-location-updated', handleLocationUpdate);
    socket.on('bus-status-updated', handleStatusUpdate);
    socket.on('socket-error', handleSocketError);

    return () => {
      socket.emit('leave-bus-room', busId);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('bus-room-joined', handleBusRoomJoined);
      socket.off('bus-location-updated', handleLocationUpdate);
      socket.off('bus-status-updated', handleStatusUpdate);
      socket.off('socket-error', handleSocketError);
      socket.disconnect();
    };
  }, [token, busId]);

  return { connected, busInfo, liveLocation, status, error };
};

export default useBusTracking;
