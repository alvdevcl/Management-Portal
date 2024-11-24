import React from 'react';
import { 
  Box, 
  Database, 
  Server, 
  Share2, 
  HardDrive, 
  FileVolume, 
  Layers, 
  Shield, 
  Container,
  Network,
  Lock,
  Cog,
  Cpu,
  Globe,
  UserCircle
} from 'lucide-react';

const resources = [
  {
    title: 'Pods',
    icon: <Box className="h-6 w-6 text-blue-500" />,
    description: 'The smallest deployable units of computing that you can create and manage in Kubernetes.',
    keyPoints: [
      'Basic building block of Kubernetes',
      'Contains one or more containers',
      'Shares storage and network resources',
      'Has a specification for how to run the containers'
    ],
    useCases: [
      'Running single container applications',
      'Running applications with helper containers',
      'Batch processing jobs',
      'Development and testing'
    ],
    example: `apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80`
  },
  {
    title: 'Deployments',
    icon: <Layers className="h-6 w-6 text-purple-500" />,
    description: 'Provides declarative updates for Pods and ReplicaSets.',
    keyPoints: [
      'Manages ReplicaSet lifecycle',
      'Enables declarative updates',
      'Supports rolling updates and rollbacks',
      'Ensures desired number of replicas'
    ],
    useCases: [
      'Running stateless applications',
      'Rolling updates with zero downtime',
      'Scaling applications',
      'Canary deployments'
    ],
    example: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2`
  },
  {
    title: 'Services',
    icon: <Network className="h-6 w-6 text-green-500" />,
    description: 'An abstract way to expose an application running on a set of Pods as a network service.',
    keyPoints: [
      'Provides stable network endpoint',
      'Load balances between pods',
      'Supports different service types',
      'Enables service discovery'
    ],
    useCases: [
      'Exposing applications internally',
      'Load balancing traffic',
      'Service discovery',
      'External access to applications'
    ],
    example: `apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP`
  },
  {
    title: 'ConfigMaps',
    icon: <Cog className="h-6 w-6 text-orange-500" />,
    description: 'API objects used to store non-confidential data in key-value pairs.',
    keyPoints: [
      'Stores configuration data',
      'Can be used as environment variables',
      'Can be used as configuration files',
      'Supports updates without rebuilding'
    ],
    useCases: [
      'Application configuration',
      'Environment-specific settings',
      'Configuration files mounting',
      'Dynamic configuration'
    ],
    example: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    environment=production
    debug=false
  api.url: https://api.example.com`
  },
  {
    title: 'Secrets',
    icon: <Lock className="h-6 w-6 text-red-500" />,
    description: 'Used to store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys.',
    keyPoints: [
      'Base64 encoded by default',
      'Can be mounted as files',
      'Can be used as environment variables',
      'Supports different types of secrets'
    ],
    useCases: [
      'Storing credentials',
      'TLS certificates',
      'Docker registry authentication',
      'API tokens'
    ],
    example: `apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=`
  },
  {
    title: 'DaemonSets',
    icon: <Cpu className="h-6 w-6 text-indigo-500" />,
    description: 'Ensures that all (or some) Nodes run a copy of a Pod.',
    keyPoints: [
      'Runs on every node',
      'Automatically handles node scaling',
      'Supports node selectors',
      'Perfect for cluster-wide services'
    ],
    useCases: [
      'Logging collectors',
      'Monitoring agents',
      'Storage daemons',
      'Node-level services'
    ],
    example: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: monitoring-agent
spec:
  selector:
    matchLabels:
      app: monitoring-agent
  template:
    metadata:
      labels:
        app: monitoring-agent
    spec:
      containers:
      - name: agent
        image: monitoring-agent:1.0`
  },
  {
    title: 'StatefulSets',
    icon: <Database className="h-6 w-6 text-yellow-500" />,
    description: 'Manages the deployment and scaling of a set of Pods with unique, persistent identities.',
    keyPoints: [
      'Provides stable network identities',
      'Ordered deployment and scaling',
      'Stable persistent storage',
      'Predictable pod names'
    ],
    useCases: [
      'Databases',
      'Distributed systems',
      'Queue systems',
      'Applications requiring stable network IDs'
    ],
    example: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:13`
  },
  {
    title: 'Persistent Volumes',
    icon: <HardDrive className="h-6 w-6 text-cyan-500" />,
    description: 'Provides an API for users and administrators to abstract details of how storage is provided from how it is consumed.',
    keyPoints: [
      'Storage abstraction',
      'Lifecycle independent of pods',
      'Multiple access modes',
      'Storage class support'
    ],
    useCases: [
      'Database storage',
      'Shared file systems',
      'Application data persistence',
      'Cross-pod data sharing'
    ],
    example: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: data-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: standard`
  },
  {
    title: 'PersistentVolumeClaims',
    icon: <FileVolume className="h-6 w-6 text-emerald-500" />,
    description: 'Claims for storage by a pod that can be mounted as a volume.',
    keyPoints: [
      'Storage request abstraction',
      'Pod storage binding',
      'Storage class selection',
      'Access mode specification'
    ],
    useCases: [
      'Requesting storage for pods',
      'Dynamic volume provisioning',
      'Storage requirement definition',
      'Storage class selection'
    ],
    example: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard`
  },
  {
    title: 'Storage Classes',
    icon: <Database className="h-6 w-6 text-pink-500" />,
    description: 'Describes the "classes" of storage offered by the cluster.',
    keyPoints: [
      'Dynamic volume provisioning',
      'Storage type definition',
      'Provisioner specification',
      'Parameter configuration'
    ],
    useCases: [
      'Automatic storage provisioning',
      'Storage type selection',
      'Quality of service definition',
      'Storage provider configuration'
    ],
    example: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Delete
allowVolumeExpansion: true`
  }
];

export function Documentation() {
  const [activeTab, setActiveTab] = React.useState('kubernetes');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredResources = React.useMemo(() => {
    if (!searchTerm) return resources;
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Learn about Kubernetes resources and custom resource definitions
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('kubernetes')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                ${activeTab === 'kubernetes' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <Layers className="h-5 w-5" />
              <span>Kubernetes Resources</span>
            </button>
            <button
              onClick={() => setActiveTab('microservices')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                ${activeTab === 'microservices' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <Container className="h-5 w-5" />
              <span>Microservices</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                ${activeTab === 'templates' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <FileVolume className="h-5 w-5" />
              <span>Resource Templates</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'kubernetes' && (
            <div className="space-y-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>

              <div className="grid gap-6">
                {filteredResources.map((resource) => (
                  <div
                    key={resource.title}
                    id={resource.title.toLowerCase()}
                    className="bg-card rounded-lg border shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {resource.icon}
                        <div>
                          <h3 className="text-lg font-semibold">{resource.title}</h3>
                          <p className="text-muted-foreground">{resource.description}</p>
                        </div>
                      </div>

                      <div className="mt-6 grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Key Points</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {resource.keyPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Common Use Cases</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {resource.useCases.map((useCase, index) => (
                              <li key={index}>{useCase}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Example</h4>
                        <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                          <code>{resource.example}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'microservices' && (
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Microservices Documentation</h2>
              <p className="text-muted-foreground">
                Documentation for microservices architecture and components will be available soon.
              </p>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Resource Templates</h2>
              <p className="text-muted-foreground">
                Documentation for custom resource templates will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}