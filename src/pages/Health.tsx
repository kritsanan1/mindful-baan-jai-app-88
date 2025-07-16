import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SmartWatchConnection } from '@/components/health/SmartWatchConnection';
import { HealthMetricsCard } from '@/components/health/HealthMetricsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, TrendingUp } from 'lucide-react';

const Health = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen app-gradient">
      {/* Header */}
      <header className="pt-12 pb-6 px-6">
        <div className="text-center">
          <h1 className={`text-2xl font-bold text-foreground ${language === 'th' ? 'thai-text' : ''}`}>
            Health Dashboard
          </h1>
          <p className={`text-muted-foreground mt-1 ${language === 'th' ? 'thai-text' : ''}`}>
            Monitor your wellness with smart watch integration
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Smart Watch Connection */}
        <SmartWatchConnection />

        {/* Health Metrics */}
        <HealthMetricsCard />

        {/* Today's Overview */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-card-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Today's Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-card-foreground">72</div>
                <div className="text-xs text-muted-foreground">Avg BPM</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-card-foreground">8,432</div>
                <div className="text-xs text-muted-foreground">Steps</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-card-foreground">15</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-border cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="font-medium text-card-foreground">Heart Rate</div>
              <div className="text-sm text-muted-foreground">Live monitoring</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="font-medium text-card-foreground">Activity</div>
              <div className="text-sm text-muted-foreground">Track progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Health Tips */}
        <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-card-foreground mb-2">💡 Health Tip</h3>
            <p className="text-sm text-muted-foreground">
              Regular heart rate monitoring during meditation can help you understand your stress levels and improve mindfulness practice.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Health;