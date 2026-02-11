import type { Project, ResumeData, DateConfig } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createResumeDataSetter } from '@/utils/resumeDataUtils'
import { ItemActions } from '@/components/ui/item-actions'
import { DateConfigSection } from '@/components/ui/DateConfigSection'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

function Projects({ resumeData, setResumeData }: Props) {
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

  const dateConfig = resumeData.meta?.projectDateConfig || {
    format: 'YM',
    locale: 'en',
  }

  const handleConfigChange = (key: keyof DateConfig, value: string) => {
    updateMeta({
      projectDateConfig: {
        ...dateConfig,
        [key]: value,
      },
    })
  }

  const addProject = () => {
    const newProject: Project = {
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      highlights: [],
      url: '',
      enabled: true,
    }
    addItem('projects', newProject)
  }

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string | Array<string> | boolean,
  ) => {
    updateItem('projects', index, { [field]: value })
  }

  const removeProject = (index: number) => {
    removeItem('projects', index)
  }

  const moveProject = (index: number, direction: 'up' | 'down') => {
    moveItem('projects', index, direction)
  }

  const addHighlight = (projectIndex: number) => {
    addSubItem('projects', projectIndex, 'highlights', '')
  }

  const updateHighlight = (
    projectIndex: number,
    highlightIndex: number,
    value: string,
  ) => {
    updateSubItem('projects', projectIndex, 'highlights', highlightIndex, value)
  }

  const removeHighlight = (projectIndex: number, highlightIndex: number) => {
    removeSubItem('projects', projectIndex, 'highlights', highlightIndex)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Projects</h3>
      </div>

      {/* Date Configuration Settings */}
      <DateConfigSection
        config={dateConfig}
        onConfigChange={handleConfigChange}
        sectionIdPrefix="project"
      />

      {resumeData.projects && resumeData.projects.length > 0 ? (
        <div className="space-y-3">
          {resumeData.projects.map((project, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Project {index + 1}
                </h4>
                <ItemActions
                  index={index}
                  totalItems={resumeData.projects?.length || 0}
                  onMoveUp={() => moveProject(index, 'up')}
                  onMoveDown={() => moveProject(index, 'down')}
                  onRemove={() => removeProject(index)}
                />
              </div>

              <div className="space-y-3">
                {/* Project Name */}
                <div className="space-y-1">
                  <Label htmlFor={`project-name-${index}`} className="text-sm">
                    Project Name *
                  </Label>
                  <Input
                    id={`project-name-${index}`}
                    placeholder="e.g. E-commerce Website, Mobile App"
                    value={project.name || ''}
                    onChange={(e) =>
                      updateProject(index, 'name', e.target.value)
                    }
                    className="h-8"
                  />
                </div>

                {/* Start Date and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label
                      htmlFor={`project-start-${index}`}
                      className="text-sm"
                    >
                      Start Date
                    </Label>
                    <Input
                      id={`project-start-${index}`}
                      type="date"
                      value={project.startDate || ''}
                      onChange={(e) =>
                        updateProject(index, 'startDate', e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`project-end-${index}`} className="text-sm">
                        End Date
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`project-ongoing-${index}`}
                          checked={project.isOngoing || false}
                          onCheckedChange={(checked: boolean) => {
                            updateProject(index, 'isOngoing', checked)
                          }}
                        />
                        <Label
                          htmlFor={`project-ongoing-${index}`}
                          className="text-sm font-normal cursor-pointer text-muted-foreground"
                        >
                          Ongoing
                        </Label>
                      </div>
                    </div>
                    <Input
                      id={`project-end-${index}`}
                      type="date"
                      value={project.endDate || ''}
                      disabled={project.isOngoing}
                      onChange={(e) =>
                        updateProject(index, 'endDate', e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <Label
                    htmlFor={`project-description-${index}`}
                    className="text-sm"
                  >
                    Description
                  </Label>
                  <Textarea
                    id={`project-description-${index}`}
                    placeholder="Brief description of the project"
                    value={project.description || ''}
                    onChange={(e) =>
                      updateProject(index, 'description', e.target.value)
                    }
                    className="min-h-[80px]"
                  />
                </div>

                {/* URL */}
                <div className="space-y-1">
                  <Label htmlFor={`project-url-${index}`} className="text-sm">
                    URL
                  </Label>
                  <Input
                    id={`project-url-${index}`}
                    placeholder="https://project-url.com"
                    value={project.url || ''}
                    onChange={(e) =>
                      updateProject(index, 'url', e.target.value)
                    }
                    className="h-8"
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
                  {project.highlights && project.highlights.length > 0 ? (
                    <div className="space-y-2">
                      {project.highlights.map((highlight, highlightIndex) => (
                        <div
                          key={highlightIndex}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            placeholder="Project highlight or achievement"
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
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No projects added yet.</p>
          <p className="text-sm">Click "Add Project" to get started.</p>
        </div>
      )}
      <div className="flex flex-row-reverse">
        <Button onClick={addProject} size="sm" className="flex-shrink-0">
          Add Project
        </Button>
      </div>
    </div>
  )
}

export default Projects
