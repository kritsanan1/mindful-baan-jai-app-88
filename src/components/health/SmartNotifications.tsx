import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Heart, Activity, Moon, Zap, X } from 'lucide-react';
import { useSmartWatch } from '@/contexts/SmartWatchContext';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'stress' | 'activity' | 'meditation' | 'heartRate';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

export const SmartNotifications = () => {
  const { healthMetrics, isConnected } = useSmartWatch();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'stress',
      title: 'High Stress Detected',
      message: 'Your heart rate is elevated. Consider taking a mindfulness break.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      priority: 'high'
    },
    {
      id: '2',
      type: 'activity',
      title: 'Move Reminder',
      message: "You've been sitting for 2 hours. Time for a gentle walk!",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      priority: 'medium'
    },
    {
      id: '3',
      type: 'meditation',
      title: 'Daily Meditation',
      message: 'Great progress! You completed 15 minutes of meditation today.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      priority: 'low'
    }
  ]);

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'stress':
        return <Zap className="h-4 w-4 text-orange-500" />;
      case 'activity':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'meditation':
        return <Moon className="h-4 w-4 text-purple-500" />;
      case 'heartRate':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300';
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMeditationSuggestion = () => {
    toast({
      title: "Starting Meditation",
      description: "Redirecting to guided meditation session",
    });
    // In a real app, this would navigate to meditation
  };

  const handleActivityReminder = () => {
    toast({
      title: "Activity Reminder Set",
      description: "We'll remind you to move every hour",
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-card-foreground">
          <Bell className="h-5 w-5 text-primary" />
          <span>Smart Notifications</span>
          <Badge variant="secondary">{notifications.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No notifications at the moment</p>
            <p className="text-sm">We'll let you know when your health data needs attention</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <p className="text-sm opacity-90 mt-1">{notification.message}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Action buttons for specific notification types */}
                {notification.type === 'stress' && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <Button
                      size="sm"
                      onClick={handleMeditationSuggestion}
                      className="text-xs"
                    >
                      Start 5-min Meditation
                    </Button>
                  </div>
                )}
                
                {notification.type === 'activity' && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleActivityReminder}
                      className="text-xs"
                    >
                      Set Hourly Reminders
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Smart Health Insights */}
        {isConnected && healthMetrics && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-card-foreground mb-2">💡 Smart Insight</h4>
            <p className="text-sm text-muted-foreground">
              {healthMetrics.heartRate > 80 
                ? "Your heart rate suggests you might be stressed. Consider a breathing exercise."
                : healthMetrics.heartRate < 60
                ? "Your heart rate indicates you're well-rested. Great time for meditation!"
                : "Your heart rate looks healthy. Keep up the good wellness routine!"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};