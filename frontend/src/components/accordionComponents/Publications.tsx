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

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Publications</h3>
        <Button onClick={addPublication} size="sm">
          Add Publication
        </Button>
      </div>

      {resumeData.publications && resumeData.publications.length > 0 ? (
        <div className="space-y-6">
          {resumeData.publications.map((publication, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Publication {index + 1}</h4>
                <Button
                  onClick={() => removePublication(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
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
