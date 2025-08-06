import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bug, ChevronDown, Database, Bluetooth, Activity, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSmartWatch } from '@/contexts/SmartWatchContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const DebugPanel: React.FC = () => {
  const { language } = useLanguage();
  const { user, session } = useAuth();
  const { 
    isConnected, 
    device
  } = useSmartWatch();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>({});
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    // Gather system information
    setSystemInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      geolocation: 'geolocation' in navigator,
      bluetooth: 'bluetooth' in navigator,
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: typeof Storage !== 'undefined',
      webGL: !!window.WebGLRenderingContext,
      timestamp: new Date().toISOString(),
    });

    // Test database connection
    testDbConnection();
  }, []);

  const testDbConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      setDbStatus(error ? 'error' : 'connected');
    } catch (error) {
      setDbStatus('error');
    }
  };

  const exportDebugData = () => {
    const debugData = {
      timestamp: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
        authenticated: !!user,
      },
      session: {
        access_token: session?.access_token ? '[PRESENT]' : '[MISSING]',
        refresh_token: session?.refresh_token ? '[PRESENT]' : '[MISSING]',
        expires_at: session?.expires_at,
      },
      smartWatch: {
        isConnected,
        device: device ? {
          name: device.name,
          id: device.id,
        } : null,
      },
      system: systemInfo,
      database: {
        status: dbStatus,
      },
    };

    const blob = new Blob([JSON.stringify(debugData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baanjai-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: language === 'th' ? 'ส่งออกข้อมูลสำเร็จ' : 'Debug Data Exported',
      description: language === 'th' 
        ? 'ไฟล์ดีบักถูกบันทึกแล้ว' 
        : 'Debug file saved successfully',
    });
  };

  const getStatusBadge = (status: boolean | string, successText: string, errorText: string) => {
    const isSuccess = status === true || status === 'connected';
    return (
      <Badge variant={isSuccess ? 'default' : 'destructive'}>
        {isSuccess ? successText : errorText}
      </Badge>
    );
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Hide in production
  }

  return (
    <Card className="fixed bottom-20 right-4 w-80 z-50 border-2 border-dashed border-yellow-400 bg-yellow-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Bug className="w-4 h-4" />
                <span>Debug Panel</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* System Status */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">System Status</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Auth:</span>
                  {getStatusBadge(!!user, 'OK', 'FAIL')}
                </div>
                <div className="flex justify-between">
                  <span>DB:</span>
                  {getStatusBadge(dbStatus === 'connected', 'OK', 'FAIL')}
                </div>
                <div className="flex justify-between">
                  <span>BT:</span>
                  {getStatusBadge(systemInfo.bluetooth, 'OK', 'N/A')}
                </div>
                <div className="flex justify-between">
                  <span>SW:</span>
                  {getStatusBadge(isConnected, 'ON', 'OFF')}
                </div>
              </div>
            </div>

            {/* Smart Watch Debug */}
            {systemInfo.bluetooth && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Smart Watch</h4>
                <div className="text-xs space-y-1">
                  <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
                  <div>Device: {device?.name || 'None'}</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={exportDebugData}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Export Debug Data
              </Button>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reload App
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="text-xs text-muted-foreground">
              <div>Build: {import.meta.env.MODE}</div>
              <div>Language: {language}</div>
              <div>Online: {systemInfo.onLine ? 'Yes' : 'No'}</div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};