import type { DateConfig, ResumeData, Volunteer } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createResumeDataSetter } from '@/utils/resumeDataUtils'
import { ItemActions } from '@/components/ui/item-actions'
import { DateConfigSection } from '@/components/ui/DateConfigSection'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

function Volunteering({ resumeData, setResumeData }: Props) {
  const {
    addItem,
    updateItem,
    removeItem,
    moveItem,
    addSubItem,
    updateSubItem,
    removeSubItem,
    updateMeta,
  } = createResumeDataSetter(() => resumeData, setResumeData)

  const dateConfig = resumeData.meta?.volunteerDateConfig || {
    format: 'YM',
    locale: 'en',
  }

  const handleConfigChange = (key: keyof DateConfig, value: string) => {
    updateMeta({
      volunteerDateConfig: {
        ...dateConfig,
        [key]: value,
      },
    })
  }

  const addVolunteer = () => {
    const newVolunteer: Volunteer = {
      organization: '',
      position: '',
      url: '',
      startDate: '',
      endDate: '',
      summary: '',
      highlights: [],
      enabled: true,
    }
    addItem('volunteer', newVolunteer)
  }

  const updateVolunteer = (
    index: number,
    field: keyof Volunteer,
    value: string | Array<string> | boolean,
  ) => {
    updateItem('volunteer', index, { [field]: value })
  }

  const removeVolunteer = (index: number) => {
    removeItem('volunteer', index)
  }

  const moveVolunteer = (index: number, direction: 'up' | 'down') => {
    moveItem('volunteer', index, direction)
  }

  const addHighlight = (volunteerIndex: number) => {
    addSubItem('volunteer', volunteerIndex, 'highlights', '')
  }

  const updateHighlight = (
    volunteerIndex: number,
    highlightIndex: number,
    value: string,
  ) => {
    updateSubItem(
      'volunteer',
      volunteerIndex,
      'highlights',
      highlightIndex,
      value,
    )
  }

  const removeHighlight = (volunteerIndex: number, highlightIndex: number) => {
    removeSubItem('volunteer', volunteerIndex, 'highlights', highlightIndex)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Volunteer Experience</h3>
      </div>

      {/* Date Configuration Settings */}
      <DateConfigSection
        config={dateConfig}
        onConfigChange={handleConfigChange}
        sectionIdPrefix="volunteer"
      />

      {resumeData.volunteer && resumeData.volunteer.length > 0 ? (
        <div className="space-y-6">
          {resumeData.volunteer.map((volunteer, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">
                  Volunteer Experience {index + 1}
                </h4>
                <ItemActions
                  index={index}
                  totalItems={resumeData.volunteer?.length || 0}
                  onMoveUp={() => moveVolunteer(index, 'up')}
                  onMoveDown={() => moveVolunteer(index, 'down')}
                  onRemove={() => removeVolunteer(index)}
                />
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
                    type="date"
                    value={volunteer.startDate || ''}
                    onChange={(e) =>
                      updateVolunteer(index, 'startDate', e.target.value)
                    }
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`volunteer-end-${index}`}>End Date</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`volunteer-ongoing-${index}`}
                        checked={volunteer.isOngoing || false}
                        onCheckedChange={(checked: boolean) => {
                          updateVolunteer(index, 'isOngoing', checked)
                        }}
                      />
                      <Label
                        htmlFor={`volunteer-ongoing-${index}`}
                        className="text-sm font-normal cursor-pointer text-muted-foreground"
                      >
                        Ongoing
                      </Label>
                    </div>
                  </div>
                  <Input
                    id={`volunteer-end-${index}`}
                    type="date"
                    placeholder="Leave empty if ongoing"
                    value={volunteer.endDate || ''}
                    disabled={volunteer.isOngoing}
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
      <div className="flex flex-row-reverse">
        <Button onClick={addVolunteer} size="sm" className="flex-shrink-0">
          Add Volunteer Experience
        </Button>
      </div>
    </div>
  )
}

export default Volunteering
