import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import '../types/bluetooth.d.ts';

interface HealthMetrics {
  heartRate: number;
  steps: number;
  calories: number;
  timestamp: Date;
}

interface SmartWatchContextType {
  isConnected: boolean;
  device: BluetoothDevice | null;
  healthMetrics: HealthMetrics | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  startHeartRateMonitoring: () => Promise<void>;
  stopHeartRateMonitoring: () => void;
}

const SmartWatchContext = createContext<SmartWatchContextType | undefined>(undefined);

export const SmartWatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [heartRateCharacteristic, setHeartRateCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const { toast } = useToast();

  // Check if Web Bluetooth is supported
  const isBluetoothSupported = () => {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  };

  const connect = useCallback(async () => {
    if (!isBluetoothSupported()) {
      toast({
        title: "Not Supported",
        description: "Web Bluetooth is not supported in this browser",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Request device with heart rate service
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: [0x180D] }, // Heart Rate service UUID
        ],
        optionalServices: ['battery_service', 'device_information']
      });

      selectedDevice.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setDevice(null);
        setHeartRateCharacteristic(null);
        toast({
          title: "Device Disconnected",
          description: "Smart watch has been disconnected",
        });
      });

      // Connect to GATT server
      const server = await selectedDevice.gatt?.connect();
      if (!server) throw new Error('Failed to connect to GATT server');

      setDevice(selectedDevice);
      setIsConnected(true);
      
      toast({
        title: "Connected!",
        description: `Connected to ${selectedDevice.name || 'Smart Watch'}`,
      });

    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to smart watch",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    }
    setIsConnected(false);
    setDevice(null);
    setHeartRateCharacteristic(null);
    setHealthMetrics(null);
  }, [device]);

  const startHeartRateMonitoring = useCallback(async () => {
    if (!device?.gatt?.connected) return;

    try {
      const server = device.gatt;
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      
      setHeartRateCharacteristic(characteristic);

      // Start notifications
      await characteristic.startNotifications();
      
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const target = event.target as unknown as BluetoothRemoteGATTCharacteristic;
        const value = target?.value;
        if (value) {
          const heartRate = value.getUint8(1);
          setHealthMetrics(prev => ({
            heartRate,
            steps: prev?.steps || 0,
            calories: prev?.calories || 0,
            timestamp: new Date()
          }));
        }
      });

      toast({
        title: "Monitoring Started",
        description: "Heart rate monitoring is now active",
      });

    } catch (error) {
      console.error('Failed to start heart rate monitoring:', error);
      toast({
        title: "Monitoring Failed",
        description: "Could not start heart rate monitoring",
        variant: "destructive"
      });
    }
  }, [device, toast]);

  const stopHeartRateMonitoring = useCallback(async () => {
    if (heartRateCharacteristic) {
      try {
        await heartRateCharacteristic.stopNotifications();
        setHeartRateCharacteristic(null);
        toast({
          title: "Monitoring Stopped",
          description: "Heart rate monitoring has been stopped",
        });
      } catch (error) {
        console.error('Failed to stop heart rate monitoring:', error);
      }
    }
  }, [heartRateCharacteristic, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopHeartRateMonitoring();
      disconnect();
    };
  }, [stopHeartRateMonitoring, disconnect]);

  const value = {
    isConnected,
    device,
    healthMetrics,
    isConnecting,
    connect,
    disconnect,
    startHeartRateMonitoring,
    stopHeartRateMonitoring
  };

  return (
    <SmartWatchContext.Provider value={value}>
      {children}
    </SmartWatchContext.Provider>
  );
};

export const useSmartWatch = () => {
  const context = useContext(SmartWatchContext);
  if (context === undefined) {
    throw new Error('useSmartWatch must be used within a SmartWatchProvider');
  }
  return context;
};