import type { Award, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Awards({ resumeData, setResumeData }: Props) {
  const addAward = () => {
    const newAward: Award = {
      title: '',
      date: '',
      awarder: '',
      summary: '',
    }
    setResumeData({
      ...resumeData,
      awards: [...(resumeData.awards || []), newAward],
    })
  }

  const updateAward = (index: number, field: keyof Award, value: string) => {
    const updatedAwards = [...(resumeData.awards || [])]
    updatedAwards[index] = { ...updatedAwards[index], [field]: value }
    setResumeData({
      ...resumeData,
      awards: updatedAwards,
    })
  }

  const removeAward = (index: number) => {
    const updatedAwards = (resumeData.awards || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      awards: updatedAwards,
    })
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Awards & Recognition</h3>
        <Button onClick={addAward} size="sm">
          Add Award
        </Button>
      </div>

      {resumeData.awards && resumeData.awards.length > 0 ? (
        <div className="space-y-6">
          {resumeData.awards.map((award, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Award {index + 1}</h4>
                <Button
                  onClick={() => removeAward(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Award Title */}
                <div className="space-y-2">
                  <Label htmlFor={`award-title-${index}`}>Award Title *</Label>
                  <Input
                    id={`award-title-${index}`}
                    placeholder="e.g. Employee of the Year, Best Project Award"
                    value={award.title || ''}
                    onChange={(e) =>
                      updateAward(index, 'title', e.target.value)
                    }
                  />
                </div>

                {/* Awarder */}
                <div className="space-y-2">
                  <Label htmlFor={`award-awarder-${index}`}>Awarded By</Label>
                  <Input
                    id={`award-awarder-${index}`}
                    placeholder="e.g. Company Name, Organization"
                    value={award.awarder || ''}
                    onChange={(e) =>
                      updateAward(index, 'awarder', e.target.value)
                    }
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor={`award-date-${index}`}>Date</Label>
                  <Input
                    id={`award-date-${index}`}
                    type="month"
                    value={award.date || ''}
                    onChange={(e) => updateAward(index, 'date', e.target.value)}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor={`award-summary-${index}`}>Description</Label>
                <Textarea
                  id={`award-summary-${index}`}
                  placeholder="Brief description of the award, criteria, or significance..."
                  value={award.summary || ''}
                  onChange={(e) =>
                    updateAward(index, 'summary', e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No awards added yet.</p>
          <p className="text-sm">Click "Add Award" to get started.</p>
        </div>
      )}
    </div>
  )
}
