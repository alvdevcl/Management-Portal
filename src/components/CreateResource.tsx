import React from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { YamlEditor } from './YamlEditor';
import yaml from 'js-yaml';

interface ResourceForm {
  name: string;
  namespace: string;
  replicas: number;
  image: string;
  service: {
    type: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
    port: number;
    targetPort: number;
  };
  ingress: {
    enabled: boolean;
    host: string;
    path: string;
    pathType: 'Prefix' | 'Exact';
  };
}

export function CreateResource() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [yamlMode, setYamlMode] = React.useState(false);
  const [yamlContent, setYamlContent] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ResourceForm>({
    defaultValues: {
      replicas: 1,
      service: {
        type: 'ClusterIP',
        port: 80,
        targetPort: 8080
      },
      ingress: {
        enabled: false,
        pathType: 'Prefix',
        path: '/'
      }
    }
  });

  const ingressEnabled = watch('ingress.enabled');

  React.useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        setYamlMode(true);
        setYamlContent(yaml.dump(template));
        localStorage.removeItem('selectedTemplate');
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to load template:', error);
      }
    }
  }, []);

  const onSubmit = (data: ResourceForm) => {
    try {
      // Convert form data to YAML
      const resource = {
        apiVersion: 'microservice.alveotech.com/v1alpha1',
        kind: 'CoreUI',
        metadata: {
          name: data.name,
          namespace: data.namespace
        },
        spec: {
          replicas: data.replicas,
          image: data.image,
          service: data.service,
          ingress: data.ingress.enabled ? {
            ...data.ingress,
            annotations: {
              'kubernetes.io/ingress.class': 'nginx'
            }
          } : undefined
        }
      };

      console.log('Created resource:', resource);
      setIsOpen(false);
      reset();
    } catch (error) {
      setError('Failed to create resource. Please check your input.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Resource
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Create Resource</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-end mb-6">
                <button
                  type="button"
                  onClick={() => setYamlMode(!yamlMode)}
                  className="text-sm text-primary hover:text-primary/90"
                >
                  {yamlMode ? 'Switch to Form' : 'Switch to YAML'}
                </button>
              </div>

              {error && (
                <div className="mb-6 flex items-center gap-2 p-3 text-sm rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {yamlMode ? (
                <div className="space-y-6">
                  <div className="h-[500px] border rounded-lg overflow-hidden">
                    <YamlEditor
                      value={yamlContent}
                      onChange={setYamlContent}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-md border hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        try {
                          const parsed = yaml.load(yamlContent);
                          console.log('Created resource:', parsed);
                          setIsOpen(false);
                        } catch (error) {
                          setError('Invalid YAML format');
                        }
                      }}
                      className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Create
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <input
                        {...register('name', { required: true })}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="my-resource"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Namespace</label>
                      <input
                        {...register('namespace', { required: true })}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="default"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Replicas</label>
                      <input
                        type="number"
                        {...register('replicas', { required: true, min: 1 })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Image</label>
                      <input
                        {...register('image', { required: true })}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="nginx:latest"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Service Configuration</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <select
                          {...register('service.type')}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="ClusterIP">ClusterIP</option>
                          <option value="NodePort">NodePort</option>
                          <option value="LoadBalancer">LoadBalancer</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Port</label>
                        <input
                          type="number"
                          {...register('service.port')}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Target Port</label>
                        <input
                          type="number"
                          {...register('service.targetPort')}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register('ingress.enabled')}
                        id="ingress-enabled"
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="ingress-enabled" className="text-sm font-medium">
                        Enable Ingress
                      </label>
                    </div>

                    {ingressEnabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Host</label>
                          <input
                            {...register('ingress.host')}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Path Type</label>
                          <select
                            {...register('ingress.pathType')}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="Prefix">Prefix</option>
                            <option value="Exact">Exact</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Path</label>
                          <input
                            {...register('ingress.path')}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="/"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-md border hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Create
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}