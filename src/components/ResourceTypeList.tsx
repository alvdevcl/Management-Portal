import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock, Search, ArrowRight } from 'lucide-react';
import type { CustomResource } from '../types/k8s';

// Mock data for different resource types
const mockResourceData: Record<string, CustomResource[]> = {
  Node: [
    {
      apiVersion: 'v1',
      kind: 'Node',
      metadata: {
        name: 'worker-1',
        namespace: 'default',
        creationTimestamp: '2024-03-10T10:00:00Z',
        uid: '123e4567-e89b-12d3-a456-426614174000'
      },
      spec: {},
      status: {
        phase: 'Ready'
      }
    },
    {
      apiVersion: 'v1',
      kind: 'Node',
      metadata: {
        name: 'worker-2',
        namespace: 'default',
        creationTimestamp: '2024-03-10T10:00:00Z',
        uid: '123e4567-e89b-12d3-a456-426614174001'
      },
      spec: {},
      status: {
        phase: 'Ready'
      }
    }
  ],
  Pod: [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'nginx-pod',
        namespace: 'default',
        creationTimestamp: '2024-03-10T10:00:00Z',
        uid: '123e4567-e89b-12d3-a456-426614174002'
      },
      spec: {},
      status: {
        phase: 'Running'
      }
    }
  ],
  // Add more mock data for other resource types
};

function getStatusColor(status: string | undefined) {
  switch (status?.toLowerCase()) {
    case 'running':
    case 'ready':
    case 'active':
      return 'text-green-500';
    case 'pending':
    case 'provisioning':
      return 'text-yellow-500';
    case 'failed':
    case 'error':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

function StatusIcon({ status }: { status: string | undefined }) {
  const color = getStatusColor(status);
  
  switch (status?.toLowerCase()) {
    case 'running':
    case 'ready':
    case 'active':
      return <CheckCircle2 className={`h-5 w-5 ${color}`} />;
    case 'pending':
    case 'provisioning':
      return <Clock className={`h-5 w-5 ${color}`} />;
    default:
      return <AlertCircle className={`h-5 w-5 ${color}`} />;
  }
}

export function ResourceTypeList() {
  const [searchParams] = useSearchParams();
  const resourceKind = searchParams.get('kind') || 'Pod';
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const { data: resources, isLoading, error } = useQuery<CustomResource[]>({
    queryKey: ['resources', resourceKind],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockResourceData[resourceKind] || [];
    },
  });

  const filteredResources = React.useMemo(() => {
    if (!resources) return [];

    return resources.filter((resource) => {
      if (search) {
        const searchLower = search.toLowerCase();
        return Object.values(resource.metadata).some(value => 
          String(value).toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [resources, search]);

  const handleLearnMore = (kind: string) => {
    navigate(`/docs#${kind.toLowerCase()}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-6 w-6 mr-2" />
        <span>Failed to load resources</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">{resourceKind}s</h1>
        <p className="text-lg text-muted-foreground">
          Manage your {resourceKind.toLowerCase()} resources
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${resourceKind.toLowerCase()}s...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Namespace
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Age
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredResources.map((resource) => (
              <tr key={resource.metadata.uid} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusIcon status={resource.status?.phase} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {resource.metadata.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {resource.metadata.namespace}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(resource.metadata.creationTimestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => handleLearnMore(resource.kind)}
                    className="text-primary hover:text-primary/90 inline-flex items-center gap-1"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}