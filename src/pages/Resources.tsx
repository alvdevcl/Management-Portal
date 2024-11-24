import React from 'react';
import { ResourceList } from '../components/ResourceList';
import { Plus } from 'lucide-react';
import { YamlTemplateModal } from '../components/YamlTemplateModal';
import { useNavigate } from 'react-router-dom';

const defaultTemplate = {
  id: 'default-template',
  name: 'Core UI Template',
  yaml: `apiVersion: microservice.alveotech.com/v1alpha1
kind: CoreUI
metadata:
  name: coreui
  namespace: microservice-operator
spec:
  replicas: 1
  image: ac-m2repo-prod.asset-control.com:5443/core-ui:1.0.9
  service:
    type: ClusterIP
    port: 80
    targetPort: 8080
  ingress:
    enabled: true
    host: "coreui.alveotech.com"
    path: "/"
    pathType: "Prefix"
    annotations:
      kubernetes.io/ingress.class: nginx
      nginx.ingress.kubernetes.io/rewrite-target: /
    tls:
    - secretName: coreui-tls
      hosts:
      - "coreui.alveotech.com"`
};

export function Resources() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleYamlSubmit = (yamlContent: string) => {
    localStorage.setItem('selectedTemplate', yamlContent);
    setIsModalOpen(false);
    navigate('/resources');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Resources</h1>
          <p className="text-lg text-muted-foreground">
            Manage your Kubernetes resources
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Resource
        </button>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ResourceList />
      </div>

      <YamlTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={defaultTemplate}
        onSubmit={handleYamlSubmit}
      />
    </div>
  );
}