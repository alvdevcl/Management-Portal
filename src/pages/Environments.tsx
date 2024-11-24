import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Shield, Box, Users, Clock } from 'lucide-react';

interface Namespace {
  name: string;
  status: string;
  resourceQuota: {
    cpu: string;
    memory: string;
    pods: string;
  };
  phase: string;
  age: string;
}

function NamespaceCard({ namespace }: { namespace: Namespace }) {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 hover:border-primary transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{namespace.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${namespace.phase === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {namespace.phase}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Shield className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">CPU Usage</p>
          <p className="text-sm font-medium">{namespace.resourceQuota.cpu}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Memory</p>
          <p className="text-sm font-medium">{namespace.resourceQuota.memory}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Pods</p>
          <p className="text-sm font-medium">{namespace.resourceQuota.pods}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Created {namespace.age} ago</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Box className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

export function Environments() {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const { data: namespaces, isLoading } = useQuery<Namespace[]>({
    queryKey: ['namespaces'],
    queryFn: async () => {
      // Placeholder data - replace with actual K8s API call
      return [
        {
          name: 'default',
          status: 'Active',
          resourceQuota: {
            cpu: '2/4 cores',
            memory: '4/8 Gi',
            pods: '8/12',
          },
          phase: 'Active',
          age: '45d',
        },
        {
          name: 'production',
          status: 'Active',
          resourceQuota: {
            cpu: '8/16 cores',
            memory: '16/32 Gi',
            pods: '24/50',
          },
          phase: 'Active',
          age: '90d',
        },
        {
          name: 'development',
          status: 'Active',
          resourceQuota: {
            cpu: '4/8 cores',
            memory: '8/16 Gi',
            pods: '15/30',
          },
          phase: 'Active',
          age: '30d',
        },
        {
          name: 'staging',
          status: 'Active',
          resourceQuota: {
            cpu: '4/8 cores',
            memory: '8/16 Gi',
            pods: '12/20',
          },
          phase: 'Active',
          age: '60d',
        },
      ];
    },
  });

  const filteredNamespaces = React.useMemo(() => {
    if (!namespaces) return [];
    return namespaces.filter(ns => {
      if (search && !ns.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filter !== 'all' && ns.phase.toLowerCase() !== filter) {
        return false;
      }
      return true;
    });
  }, [namespaces, search, filter]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Environments</h1>
          <p className="text-lg text-muted-foreground">
            Manage your Kubernetes namespaces
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Namespace
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search environments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md bg-background px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="terminating">Terminating</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg border shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredNamespaces.map((namespace) => (
            <NamespaceCard key={namespace.name} namespace={namespace} />
          ))}
        </div>
      )}
    </div>
  );
}