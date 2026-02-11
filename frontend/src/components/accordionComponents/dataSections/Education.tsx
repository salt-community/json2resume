import type {
  DateConfig,
  Education as EducationType,
  ResumeData,
} from '@/types'
import { DateConfigSection } from '@/components/ui/DateConfigSection'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createResumeDataSetter } from '@/utils/resumeDataUtils'
import { ItemActions } from '@/components/ui/item-actions'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

function Education({ resumeData, setResumeData }: Props) {
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

  const dateConfig = resumeData.meta?.educationDateConfig || {
    format: 'YM',
    locale: 'en',
  }

  const handleConfigChange = (key: keyof DateConfig, value: string) => {
    updateMeta({
      educationDateConfig: {
        ...dateConfig,
        [key]: value,
      },
    })
  }

  const addEducation = () => {
    const newEducation: EducationType = {
      institution: '',
      url: '',
      area: '',
      studyType: '',
      startDate: '',
      endDate: '',
      score: '',
      courses: [],
      enabled: true,
    }
    addItem('education', newEducation)
  }

  const updateEducation = (
    index: number,
    field: keyof EducationType,
    value: string | Array<string>,
  ) => {
    updateItem('education', index, { [field]: value })
  }

  const removeEducation = (index: number) => {
    removeItem('education', index)
  }

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    moveItem('education', index, direction)
  }

  const addCourse = (educationIndex: number) => {
    addSubItem('education', educationIndex, 'courses', '')
  }

  const updateCourse = (
    educationIndex: number,
    courseIndex: number,
    value: string,
  ) => {
    updateSubItem('education', educationIndex, 'courses', courseIndex, value)
  }

  const removeCourse = (educationIndex: number, courseIndex: number) => {
    removeSubItem('education', educationIndex, 'courses', courseIndex)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Education</h3>
        <Button onClick={addEducation} size="sm" className="flex-shrink-0">
          Add Education
        </Button>
      </div>

      {/* Date Configuration Settings */}
      <DateConfigSection
        config={dateConfig}
        onConfigChange={handleConfigChange}
        sectionIdPrefix="education"
      />

      {resumeData.education && resumeData.education.length > 0 ? (
        <div className="space-y-6">
          {resumeData.education.map((education, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Education {index + 1}</h4>
                <ItemActions
                  index={index}
                  totalItems={resumeData.education?.length || 0}
                  onMoveUp={() => moveEducation(index, 'up')}
                  onMoveDown={() => moveEducation(index, 'down')}
                  onRemove={() => removeEducation(index)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institution */}
                <div className="space-y-2">
                  <Label htmlFor={`education-institution-${index}`}>
                    Institution *
                  </Label>
                  <Input
                    id={`education-institution-${index}`}
                    placeholder="University or School name"
                    value={education.institution || ''}
                    onChange={(e) =>
                      updateEducation(index, 'institution', e.target.value)
                    }
                  />
                </div>

                {/* Study Type */}
                <div className="space-y-2">
                  <Label htmlFor={`education-studyType-${index}`}>
                    Study Type
                  </Label>
                  <Input
                    id={`education-studyType-${index}`}
                    placeholder="e.g. Bachelor's, Master's, PhD"
                    value={education.studyType || ''}
                    onChange={(e) =>
                      updateEducation(index, 'studyType', e.target.value)
                    }
                  />
                </div>

                {/* Area of Study */}
                <div className="space-y-2">
                  <Label htmlFor={`education-area-${index}`}>
                    Area of Study
                  </Label>
                  <Input
                    id={`education-area-${index}`}
                    placeholder="e.g. Computer Science, Business Administration"
                    value={education.area || ''}
                    onChange={(e) =>
                      updateEducation(index, 'area', e.target.value)
                    }
                  />
                </div>

                {/* URL */}
                <div className="space-y-2">
                  <Label htmlFor={`education-url-${index}`}>Website</Label>
                  <Input
                    id={`education-url-${index}`}
                    type="url"
                    placeholder="https://university.edu"
                    value={education.url || ''}
                    onChange={(e) =>
                      updateEducation(index, 'url', e.target.value)
                    }
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor={`education-start-${index}`}>Start Date</Label>
                  <Input
                    id={`education-start-${index}`}
                    type="date"
                    value={education.startDate || ''}
                    onChange={(e) =>
                      updateEducation(index, 'startDate', e.target.value)
                    }
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor={`education-end-${index}`}>End Date</Label>
                  <Input
                    id={`education-end-${index}`}
                    type="date"
                    placeholder="Leave empty if ongoing"
                    value={education.endDate || ''}
                    onChange={(e) =>
                      updateEducation(index, 'endDate', e.target.value)
                    }
                  />
                </div>

                {/* Score/GPA */}
                <div className="space-y-2">
                  <Label htmlFor={`education-score-${index}`}>Score/GPA</Label>
                  <Input
                    id={`education-score-${index}`}
                    placeholder="e.g. 3.8/4.0"
                    value={education.score || ''}
                    onChange={(e) =>
                      updateEducation(index, 'score', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Courses */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Relevant Courses</Label>
                  <Button
                    onClick={() => addCourse(index)}
                    variant="outline"
                    size="sm"
                  >
                    Add Course
                  </Button>
                </div>

                {education.courses && education.courses.length > 0 ? (
                  <div className="space-y-2">
                    {education.courses.map((course, courseIndex) => (
                      <div
                        key={courseIndex}
                        className="flex items-center gap-2"
                      >
                        <Input
                          placeholder="Course name (e.g. Data Structures, Calculus)"
                          value={course}
                          onChange={(e) =>
                            updateCourse(index, courseIndex, e.target.value)
                          }
                        />
                        <Button
                          onClick={() => removeCourse(index, courseIndex)}
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
                    No courses added yet. Click "Add Course" to get started.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      )}
    </div>
  )
}

export default Education
