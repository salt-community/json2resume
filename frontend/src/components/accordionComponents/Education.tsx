import type { Education, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Education({ resumeData, setResumeData }: Props) {
  const addEducation = () => {
    const newEducation: Education = {
      institution: '',
      url: '',
      area: '',
      studyType: '',
      startDate: '',
      endDate: '',
      score: '',
      courses: [],
    }
    setResumeData({
      ...resumeData,
      education: [...(resumeData.education || []), newEducation],
    })
  }

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string | Array<string>,
  ) => {
    const updatedEducation = [...(resumeData.education || [])]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    })
  }

  const removeEducation = (index: number) => {
    const updatedEducation = (resumeData.education || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    })
  }

  const addCourse = (educationIndex: number) => {
    const education = resumeData.education?.[educationIndex]
    if (education) {
      const updatedCourses = [...(education.courses || []), '']
      updateEducation(educationIndex, 'courses', updatedCourses)
    }
  }

  const updateCourse = (
    educationIndex: number,
    courseIndex: number,
    value: string,
  ) => {
    const education = resumeData.education?.[educationIndex]
    if (education) {
      const updatedCourses = [...(education.courses || [])]
      updatedCourses[courseIndex] = value
      updateEducation(educationIndex, 'courses', updatedCourses)
    }
  }

  const removeCourse = (educationIndex: number, courseIndex: number) => {
    const education = resumeData.education?.[educationIndex]
    if (education) {
      const updatedCourses = (education.courses || []).filter(
        (_, i) => i !== courseIndex,
      )
      updateEducation(educationIndex, 'courses', updatedCourses)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Education</h3>
        <Button onClick={addEducation} size="sm">
          Add Education
        </Button>
      </div>

      {resumeData.education && resumeData.education.length > 0 ? (
        <div className="space-y-6">
          {resumeData.education.map((education, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Education {index + 1}</h4>
                <Button
                  onClick={() => removeEducation(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
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
                    type="month"
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
                    type="month"
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
                    placeholder="e.g. 3.8/4.0, Magna Cum Laude"
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
