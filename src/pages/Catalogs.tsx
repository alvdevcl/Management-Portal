import React from 'react';
import { ResourceCatalog } from '../components/ResourceCatalog';

export function Catalogs() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Software Catalogs</h1>
        <p className="text-lg text-muted-foreground">
          Browse and deploy pre-configured application templates
        </p>
      </div>
      <ResourceCatalog />
    </div>
  );
}