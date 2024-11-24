import React from 'react';
import { Search, Box, Shield, Database, Layout, ArrowRight, Plus } from 'lucide-react';
import { YamlTemplateModal } from './YamlTemplateModal';
import { useNavigate } from 'react-router-dom';
import yaml from 'js-yaml';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  yaml: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    id: 'auth',
    name: 'Authentication',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: 'data',
    name: 'Data Management',
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: 'ui',
    name: 'User Interface',
    icon: <Layout className="h-5 w-5" />,
  },
];

const templates: Template[] = [
  {
    id: 'auth-service',
    name: 'Authentication Service',
    description: 'Core authentication service for user management and access control',
    category: 'Authentication',
    tags: ['auth', 'service', 'security'],
    yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: AuthService
metadata:
  name: auth-service
  namespace: microservice-operator
spec:
  replicas: 1
  image: ac-m2repo-prod.asset-control.com:5443/auth-service:1.0.0
  service:
    type: ClusterIP
    port: 80
    targetPort: 8080
  ingress:
    enabled: true
    host: "auth.alveotech.com"
    path: "/"
    pathType: "Prefix"
    annotations:
      kubernetes.io/ingress.class: nginx
      nginx.ingress.kubernetes.io/rewrite-target: /
    tls:
    - secretName: auth-tls
      hosts:
      - "auth.alveotech.com"`,
  },
  {
    id: 'auth-ui',
    name: 'Authentication UI',
    description: 'User interface for authentication and account management',
    category: 'Authentication',
    tags: ['auth', 'ui', 'frontend'],
    yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: AuthUI
metadata:
  name: auth-ui
  namespace: microservice-operator
spec:
  replicas: 1
  image: ac-m2repo-prod.asset-control.com:5443/auth-ui:1.0.0
  service:
    type: ClusterIP
    port: 80
    targetPort: 8080
  ingress:
    enabled: true
    host: "auth-ui.alveotech.com"
    path: "/"
    pathType: "Prefix"
    annotations:
      kubernetes.io/ingress.class: nginx`,
  },
  {
    id: 'ops-board',
    name: 'Operations Board UI',
    description: 'Dashboard for monitoring and managing operations',
    category: 'User Interface',
    tags: ['operations', 'dashboard', 'monitoring'],
    yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: OpsBoard
metadata:
  name: ops-board
  namespace: microservice-operator
spec:
  replicas: 2
  image: ac-m2repo-prod.asset-control.com:5443/ops-board:1.0.0
  service:
    type: ClusterIP
    port: 80
    targetPort: 8080
  ingress:
    enabled: true
    host: "ops.alveotech.com"
    path: "/"
    pathType: "Prefix"`,
  },
  {
    id: 'data-view-admin',
    name: 'Data View Admin UI',
    description: 'Administrative interface for managing data views',
    category: 'Data Management',
    tags: ['data', 'admin', 'ui'],
    yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: DataViewAdmin
metadata:
  name: data-view-admin
  namespace: microservice-operator
spec:
  replicas: 1
  image: ac-m2repo-prod.asset-control.com:5443/data-view-admin:1.0.0
  service:
    type: ClusterIP
    port: 80
    targetPort: 8080`,
  },
  {
    id: 'data-model-admin',
    name: 'Data Model Admin UI',
    description: 'Interface for managing data models and schemas',
    category: 'Data Management',
    tags: ['data', 'model', 'admin'],
    yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: DataModelAdmin
metadata:
  name: data-model-admin
  namespace: microservice-operator
spec:
  replicas: 1
  image: ac-m2repo-prod.asset-control.com:5443/data-model-admin:1.0.0
  service:
    type: ClusterIP
    port: 80`,
  },
  {
    id: 'frontend-service',
    name: 'Frontend Service',
    description: 'Core frontend service for the application',
    category: 'User Interface',
    tags: ['frontend', 'service', 'ui'],
    yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: FrontendService
metadata:
  name: frontend-service
  namespace: microservice-operator
spec:
  replicas: 3
  image: ac-m2repo-prod.asset-control.com:5443/frontend-service:1.0.0
  service:
    type: ClusterIP
    port: 80`,
  },
  {
    id: 'bdms',
    name: 'BDMS',
    description: 'Business Data Management System',
    category: 'Data Management',
    tags: ['data', 'business', 'management'],
    yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: BDMS
metadata:
  name: bdms
  namespace: microservice-operator
spec:
  replicas: 2
  image: ac-m2repo-prod.asset-control.com:5443/bdms:1.0.0
  service:
    type: ClusterIP
    port: 80`,
  },
  {
    id: 'data-sets',
    name: 'Data Sets',
    description: 'Service for managing data sets and collections',
    category: 'Data Management',
    tags: ['data', 'sets', 'collections'],
    yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: DataSets
metadata:
  name: data-sets
  namespace: microservice-operator
spec:
  replicas: 2
  image: ac-m2repo-prod.asset-control.com:5443/data-sets:1.0.0
  service:
    type: ClusterIP
    port: 80`,
  },
  {
    id: 'tasks-service',
    name: 'Tasks Service',
    description: 'Service for managing and executing tasks',
    category: 'Data Management',
    tags: ['tasks', 'service', 'execution'],
    yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: TasksService
metadata:
  name: tasks-service
  namespace: microservice-operator
spec:
  replicas: 2
  image: ac-m2repo-prod.asset-control.com:5443/tasks-service:1.0.0
  service:
    type: ClusterIP
    port: 80`,
  },
];

export function ResourceCatalog() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const filteredTemplates = React.useMemo(() => {
    return templates.filter(template => {
      if (selectedCategory && categories.find(c => c.id === selectedCategory)?.name !== template.category) {
        return false;
      }
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, [templates, search, selectedCategory]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleYamlSubmit = (yamlContent: string) => {
    try {
      const parsed = yaml.load(yamlContent);
      localStorage.setItem('selectedTemplate', JSON.stringify(parsed));
      setIsModalOpen(false);
      navigate('/resources');
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="order-2 lg:order-1">
          <div className="lg:space-y-4">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap
                  ${!selectedCategory ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <Box className="h-5 w-5" />
                <span>All Templates</span>
                <span className="ml-auto text-sm text-muted-foreground">{templates.length}</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap
                    ${selectedCategory === category.id ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {templates.filter(t => t.category === category.name).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`group relative bg-card rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer
                  ${selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {categories.find(c => c.name === template.category)?.icon}
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* YAML Template Modal */}
      <YamlTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={selectedTemplate}
        onSubmit={handleYamlSubmit}
      />
    </div>
  );
}