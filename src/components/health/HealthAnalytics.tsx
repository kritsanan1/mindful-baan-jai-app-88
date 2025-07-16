import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Heart } from 'lucide-react';

interface HealthTrend {
  date: string;
  heartRate: number;
  steps: number;
  meditation: number;
  stress: number;
}

interface HealthAnalyticsProps {
  data?: HealthTrend[];
}

// Mock data for demonstration
const mockHealthData: HealthTrend[] = [
  { date: '2024-01-01', heartRate: 72, steps: 8500, meditation: 10, stress: 3 },
  { date: '2024-01-02', heartRate: 68, steps: 9200, meditation: 15, stress: 2 },
  { date: '2024-01-03', heartRate: 75, steps: 7800, meditation: 5, stress: 4 },
  { date: '2024-01-04', heartRate: 70, steps: 10500, meditation: 20, stress: 2 },
  { date: '2024-01-05', heartRate: 73, steps: 8900, meditation: 12, stress: 3 },
  { date: '2024-01-06', heartRate: 67, steps: 11200, meditation: 25, stress: 1 },
  { date: '2024-01-07', heartRate: 71, steps: 9800, meditation: 18, stress: 2 },
];

export const HealthAnalytics: React.FC<HealthAnalyticsProps> = ({ data = mockHealthData }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getWeeklyAverage = (key: keyof HealthTrend) => {
    const values = data.map(d => d[key] as number);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const getTrend = (key: keyof HealthTrend) => {
    const values = data.map(d => d[key] as number);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return secondAvg > firstAvg ? 'up' : 'down';
  };

  return (
    <div className="space-y-6">
      {/* Weekly Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
                <p className="text-2xl font-bold text-card-foreground">{getWeeklyAverage('heartRate')}</p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrend('heartRate') === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                <Heart className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Steps</p>
                <p className="text-2xl font-bold text-card-foreground">{getWeeklyAverage('steps').toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrend('steps') === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Meditation</p>
                <p className="text-2xl font-bold text-card-foreground">{getWeeklyAverage('meditation')}min</p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrend('meditation') === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="text-purple-500">🧘</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stress Level</p>
                <p className="text-2xl font-bold text-card-foreground">{getWeeklyAverage('stress')}/5</p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrend('stress') === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
                <span className="text-orange-500">⚡</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heart Rate Trend Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Heart Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                formatter={(value) => [`${value} BPM`, 'Heart Rate']}
                labelFormatter={(label) => formatDate(label)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#ef4444" 
                fill="#ef444430"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity & Wellness Correlation */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Activity & Wellness</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'meditation') return [`${value} min`, 'Meditation'];
                  if (name === 'stress') return [`${value}/5`, 'Stress Level'];
                  return [value, name];
                }}
                labelFormatter={(label) => formatDate(label)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="meditation" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};