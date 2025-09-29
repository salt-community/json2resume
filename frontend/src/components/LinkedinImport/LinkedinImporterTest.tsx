import React, { useState } from 'react';
import LinkedinImporter from './LinkedinImporter';
import type { ResumeData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Test component for the LinkedIn Importer
 * This component can be used to test the LinkedIn importer functionality
 * in isolation before integrating it into the main application.
 */
export default function LinkedinImporterTest() {
  const [importedData, setImportedData] = useState<ResumeData | null>(null);

  const handleDataImported = (data: ResumeData) => {
    setImportedData(data);
    console.log('LinkedIn data imported:', data);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Importer Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This is a test component for the LinkedIn importer. Upload your LinkedIn export files
            to test the functionality.
          </p>
          <LinkedinImporter onDataImported={handleDataImported} />
        </CardContent>
      </Card>

      {importedData && (
        <Card>
          <CardHeader>
            <CardTitle>Imported Resume Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Basic Information</h3>
                <p><strong>Name:</strong> {importedData.basics.name}</p>
                <p><strong>Email:</strong> {importedData.basics.email}</p>
                <p><strong>Summary:</strong> {importedData.basics.summary}</p>
              </div>
              
              {importedData.work && importedData.work.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Work Experience ({importedData.work.length} positions)</h3>
                  <div className="space-y-2">
                    {importedData.work.slice(0, 3).map((work, index) => (
                      <div key={index} className="p-3 border rounded">
                        <p><strong>{work.position}</strong> at {work.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {work.startDate} - {work.endDate || 'Present'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importedData.education && importedData.education.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Education ({importedData.education.length} entries)</h3>
                  <div className="space-y-2">
                    {importedData.education.slice(0, 3).map((edu, index) => (
                      <div key={index} className="p-3 border rounded">
                        <p><strong>{edu.studyType}</strong> in {edu.area}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importedData.skills && importedData.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Skills ({importedData.skills.length} skills)</h3>
                  <div className="flex flex-wrap gap-2">
                    {importedData.skills.slice(0, 10).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-muted rounded text-sm">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Raw Data Preview</h3>
                <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-64">
                  {JSON.stringify(importedData, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
