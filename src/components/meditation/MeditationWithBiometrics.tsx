import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { useSmartWatch } from '@/contexts/SmartWatchContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface MeditationWithBiometricsProps {
  duration?: number; // in minutes
  onComplete?: (sessionData: MeditationSessionData) => void;
}

interface MeditationSessionData {
  duration: number;
  avgHeartRate: number;
  minHeartRate: number;
  maxHeartRate: number;
  heartRateVariability: number;
  stressLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export const MeditationWithBiometrics: React.FC<MeditationWithBiometricsProps> = ({ 
  duration = 5, 
  onComplete 
}) => {
  const { healthMetrics, isConnected, startHeartRateMonitoring } = useSmartWatch();
  const { t } = useLanguage();
  
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [heartRateHistory, setHeartRateHistory] = useState<number[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Track heart rate during session
  useEffect(() => {
    if (isActive && healthMetrics?.heartRate) {
      setHeartRateHistory(prev => [...prev, healthMetrics.heartRate]);
    }
  }, [healthMetrics?.heartRate, isActive]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && sessionStarted) {
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionStarted]);

  const startSession = async () => {
    if (isConnected) {
      await startHeartRateMonitoring();
    }
    setIsActive(true);
    setSessionStarted(true);
    setHeartRateHistory([]);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setSessionStarted(false);
    setTimeLeft(duration * 60);
    setHeartRateHistory([]);
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    setSessionStarted(false);
    
    if (heartRateHistory.length > 0) {
      const avgHeartRate = Math.round(heartRateHistory.reduce((a, b) => a + b, 0) / heartRateHistory.length);
      const minHeartRate = Math.min(...heartRateHistory);
      const maxHeartRate = Math.max(...heartRateHistory);
      
      // Calculate simple HRV approximation
      const heartRateVariability = calculateHRV(heartRateHistory);
      const stressLevel = getStressLevel(avgHeartRate, heartRateVariability);
      
      const sessionData: MeditationSessionData = {
        duration,
        avgHeartRate,
        minHeartRate,
        maxHeartRate,
        heartRateVariability,
        stressLevel,
        timestamp: new Date()
      };
      
      onComplete?.(sessionData);
    }
  };

  const calculateHRV = (heartRates: number[]): number => {
    if (heartRates.length < 2) return 0;
    
    const differences = [];
    for (let i = 1; i < heartRates.length; i++) {
      differences.push(Math.abs(heartRates[i] - heartRates[i - 1]));
    }
    
    return Math.round(differences.reduce((a, b) => a + b, 0) / differences.length);
  };

  const getStressLevel = (avgHR: number, hrv: number): 'low' | 'medium' | 'high' => {
    if (avgHR < 70 && hrv > 10) return 'low';
    if (avgHR > 90 || hrv < 5) return 'high';
    return 'medium';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const currentHeartRate = healthMetrics?.heartRate || 0;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-card-foreground">
          <span>Mindful Meditation</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? 'Heart Rate Active' : 'No Device'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-bold text-card-foreground mb-2">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="w-full h-2" />
        </div>

        {/* Heart Rate Display */}
        {isConnected && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-4">
              <Heart className={`h-8 w-8 text-red-500 ${isActive ? 'animate-pulse' : ''}`} />
              <div className="text-center">
                <div className="text-3xl font-bold text-card-foreground">
                  {currentHeartRate}
                </div>
                <div className="text-sm text-muted-foreground">BPM</div>
              </div>
            </div>
            
            {heartRateHistory.length > 0 && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Session Average: {Math.round(heartRateHistory.reduce((a, b) => a + b, 0) / heartRateHistory.length)} BPM
              </div>
            )}
          </div>
        )}

        {/* Breathing Guide */}
        <div className="text-center space-y-2">
          <div className="text-lg font-medium text-card-foreground">
            {isActive ? "Focus on your breath" : "Ready to begin?"}
          </div>
          <div className="text-sm text-muted-foreground">
            {isActive ? "Breathe slowly and deeply" : `${duration} minute guided session`}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!sessionStarted ? (
            <Button onClick={startSession} className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Start Session</span>
            </Button>
          ) : (
            <>
              <Button 
                onClick={isActive ? pauseSession : startSession}
                variant={isActive ? "outline" : "default"}
                className="flex items-center space-x-2"
              >
                {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isActive ? 'Pause' : 'Resume'}</span>
              </Button>
              
              <Button onClick={resetSession} variant="outline" className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            </>
          )}
        </div>

        {/* Session Insights */}
        {sessionStarted && heartRateHistory.length > 5 && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium text-card-foreground">Session Insights</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Variability:</span>
                <span className="ml-2 font-medium text-card-foreground">
                  {calculateHRV(heartRateHistory)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Stress Level:</span>
                <span className={`ml-2 font-medium ${
                  getStressLevel(currentHeartRate, calculateHRV(heartRateHistory)) === 'low' 
                    ? 'text-green-600' 
                    : getStressLevel(currentHeartRate, calculateHRV(heartRateHistory)) === 'high'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {getStressLevel(currentHeartRate, calculateHRV(heartRateHistory))}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};