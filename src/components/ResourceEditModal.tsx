import React from 'react';
import { X, Save, AlertCircle, Check, Copy, Trash2 } from 'lucide-react';
import { YamlEditor } from './YamlEditor';
import { useThemeStore } from '../store/theme';
import yaml from 'js-yaml';
import type { CustomResource } from '../types/k8s';

interface ResourceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: CustomResource | null;
  onSave: (resource: CustomResource) => void;
  onDelete: (resource: CustomResource) => void;
}

export function ResourceEditModal({ 
  isOpen, 
  onClose, 
  resource, 
  onSave,
  onDelete 
}: ResourceEditModalProps) {
  const { theme } = useThemeStore();
  const [yamlContent, setYamlContent] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (resource) {
      setYamlContent(yaml.dump(resource));
      setError(null);
      setHasChanges(false);
      setShowDeleteConfirm(false);
    }
  }, [resource]);

  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen || !resource) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const parsed = yaml.load(yamlContent) as CustomResource;
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(parsed);
      setIsSaving(false);
      setHasChanges(false);
    } catch (error) {
      setError('Invalid YAML format. Please check your configuration.');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      onDelete(resource);
      setIsDeleting(false);
      onClose();
    } catch (error) {
      setError('Failed to delete resource.');
      setIsDeleting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
  };

  const handleYamlChange = (value: string) => {
    setYamlContent(value);
    setError(null);
    setHasChanges(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div 
        className={`relative bg-background rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col transform transition-all duration-200 ease-out scale-100 opacity-100 animate-slideDown ${theme === 'dark' ? 'dark' : ''}`}
        style={{ 
          boxShadow: theme === 'dark' 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Edit Resource: {resource.metadata.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Namespace: {resource.metadata.namespace}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full text-foreground transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
          {/* Error Message */}
          {error && (
            <div className="px-6 py-3">
              <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 px-6 py-4 min-h-0">
            <div className="relative h-full rounded-lg overflow-hidden border border-border">
              <div className="absolute top-2 right-2 z-10">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-background/50 backdrop-blur-sm border border-border hover:bg-background/80 transition-colors duration-200 text-sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <YamlEditor
                value={yamlContent}
                onChange={handleYamlChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-3 px-6 py-4 border-t border-border bg-muted/50">
            <div className="flex gap-3">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-red-600 dark:text-red-400">Are you sure?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isDeleting ? (
                      <span className="inline-flex items-center">
                        <span className="animate-spin mr-2">⋯</span>
                        Deleting...
                      </span>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Confirm Delete
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 rounded-md border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Resource
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-border hover:bg-muted text-foreground transition-all duration-200 hover:shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
              >
                {isSaving ? (
                  <span className="inline-flex items-center">
                    <span className="animate-spin mr-2">⋯</span>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}