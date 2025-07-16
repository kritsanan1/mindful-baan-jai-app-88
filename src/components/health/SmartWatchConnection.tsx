import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, BluetoothConnected, Activity, Heart } from 'lucide-react';
import { useSmartWatch } from '@/contexts/SmartWatchContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const SmartWatchConnection = () => {
  const { 
    isConnected, 
    device, 
    isConnecting, 
    connect, 
    disconnect, 
    startHeartRateMonitoring,
    stopHeartRateMonitoring,
    healthMetrics
  } = useSmartWatch();
  const { t } = useLanguage();

  const isMonitoring = healthMetrics !== null;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-card-foreground">
          {isConnected ? (
            <BluetoothConnected className="h-5 w-5 text-blue-500" />
          ) : (
            <Bluetooth className="h-5 w-5 text-muted-foreground" />
          )}
          <span>Smart Watch</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {device && (
          <div className="text-sm text-muted-foreground">
            Device: {device.name || 'Unknown Device'}
          </div>
        )}

        <div className="flex flex-col space-y-2">
          {!isConnected ? (
            <Button 
              onClick={connect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect Smart Watch'}
            </Button>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={disconnect} 
                  variant="outline"
                  className="w-full"
                >
                  Disconnect
                </Button>
                <Button 
                  onClick={isMonitoring ? stopHeartRateMonitoring : startHeartRateMonitoring}
                  variant={isMonitoring ? "destructive" : "default"}
                  className="w-full"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {isMonitoring ? 'Stop' : 'Start'} Monitoring
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Heart rate monitoring</div>
          <div>• Activity tracking</div>
          <div>• Meditation feedback</div>
        </div>
      </CardContent>
    </Card>
  );
};