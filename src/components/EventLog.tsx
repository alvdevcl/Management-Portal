import React from 'react';
import { useK8sEvents } from '../hooks/useK8sEvents';
import { AlertCircle, Bell } from 'lucide-react';

export function EventLog() {
  const { data: events, isLoading, error } = useK8sEvents();
  const [isOpen, setIsOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState<string>('all');

  const filteredEvents = React.useMemo(() => {
    if (!events) return [];
    
    return events
      .filter(event => {
        if (severity !== 'all' && event.severity !== severity) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [events, severity]);

  const severityCounts = React.useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      const severity = event.severity || 'Normal';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredEvents]);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center px-4 py-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90"
      >
        <Bell className="h-5 w-5" />
        {severityCounts['Error'] > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs">
            {severityCounts['Error']}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-96 max-h-[70vh] bg-background rounded-lg shadow-xl border overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Event Log</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="flex gap-2">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="all">All Severities</option>
                <option value="Normal">Normal</option>
                <option value="Warning">Warning</option>
                <option value="Error">Error</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(70vh-8rem)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-32 text-red-500">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Failed to load events</span>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No events to display
              </div>
            ) : (
              <div className="divide-y">
                {filteredEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-4 hover:bg-muted/50 ${
                      event.severity === 'Error'
                        ? 'border-l-4 border-red-500'
                        : event.severity === 'Warning'
                        ? 'border-l-4 border-yellow-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{event.object.kind}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.object.metadata.name}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">
                      {event.message || `${event.type} - ${event.object.metadata.namespace}`}
                    </p>
                    {event.reason && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Reason: {event.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}