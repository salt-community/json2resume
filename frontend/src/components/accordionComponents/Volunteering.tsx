import type { ResumeData, Volunteer } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Volunteering({ resumeData, setResumeData }: Props) {
  const addVolunteer = () => {
    const newVolunteer: Volunteer = {
      organization: '',
      position: '',
      url: '',
      startDate: '',
      endDate: '',
      summary: '',
      highlights: [],
    }
    setResumeData({
      ...resumeData,
      volunteer: [...(resumeData.volunteer || []), newVolunteer],
    })
  }

  const updateVolunteer = (
    index: number,
    field: keyof Volunteer,
    value: string | Array<string>,
  ) => {
    const updatedVolunteers = [...(resumeData.volunteer || [])]
    updatedVolunteers[index] = { ...updatedVolunteers[index], [field]: value }
    setResumeData({
      ...resumeData,
      volunteer: updatedVolunteers,
    })
  }

  const removeVolunteer = (index: number) => {
    const updatedVolunteers = (resumeData.volunteer || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      volunteer: updatedVolunteers,
    })
  }

  const moveVolunteer = (index: number, direction: 'up' | 'down') => {
    const volunteers = [...(resumeData.volunteer || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < volunteers.length) {
      const [movedVolunteer] = volunteers.splice(index, 1)
      volunteers.splice(newIndex, 0, movedVolunteer)

      setResumeData({
        ...resumeData,
        volunteer: volunteers,
      })
    }
  }

  const addHighlight = (volunteerIndex: number) => {
    const volunteer = resumeData.volunteer?.[volunteerIndex]
    if (volunteer) {
      const updatedHighlights = [...(volunteer.highlights || []), '']
      updateVolunteer(volunteerIndex, 'highlights', updatedHighlights)
    }
  }

  const updateHighlight = (
    volunteerIndex: number,
    highlightIndex: number,
    value: string,
  ) => {
    const volunteer = resumeData.volunteer?.[volunteerIndex]
    if (volunteer) {
      const updatedHighlights = [...(volunteer.highlights || [])]
      updatedHighlights[highlightIndex] = value
      updateVolunteer(volunteerIndex, 'highlights', updatedHighlights)
    }
  }

  const removeHighlight = (volunteerIndex: number, highlightIndex: number) => {
    const volunteer = resumeData.volunteer?.[volunteerIndex]
    if (volunteer) {
      const updatedHighlights = (volunteer.highlights || []).filter(
        (_, i) => i !== highlightIndex,
      )
      updateVolunteer(volunteerIndex, 'highlights', updatedHighlights)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Volunteer Experience</h3>
        <Button onClick={addVolunteer} size="sm">
          Add Volunteer Experience
        </Button>
      </div>

      {resumeData.volunteer && resumeData.volunteer.length > 0 ? (
        <div className="space-y-6">
          {resumeData.volunteer.map((volunteer, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">
                  Volunteer Experience {index + 1}
                </h4>
                <div className="flex items-center space-x-2">
                  {/* Move Up Button */}
                  <Button
                    onClick={() => moveVolunteer(index, 'up')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  {/* Move Down Button */}
                  <Button
                    onClick={() => moveVolunteer(index, 'down')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={index === (resumeData.volunteer?.length || 0) - 1}
                  >
                    ↓
                  </Button>
                  {/* Remove Button */}
                  <Button
                    onClick={() => removeVolunteer(index)}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organization */}
                <div className="space-y-2">
                  <Label htmlFor={`volunteer-organization-${index}`}>
                    Organization *
                  </Label>
                  <Input
                    id={`volunteer-organization-${index}`}
                    placeholder="Organization name"
                    value={volunteer.organization || ''}
                    onChange={(e) =>
                      updateVolunteer(index, 'organization', e.target.value)
                    }
                  />
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor={`volunteer-position-${index}`}>
                    Position
                  </Label>
                  <Input
                    id={`volunteer-position-${index}`}
                    placeholder="Your role/position"
                    value={volunteer.position || ''}
                    onChange={(e) =>
                      updateVolunteer(index, 'position', e.target.value)
                    }
                  />
                </div>

                {/* URL */}
                <div className="space-y-2">
                  <Label htmlFor={`volunteer-url-${index}`}>Website</Label>
                  <Input
                    id={`volunteer-url-${index}`}
                    type="url"
                    placeholder="https://organization.com"
                    value={volunteer.url || ''}
                    onChange={(e) =>
                      updateVolunteer(index, 'url', e.target.value)
                    }
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor={`volunteer-start-${index}`}>Start Date</Label>
                  <Input
                    id={`volunteer-start-${index}`}
                    type="month"
                    value={volunteer.startDate || ''}
                    onChange={(e) =>
                      updateVolunteer(index, 'startDate', e.target.value)
                    }
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor={`volunteer-end-${index}`}>End Date</Label>
                  <Input
                    id={`volunteer-end-${index}`}
                    type="month"
                    placeholder="Leave empty if ongoing"
                    value={volunteer.endDate || ''}
                    onChange={(e) =>
                      updateVolunteer(index, 'endDate', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor={`volunteer-summary-${index}`}>Summary</Label>
                <Textarea
                  id={`volunteer-summary-${index}`}
                  placeholder="Brief description of your volunteer work and impact..."
                  value={volunteer.summary || ''}
                  onChange={(e) =>
                    updateVolunteer(index, 'summary', e.target.value)
                  }
                  rows={3}
                />
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Key Highlights</Label>
                  <Button
                    onClick={() => addHighlight(index)}
                    variant="outline"
                    size="sm"
                  >
                    Add Highlight
                  </Button>
                </div>

                {volunteer.highlights && volunteer.highlights.length > 0 ? (
                  <div className="space-y-2">
                    {volunteer.highlights.map((highlight, highlightIndex) => (
                      <div
                        key={highlightIndex}
                        className="flex items-center gap-2"
                      >
                        <Input
                          placeholder="Describe a key achievement or responsibility..."
                          value={highlight}
                          onChange={(e) =>
                            updateHighlight(
                              index,
                              highlightIndex,
                              e.target.value,
                            )
                          }
                        />
                        <Button
                          onClick={() => removeHighlight(index, highlightIndex)}
                          variant="outline"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No highlights added yet. Click "Add Highlight" to get
                    started.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No volunteer experience added yet.</p>
          <p className="text-sm">
            Click "Add Volunteer Experience" to get started.
          </p>
        </div>
      )}
    </div>
  )
}
