import type { Interest, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Interests({ resumeData, setResumeData }: Props) {
  const addInterest = () => {
    const newInterest: Interest = {
      name: '',
      keywords: [],
    }
    setResumeData({
      ...resumeData,
      interests: [...(resumeData.interests || []), newInterest],
    })
  }

  const updateInterest = (
    index: number,
    field: keyof Interest,
    value: string | Array<string>,
  ) => {
    const updatedInterests = [...(resumeData.interests || [])]
    updatedInterests[index] = {
      ...updatedInterests[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      interests: updatedInterests,
    })
  }

  const removeInterest = (index: number) => {
    const updatedInterests = (resumeData.interests || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      interests: updatedInterests,
    })
  }

  const moveInterest = (index: number, direction: 'up' | 'down') => {
    const interests = [...(resumeData.interests || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < interests.length) {
      const [movedInterest] = interests.splice(index, 1)
      interests.splice(newIndex, 0, movedInterest)

      setResumeData({
        ...resumeData,
        interests: interests,
      })
    }
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Interests</h3>
        <Button onClick={addInterest} size="sm">
          Add Interest
        </Button>
      </div>

      {resumeData.interests && resumeData.interests.length > 0 ? (
        <div className="space-y-3">
          {resumeData.interests.map((interest, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Interest {index + 1}
                </h4>
                <div className="flex items-center space-x-2">
                  {/* Move Up Button */}
                  <Button
                    onClick={() => moveInterest(index, 'up')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  {/* Move Down Button */}
                  <Button
                    onClick={() => moveInterest(index, 'down')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={index === (resumeData.interests?.length || 0) - 1}
                  >
                    ↓
                  </Button>
                  {/* Remove Button */}
                  <Button
                    onClick={() => removeInterest(index)}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                  >
                    Remove
                  </Button>
                </div>
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
    </div>
  )
}
