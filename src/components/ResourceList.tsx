import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock, Search, ArrowRight, Edit, Trash2 } from 'lucide-react';
import type { CustomResource } from '../types/k8s';
import { ResourceEditModal } from './ResourceEditModal';

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

// Mock data for development
const mockResources: CustomResource[] = [
  {
    apiVersion: 'microservice.alveotech.com/v1alpha1',
    kind: 'CoreUI',
    metadata: {
      name: 'frontend-ui',
      namespace: 'production',
      creationTimestamp: '2024-03-10T10:00:00Z',
      uid: '123e4567-e89b-12d3-a456-426614174000'
    },
    spec: {
      replicas: 3
    },
    status: {
      phase: 'Running',
      replicas: 3,
      availableReplicas: 3
    }
  },
  {
    apiVersion: 'microservice.alveotech.com/v1alpha1',
    kind: 'AuthService',
    metadata: {
      name: 'auth-service',
      namespace: 'production',
      creationTimestamp: '2024-03-09T15:30:00Z',
      uid: '123e4567-e89b-12d3-a456-426614174001'
    },
    spec: {
      replicas: 2
    },
    status: {
      phase: 'Running',
      replicas: 2,
      availableReplicas: 2
    }
  }
];

export function ResourceList() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState({
    namespace: '',
    kind: '',
    status: '',
  });
  const [selectedResource, setSelectedResource] = React.useState<CustomResource | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const { data: resources = [], isLoading, error } = useQuery<CustomResource[]>({
    queryKey: ['resources', filters],
    queryFn: async () => {
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return mockResources;
    },
  });

  const filteredResources = React.useMemo(() => {
    return resources.filter((resource) => {
      // Search
      const searchLower = search.toLowerCase();
      if (search && !Object.values(resource.metadata).some(value => 
        String(value).toLowerCase().includes(searchLower)
      )) {
        return false;
      }

      // Filters
      if (filters.namespace && resource.metadata.namespace !== filters.namespace) {
        return false;
      }
      if (filters.kind && resource.kind !== filters.kind) {
        return false;
      }
      if (filters.status && resource.status?.phase !== filters.status) {
        return false;
      }

      return true;
    });
  }, [resources, search, filters]);

  const uniqueValues = React.useMemo(() => {
    return {
      namespaces: [...new Set(resources.map(r => r.metadata.namespace))],
      kinds: [...new Set(resources.map(r => r.kind))],
      statuses: [...new Set(resources.map(r => r.status?.phase).filter(Boolean))],
    };
  }, [resources]);

  const handleLearnMore = (kind: string) => {
    navigate(`/docs#${kind.toLowerCase()}`);
  };

  const handleSaveResource = async (resource: CustomResource) => {
    // Here you would make the API call to update the resource
    console.log('Saving resource:', resource);
    setIsEditModalOpen(false);
  };

  const handleDeleteResource = async (resource: CustomResource) => {
    // Here you would make the API call to delete the resource
    console.log('Deleting resource:', resource);
    setIsEditModalOpen(false);
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.namespace}
            onChange={(e) => setFilters(f => ({ ...f, namespace: e.target.value }))}
            className="border rounded-md bg-background px-3 py-2"
          >
            <option value="">All Namespaces</option>
            {uniqueValues.namespaces.map(ns => (
              <option key={ns} value={ns}>{ns}</option>
            ))}
          </select>
          <select
            value={filters.kind}
            onChange={(e) => setFilters(f => ({ ...f, kind: e.target.value }))}
            className="border rounded-md bg-background px-3 py-2"
          >
            <option value="">All Kinds</option>
            {uniqueValues.kinds.map(kind => (
              <option key={kind} value={kind}>{kind}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            className="border rounded-md bg-background px-3 py-2"
          >
            <option value="">All Statuses</option>
            {uniqueValues.statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
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
                Kind
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
                  {resource.kind}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(resource.metadata.creationTimestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setSelectedResource(resource);
                        setIsEditModalOpen(true);
                      }}
                      className="text-primary hover:text-primary/90 inline-flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleLearnMore(resource.kind)}
                      className="text-primary hover:text-primary/90 inline-flex items-center gap-1"
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ResourceEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        resource={selectedResource}
        onSave={handleSaveResource}
        onDelete={handleDeleteResource}
      />
    </div>
  );
}