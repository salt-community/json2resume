import type { Reference, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function References({ resumeData, setResumeData }: Props) {
  const addReference = () => {
    const newReference: Reference = {
      name: '',
      reference: '',
    }
    setResumeData({
      ...resumeData,
      references: [...(resumeData.references || []), newReference],
    })
  }

  const updateReference = (
    index: number,
    field: keyof Reference,
    value: string,
  ) => {
    const updatedReferences = [...(resumeData.references || [])]
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      references: updatedReferences,
    })
  }

  const removeReference = (index: number) => {
    const updatedReferences = (resumeData.references || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      references: updatedReferences,
    })
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">References</h3>
        <Button onClick={addReference} size="sm">
          Add Reference
        </Button>
      </div>

      {resumeData.references && resumeData.references.length > 0 ? (
        <div className="space-y-3">
          {resumeData.references.map((reference, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Reference {index + 1}
                </h4>
                <Button
                  onClick={() => removeReference(index)}
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-3">
                {/* Reference Name */}
                <div className="space-y-1">
                  <Label
                    htmlFor={`reference-name-${index}`}
                    className="text-sm"
                  >
                    Name *
                  </Label>
                  <Input
                    id={`reference-name-${index}`}
                    placeholder="e.g. John Smith, Jane Doe"
                    value={reference.name || ''}
                    onChange={(e) =>
                      updateReference(index, 'name', e.target.value)
                    }
                    className="h-8"
                  />
                </div>

                {/* Reference Details */}
                <div className="space-y-1">
                  <Label
                    htmlFor={`reference-details-${index}`}
                    className="text-sm"
                  >
                    Reference Details
                  </Label>
                  <Textarea
                    id={`reference-details-${index}`}
                    placeholder="e.g. Senior Manager at Company, john.smith@company.com"
                    value={reference.reference || ''}
                    onChange={(e) =>
                      updateReference(index, 'reference', e.target.value)
                    }
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No references added yet.</p>
          <p className="text-sm">Click "Add Reference" to get started.</p>
        </div>
      )}
    </div>
  )
}
