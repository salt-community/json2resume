import type { Project, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Projects({ resumeData, setResumeData }: Props) {
  const addProject = () => {
    const newProject: Project = {
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      highlights: [],
      url: '',
    }
    setResumeData({
      ...resumeData,
      projects: [...(resumeData.projects || []), newProject],
    })
  }

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string | Array<string>,
  ) => {
    const updatedProjects = [...(resumeData.projects || [])]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      projects: updatedProjects,
    })
  }

  const removeProject = (index: number) => {
    const updatedProjects = (resumeData.projects || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      projects: updatedProjects,
    })
  }

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const projects = [...(resumeData.projects || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < projects.length) {
      const [movedProject] = projects.splice(index, 1)
      projects.splice(newIndex, 0, movedProject)

      setResumeData({
        ...resumeData,
        projects: projects,
      })
    }
  }

  const addHighlight = (projectIndex: number) => {
    const project = resumeData.projects?.[projectIndex]
    if (project) {
      const updatedHighlights = [...(project.highlights || []), '']
      updateProject(projectIndex, 'highlights', updatedHighlights)
    }
  }

  const updateHighlight = (
    projectIndex: number,
    highlightIndex: number,
    value: string,
  ) => {
    const project = resumeData.projects?.[projectIndex]
    if (project) {
      const updatedHighlights = [...(project.highlights || [])]
      updatedHighlights[highlightIndex] = value
      updateProject(projectIndex, 'highlights', updatedHighlights)
    }
  }

  const removeHighlight = (projectIndex: number, highlightIndex: number) => {
    const project = resumeData.projects?.[projectIndex]
    if (project) {
      const updatedHighlights = (project.highlights || []).filter(
        (_, i) => i !== highlightIndex,
      )
      updateProject(projectIndex, 'highlights', updatedHighlights)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Projects</h3>
        <Button onClick={addProject} size="sm">
          Add Project
        </Button>
      </div>

      {resumeData.projects && resumeData.projects.length > 0 ? (
        <div className="space-y-3">
          {resumeData.projects.map((project, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Project {index + 1}
                </h4>
                <div className="flex items-center space-x-2">
                  {/* Move Up Button */}
                  <Button
                    onClick={() => moveProject(index, 'up')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  {/* Move Down Button */}
                  <Button
                    onClick={() => moveProject(index, 'down')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={index === (resumeData.projects?.length || 0) - 1}
                  >
                    ↓
                  </Button>
                  {/* Remove Button */}
                  <Button
                    onClick={() => removeProject(index)}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                  >
                    Remove
                  </Button>
                </div>
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
                    <Label htmlFor={`project-end-${index}`} className="text-sm">
                      End Date
                    </Label>
                    <Input
                      id={`project-end-${index}`}
                      type="date"
                      value={project.endDate || ''}
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
    </div>
  )
}
