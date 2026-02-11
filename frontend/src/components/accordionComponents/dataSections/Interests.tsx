import type { Interest, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createResumeDataSetter } from '@/utils/resumeDataUtils'
import { ItemActions } from '@/components/ui/item-actions'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Interests({ resumeData, setResumeData }: Props) {
  const { addItem, updateItem, removeItem, moveItem } = createResumeDataSetter(
    () => resumeData,
    setResumeData,
  )

  const addInterest = () => {
    const newInterest: Interest = {
      name: '',
      keywords: [],
      enabled: false,
    }
    addItem('interests', newInterest)
  }

  const updateInterest = (
    index: number,
    field: keyof Interest,
    value: string | Array<string>,
  ) => {
    updateItem('interests', index, { [field]: value })
  }

  const removeInterest = (index: number) => {
    removeItem('interests', index)
  }

  const moveInterest = (index: number, direction: 'up' | 'down') => {
    moveItem('interests', index, direction)
  }

  const updateKeywords = (index: number, keywordsString: string) => {
    const keywords = keywordsString
      .split(',')
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0)
    updateInterest(index, 'keywords', keywords)
  }

  const getKeywordsString = (keywords: Array<string> | undefined): string => {
    return keywords ? keywords.join(', ') : ''
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Interests</h3>
      </div>

      {resumeData.interests && resumeData.interests.length > 0 ? (
        <div className="space-y-3">
          {resumeData.interests.map((interest, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Interest {index + 1}
                </h4>
                <ItemActions
                  index={index}
                  totalItems={resumeData.interests?.length || 0}
                  onMoveUp={() => moveInterest(index, 'up')}
                  onMoveDown={() => moveInterest(index, 'down')}
                  onRemove={() => removeInterest(index)}
                />
              </div>

              <div className="space-y-3">
                {/* Interest Name */}
                <div className="space-y-1">
                  <Label htmlFor={`interest-name-${index}`} className="text-sm">
                    Interest Name *
                  </Label>
                  <Input
                    id={`interest-name-${index}`}
                    placeholder="e.g. Photography, Cooking, Hiking"
                    value={interest.name || ''}
                    onChange={(e) =>
                      updateInterest(index, 'name', e.target.value)
                    }
                    className="h-8"
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-1">
                  <Label
                    htmlFor={`interest-keywords-${index}`}
                    className="text-sm"
                  >
                    Keywords
                  </Label>
                  <Input
                    id={`interest-keywords-${index}`}
                    placeholder="e.g. Digital, Landscape, Portrait"
                    value={getKeywordsString(interest.keywords)}
                    onChange={(e) => updateKeywords(index, e.target.value)}
                    className="h-8"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple keywords with commas
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No interests added yet.</p>
          <p className="text-sm">Click "Add Interest" to get started.</p>
        </div>
      )}
      <div className="flex flex-row-reverse">
        <Button onClick={addInterest} size="sm" className="flex-shrink-0">
          Add Interest
        </Button>
      </div>
    </div>
  )
}
