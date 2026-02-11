import type { Certificate, DateConfig, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createResumeDataSetter } from '@/utils/resumeDataUtils'
import { ItemActions } from '@/components/ui/item-actions'
import { DateConfigSection } from '@/components/ui/DateConfigSection'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Certifications({ resumeData, setResumeData }: Props) {
  const { addItem, updateItem, removeItem, moveItem, updateMeta } =
    createResumeDataSetter(() => resumeData, setResumeData)

  const dateConfig = resumeData.meta?.certificatesDateConfig || {
    format: 'YM',
    locale: 'en',
  }

  const handleConfigChange = (key: keyof DateConfig, value: string) => {
    updateMeta({
      certificatesDateConfig: {
        ...dateConfig,
        [key]: value,
      },
    })
  }

  const addCertificate = () => {
    const newCertificate: Certificate = {
      name: '',
      date: '',
      issuer: '',
      url: '',
      enabled: true,
    }
    addItem('certificates', newCertificate)
  }

  const updateCertificate = (
    index: number,
    field: keyof Certificate,
    value: string,
  ) => {
    updateItem('certificates', index, { [field]: value })
  }

  const removeCertificate = (index: number) => {
    removeItem('certificates', index)
  }

  const moveCertificate = (index: number, direction: 'up' | 'down') => {
    moveItem('certificates', index, direction)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Certificates</h3>
      </div>

      {/* Date Configuration Settings */}
      <DateConfigSection
        config={dateConfig}
        onConfigChange={handleConfigChange}
        sectionIdPrefix="certificates"
      />

      {resumeData.certificates && resumeData.certificates.length > 0 ? (
        <div className="space-y-6">
          {resumeData.certificates.map((certificate, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Certificate {index + 1}</h4>
                <ItemActions
                  index={index}
                  totalItems={resumeData.certificates?.length || 0}
                  onMoveUp={() => moveCertificate(index, 'up')}
                  onMoveDown={() => moveCertificate(index, 'down')}
                  onRemove={() => removeCertificate(index)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Certificate Name */}
                <div className="space-y-2">
                  <Label htmlFor={`certificate-name-${index}`}>
                    Certificate Name *
                  </Label>
                  <Input
                    id={`certificate-name-${index}`}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    value={certificate.name || ''}
                    onChange={(e) =>
                      updateCertificate(index, 'name', e.target.value)
                    }
                  />
                </div>

                {/* Issuer */}
                <div className="space-y-2">
                  <Label htmlFor={`certificate-issuer-${index}`}>Issuer</Label>
                  <Input
                    id={`certificate-issuer-${index}`}
                    placeholder="e.g. Amazon Web Services, Microsoft"
                    value={certificate.issuer || ''}
                    onChange={(e) =>
                      updateCertificate(index, 'issuer', e.target.value)
                    }
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor={`certificate-date-${index}`}>Date</Label>
                  <Input
                    id={`certificate-date-${index}`}
                    type="date"
                    value={certificate.date || ''}
                    onChange={(e) =>
                      updateCertificate(index, 'date', e.target.value)
                    }
                  />
                </div>

                {/* URL */}
                <div className="space-y-2">
                  <Label htmlFor={`certificate-url-${index}`}>URL</Label>
                  <Input
                    id={`certificate-url-${index}`}
                    type="url"
                    placeholder="https://certificate.com"
                    value={certificate.url || ''}
                    onChange={(e) =>
                      updateCertificate(index, 'url', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No certificates added yet.</p>
          <p className="text-sm">Click "Add Certificate" to get started.</p>
        </div>
      )}
      <div className="flex flex-row-reverse">
        <Button onClick={addCertificate} size="sm" className="flex-shrink-0">
          Add Certificate
        </Button>
      </div>
    </div>
  )
}
