import type { Publication, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Publications({ resumeData, setResumeData }: Props) {
  const addPublication = () => {
    const newPublication: Publication = {
      name: '',
      publisher: '',
      releaseDate: '',
      url: '',
      summary: '',
    }
    setResumeData({
      ...resumeData,
      publications: [...(resumeData.publications || []), newPublication],
    })
  }

  const updatePublication = (
    index: number,
    field: keyof Publication,
    value: string,
  ) => {
    const updatedPublications = [...(resumeData.publications || [])]
    updatedPublications[index] = {
      ...updatedPublications[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      publications: updatedPublications,
    })
  }

  const removePublication = (index: number) => {
    const updatedPublications = (resumeData.publications || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      publications: updatedPublications,
    })
  }

  const movePublication = (index: number, direction: 'up' | 'down') => {
    const publications = [...(resumeData.publications || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < publications.length) {
      const [movedPublication] = publications.splice(index, 1)
      publications.splice(newIndex, 0, movedPublication)

      setResumeData({
        ...resumeData,
        publications: publications,
      })
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Publications</h3>
        <Button onClick={addPublication} size="sm" className="flex-shrink-0">
          Add Publication
        </Button>
      </div>

      {resumeData.publications && resumeData.publications.length > 0 ? (
        <div className="space-y-6">
          {resumeData.publications.map((publication, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-lg font-medium">Publication {index + 1}</h4>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Move Up Button */}
                  <Button
                    onClick={() => movePublication(index, 'up')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs flex-shrink-0"
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  {/* Move Down Button */}
                  <Button
                    onClick={() => movePublication(index, 'down')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs flex-shrink-0"
                    disabled={
                      index === (resumeData.publications?.length || 0) - 1
                    }
                  >
                    ↓
                  </Button>
                  {/* Remove Button */}
                  <Button
                    onClick={() => removePublication(index)}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    Remove
                  </Button>
                </div>
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
    </div>
  )
}
