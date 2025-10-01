import { memo, useCallback, useState } from 'react'
import type { ResumeData, Skill } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

function Skills({ resumeData, setResumeData }: Props) {
  const [keywordInputs, setKeywordInputs] = useState<Record<number, string>>({})

  const addSkill = () => {
    const newSkill: Skill = {
      name: '',
      level: '',
      keywords: [],
    }
    setResumeData({
      ...resumeData,
      skills: [...(resumeData.skills || []), newSkill],
    })
  }

  const updateSkill = (
    index: number,
    field: keyof Skill,
    value: string | Array<string>,
  ) => {
    const updatedSkills = [...(resumeData.skills || [])]
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    })
  }

  const removeSkill = (index: number) => {
    const updatedSkills = (resumeData.skills || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    })
  }

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    const skills = [...(resumeData.skills || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < skills.length) {
      const [movedSkill] = skills.splice(index, 1)
      skills.splice(newIndex, 0, movedSkill)

      setResumeData({
        ...resumeData,
        skills: skills,
      })
    }
  }

  const updateKeywordInput = (skillIndex: number, value: string) => {
    setKeywordInputs((prev) => ({
      ...prev,
      [skillIndex]: value,
    }))
  }

  const processKeywords = (skillIndex: number, value: string) => {
    const keywords = value
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
    updateSkill(skillIndex, 'keywords', keywords)
  }

  const getKeywordsString = (keywords: Array<string> | undefined) => {
    return keywords ? keywords.join(', ') : ''
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Skills</h3>
        <Button onClick={addSkill} size="sm" className="flex-shrink-0">
          Add Skill
        </Button>
      </div>

      {resumeData.skills && resumeData.skills.length > 0 ? (
        <div className="space-y-3">
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Skill {index + 1}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Move Up Button */}
                  <Button
                    onClick={() => moveSkill(index, 'up')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs flex-shrink-0"
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  {/* Move Down Button */}
                  <Button
                    onClick={() => moveSkill(index, 'down')}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs flex-shrink-0"
                    disabled={index === (resumeData.skills?.length || 0) - 1}
                  >
                    ↓
                  </Button>
                  {/* Remove Button */}
                  <Button
                    onClick={() => removeSkill(index)}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs flex-shrink-0"
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Skill Name */}
                <div className="space-y-1">
                  <Label htmlFor={`skill-name-${index}`} className="text-sm">
                    Skill Name *
                  </Label>
                  <Input
                    id={`skill-name-${index}`}
                    placeholder="e.g. JavaScript, Python, Project Management"
                    value={skill.name || ''}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    className="h-8"
                  />
                </div>

                {/* Skill Level */}
                <div className="space-y-1">
                  <Label htmlFor={`skill-level-${index}`} className="text-sm">
                    Level
                  </Label>
                  <Input
                    id={`skill-level-${index}`}
                    placeholder="e.g. Expert, Intermediate, Beginner"
                    value={skill.level || ''}
                    onChange={(e) =>
                      updateSkill(index, 'level', e.target.value)
                    }
                    className="h-8"
                  />
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-1">
                <Label htmlFor={`skill-keywords-${index}`} className="text-sm">
                  Keywords
                </Label>
                <Input
                  id={`skill-keywords-${index}`}
                  placeholder="e.g. React, Node.js, Express, MongoDB"
                  value={
                    keywordInputs[index] ?? getKeywordsString(skill.keywords)
                  }
                  onChange={(e) => updateKeywordInput(index, e.target.value)}
                  onBlur={(e) => processKeywords(index, e.target.value)}
                  className="h-8 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple keywords with commas
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No skills added yet.</p>
          <p className="text-sm">Click "Add Skill" to get started.</p>
        </div>
      )}
    </div>
  )
}

export default memo(Skills)
