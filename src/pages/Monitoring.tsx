import React from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

const metrics = [
  { label: 'CPU Usage', value: '45%', status: 'normal' },
  { label: 'Memory Usage', value: '78%', status: 'warning' },
  { label: 'Network I/O', value: '1.2 GB/s', status: 'normal' },
  { label: 'Storage', value: '67%', status: 'normal' },
];

const alerts = [
  { severity: 'critical', message: 'High memory usage in production namespace', time: '5m ago' },
  { severity: 'warning', message: 'Pod restart in development namespace', time: '15m ago' },
  { severity: 'info', message: 'New deployment successful', time: '1h ago' },
];

export function Monitoring() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Monitoring</h1>
        <p className="text-lg text-muted-foreground">
          Real-time monitoring and alerts for your cluster
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-6 bg-card rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{metric.label}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {metric.status}
              </span>
            </div>
            <p className="text-3xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">CPU Load</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Network I/O</span>
                  <span className="text-sm text-muted-foreground">1.2 GB/s</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-4">
                  {alert.severity === 'critical' ? (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  ) : alert.severity === 'warning' ? (
                    <Activity className="h-5 w-5 text-yellow-500 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}