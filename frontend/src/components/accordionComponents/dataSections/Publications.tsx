import type { DateConfig, Publication, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createResumeDataSetter } from '@/utils/resumeDataUtils'
import { ItemActions } from '@/components/ui/item-actions'
import { DateConfigSection } from '@/components/ui/DateConfigSection'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

function Publications({ resumeData, setResumeData }: Props) {
  const { addItem, updateItem, removeItem, moveItem, updateMeta } =
    createResumeDataSetter(() => resumeData, setResumeData)

  const dateConfig = resumeData.meta?.publicationsDateConfig || {
    format: 'YM',
    locale: 'en',
  }

  const handleConfigChange = (key: keyof DateConfig, value: string) => {
    updateMeta({
      publicationsDateConfig: {
        ...dateConfig,
        [key]: value,
      },
    })
  }

  const addPublication = () => {
    const newPublication: Publication = {
      name: '',
      publisher: '',
      releaseDate: '',
      url: '',
      summary: '',
      enabled: true,
    }
    addItem('publications', newPublication)
  }

  const updatePublication = (
    index: number,
    field: keyof Publication,
    value: string,
  ) => {
    updateItem('publications', index, { [field]: value })
  }

  const removePublication = (index: number) => {
    removeItem('publications', index)
  }

  const movePublication = (index: number, direction: 'up' | 'down') => {
    moveItem('publications', index, direction)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Publications</h3>
      </div>

      {/* Date Configuration Settings */}
      <DateConfigSection
        config={dateConfig}
        onConfigChange={handleConfigChange}
        sectionIdPrefix="publications"
      />

      {resumeData.publications && resumeData.publications.length > 0 ? (
        <div className="space-y-6">
          {resumeData.publications.map((publication, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-lg font-medium">Publication {index + 1}</h4>
                <ItemActions
                  index={index}
                  totalItems={resumeData.publications?.length || 0}
                  onMoveUp={() => movePublication(index, 'up')}
                  onMoveDown={() => movePublication(index, 'down')}
                  onRemove={() => removePublication(index)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Publication Name */}
                <div className="space-y-2">
                  <Label htmlFor={`publication-name-${index}`}>
                    Publication Name *
                  </Label>
                  <Input
                    id={`publication-name-${index}`}
                    placeholder="e.g. Advanced React Patterns"
                    value={publication.name || ''}
                    onChange={(e) =>
                      updatePublication(index, 'name', e.target.value)
                    }
                  />
                </div>

                {/* Publisher */}
                <div className="space-y-2">
                  <Label htmlFor={`publication-publisher-${index}`}>
                    Publisher
                  </Label>
                  <Input
                    id={`publication-publisher-${index}`}
                    placeholder="e.g. ACM, IEEE, O'Reilly Media"
                    value={publication.publisher || ''}
                    onChange={(e) =>
                      updatePublication(index, 'publisher', e.target.value)
                    }
                  />
                </div>

                {/* Release Date */}
                <div className="space-y-2">
                  <Label htmlFor={`publication-releaseDate-${index}`}>
                    Release Date
                  </Label>
                  <Input
                    id={`publication-releaseDate-${index}`}
                    type="date"
                    value={publication.releaseDate || ''}
                    onChange={(e) =>
                      updatePublication(index, 'releaseDate', e.target.value)
                    }
                  />
                </div>

                {/* URL */}
                <div className="space-y-2">
                  <Label htmlFor={`publication-url-${index}`}>URL</Label>
                  <Input
                    id={`publication-url-${index}`}
                    type="url"
                    placeholder="https://example.com/publication"
                    value={publication.url || ''}
                    onChange={(e) =>
                      updatePublication(index, 'url', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor={`publication-summary-${index}`}>Summary</Label>
                <Textarea
                  id={`publication-summary-${index}`}
                  placeholder="Brief description of the publication, key findings, or impact..."
                  value={publication.summary || ''}
                  onChange={(e) =>
                    updatePublication(index, 'summary', e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No publications added yet.</p>
          <p className="text-sm">Click "Add Publication" to get started.</p>
        </div>
      )}
      <div className="flex flex-row-reverse">
        <Button onClick={addPublication} size="sm" className="flex-shrink-0">
          Add Publication
        </Button>
      </div>
    </div>
  )
}

export default Publications
