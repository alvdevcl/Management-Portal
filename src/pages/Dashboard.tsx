import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Server, Database, Lock, Cog, Layers } from 'lucide-react';

const stats = [
  { 
    label: 'Total Nodes', 
    value: '3', 
    icon: Server, 
    change: 'Healthy',
    path: '/resources/list?kind=Node'
  },
  { 
    label: 'Total Pods', 
    value: '24', 
    icon: Box, 
    change: '22 Running',
    path: '/resources/list?kind=Pod'
  },
  { 
    label: 'Deployments', 
    value: '8', 
    icon: Layers, 
    change: 'All Healthy',
    path: '/resources/list?kind=Deployment'
  },
  { 
    label: 'StatefulSets', 
    value: '2', 
    icon: Database, 
    change: 'All Healthy',
    path: '/resources/list?kind=StatefulSet'
  },
  { 
    label: 'ConfigMaps', 
    value: '12', 
    icon: Cog, 
    change: '3 Updated',
    path: '/resources/list?kind=ConfigMap'
  },
  { 
    label: 'Secrets', 
    value: '15', 
    icon: Lock, 
    change: '2 Updated',
    path: '/resources/list?kind=Secret'
  },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Overview of your Kubernetes cluster resources
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => navigate(stat.path)}
              className="p-6 bg-card rounded-lg border shadow-sm hover:border-primary transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium">New deployment successful</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">ConfigMap updated</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pod scaling event</p>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Cluster Health</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Node Status</span>
                <span className="text-green-500 font-medium">3/3 Ready</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pod Status</span>
                <span className="text-green-500 font-medium">22/24 Running</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '92%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deployment Status</span>
                <span className="text-green-500 font-medium">8/8 Ready</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}