import { useQuery } from '@tanstack/react-query';
import type { K8sEvent } from '../types/k8s';

export function useK8sEvents() {
  return useQuery<K8sEvent[]>({
    queryKey: ['k8s-events'],
    queryFn: async () => {
      // Placeholder for actual K8s API call
      return [];
    },
    refetchInterval: 5000,
  });
}