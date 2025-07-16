import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Zap } from 'lucide-react';
import { useSmartWatch } from '@/contexts/SmartWatchContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const HealthMetricsCard = () => {
  const { healthMetrics, isConnected } = useSmartWatch();
  const { t } = useLanguage();

  const getHeartRateStatus = (heartRate: number) => {
    if (heartRate < 60) return { status: 'Low', color: 'bg-blue-500' };
    if (heartRate > 100) return { status: 'High', color: 'bg-red-500' };
    return { status: 'Normal', color: 'bg-green-500' };
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-card-foreground">
          <span>Health Metrics</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthMetrics ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-card-foreground">Heart Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-card-foreground">
                  {healthMetrics.heartRate}
                </span>
                <span className="text-muted-foreground">bpm</span>
                <div className={`w-2 h-2 rounded-full ${getHeartRateStatus(healthMetrics.heartRate).color}`} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span className="text-card-foreground">Steps</span>
              </div>
              <span className="text-xl font-semibold text-card-foreground">
                {healthMetrics.steps.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span className="text-card-foreground">Calories</span>
              </div>
              <span className="text-xl font-semibold text-card-foreground">
                {healthMetrics.calories}
              </span>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
              Last updated: {healthMetrics.timestamp.toLocaleTimeString()}
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {isConnected ? 
              'Start monitoring to see health metrics' : 
              'Connect your smart watch to view health data'
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
};