import type { ResumeData, Work as WorkType, DateConfig } from '@/types'
import { DateConfigSection } from '@/components/ui/DateConfigSection'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createResumeDataSetter } from '@/utils/resumeDataUtils'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

function Work({ resumeData, setResumeData }: Props) {
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

  const dateConfig = resumeData.meta?.workDateConfig || {
    format: 'YMD',
    locale: 'en',
  }

  const handleConfigChange = (
    key: keyof DateConfig,
    value: string,
  ) => {
    updateMeta({
      workDateConfig: {
        ...dateConfig,
        [key]: value,
      },
    })
  }

  const addWork = () => {
    const newWork: WorkType = {
      name: '',
      position: '',
      url: '',
      startDate: '',
      endDate: '',
      summary: '',
      highlights: [],
      enabled: true,
    }
    addItem('work', newWork)
  }

  const updateWork = (
    index: number,
    field: keyof WorkType,
    value: string | Array<string>,
  ) => {
    updateItem('work', index, { [field]: value })
  }

  const removeWork = (index: number) => {
    removeItem('work', index)
  }

  const moveWork = (index: number, direction: 'up' | 'down') => {
    moveItem('work', index, direction)
  }

  const addHighlight = (workIndex: number) => {
    addSubItem('work', workIndex, 'highlights', '')
  }

  const updateHighlight = (
    workIndex: number,
    highlightIndex: number,
    value: string,
  ) => {
    updateSubItem('work', workIndex, 'highlights', highlightIndex, value)
  }

  const removeHighlight = (workIndex: number, highlightIndex: number) => {
    removeSubItem('work', workIndex, 'highlights', highlightIndex)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Work Experience</h3>
      </div>

      {/* Date Configuration Settings */}
      <DateConfigSection
        config={dateConfig}
        onConfigChange={handleConfigChange}
        sectionIdPrefix="work"
      />

      {resumeData.work && resumeData.work.length > 0 ? (
        <div className="space-y-3">
          {resumeData.work.map((work, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Work Experience {index + 1}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Move Up Button */}
                  <Button
                    onClick={() => moveWork(index, 'up')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs flex-shrink-0"
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  {/* Move Down Button */}
                  <Button
                    onClick={() => moveWork(index, 'down')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs flex-shrink-0"
                    disabled={index === (resumeData.work?.length || 0) - 1}
                  >
                    ↓
                  </Button>
                  {/* Remove Button */}
                  <Button
                    onClick={() => removeWork(index)}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs flex-shrink-0"
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Company Name */}
                <div className="space-y-1">
                  <Label htmlFor={`work-name-${index}`} className="text-sm">
                    Company Name *
                  </Label>
                  <Input
                    id={`work-name-${index}`}
                    placeholder="e.g. Google, Microsoft, Startup Inc."
                    value={work.name || ''}
                    onChange={(e) => updateWork(index, 'name', e.target.value)}
                    className="h-8"
                  />
                </div>

                {/* Position */}
                <div className="space-y-1">
                  <Label htmlFor={`work-position-${index}`} className="text-sm">
                    Position *
                  </Label>
                  <Input
                    id={`work-position-${index}`}
                    placeholder="e.g. Software Engineer, Product Manager"
                    value={work.position || ''}
                    onChange={(e) =>
                      updateWork(index, 'position', e.target.value)
                    }
                    className="h-8"
                  />
                </div>

                {/* URL */}
                <div className="space-y-1">
                  <Label htmlFor={`work-url-${index}`} className="text-sm">
                    Company URL
                  </Label>
                  <Input
                    id={`work-url-${index}`}
                    placeholder="https://company.com"
                    value={work.url || ''}
                    onChange={(e) => updateWork(index, 'url', e.target.value)}
                    className="h-8"
                  />
                </div>

                {/* Start Date and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`work-start-${index}`} className="text-sm">
                      Start Date
                    </Label>
                    <Input
                      id={`work-start-${index}`}
                      type="date"
                      value={work.startDate || ''}
                      onChange={(e) =>
                        updateWork(index, 'startDate', e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`work-end-${index}`} className="text-sm">
                      End Date
                    </Label>
                    <Input
                      id={`work-end-${index}`}
                      type="date"
                      value={work.endDate || ''}
                      onChange={(e) =>
                        updateWork(index, 'endDate', e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <Label htmlFor={`work-summary-${index}`} className="text-sm">
                    Summary
                  </Label>
                  <Textarea
                    id={`work-summary-${index}`}
                    placeholder="Brief summary of your role and responsibilities"
                    value={work.summary || ''}
                    onChange={(e) =>
                      updateWork(index, 'summary', e.target.value)
                    }
                    className="min-h-[80px]"
                  />
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Highlights</Label>
                    <Button
                      onClick={() => addHighlight(index)}
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      Add Highlight
                    </Button>
                  </div>
                  {work.highlights && work.highlights.length > 0 ? (
                    <div className="space-y-2">
                      {work.highlights.map((highlight, highlightIndex) => (
                        <div
                          key={highlightIndex}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            placeholder="Key achievement or responsibility"
                            value={highlight}
                            onChange={(e) =>
                              updateHighlight(
                                index,
                                highlightIndex,
                                e.target.value,
                              )
                            }
                            className="h-8"
                          />
                          <Button
                            onClick={() =>
                              removeHighlight(index, highlightIndex)
                            }
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No highlights added yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Button onClick={addWork} size="sm" className="flex-shrink-0">
            Add Work Experience
          </Button>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Work Experience" to get started.</p>
        </div>
      )}
    </div>
  )
}

export default Work
