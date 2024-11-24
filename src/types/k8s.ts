export interface CustomResource {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    creationTimestamp: string;
    uid: string;
    [key: string]: any;
  };
  spec: Record<string, any>;
  status?: Record<string, any>;
}

export interface CustomResourceDefinition {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
  };
  spec: {
    group: string;
    names: {
      kind: string;
      plural: string;
      singular: string;
    };
    scope: string;
    versions: Array<{
      name: string;
      schema: {
        openAPIV3Schema: Record<string, any>;
      };
      served: boolean;
      storage: boolean;
    }>;
  };
}

export interface K8sEvent {
  type: string;
  object: CustomResource;
  timestamp: string;
  message?: string;
  reason?: string;
  severity?: 'Normal' | 'Warning' | 'Error';
}