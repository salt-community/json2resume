import { useState } from 'react'
import type { ResumeData, Skill } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createResumeDataSetter } from '@/utils/resumeDataUtils'
import { ItemActions } from '@/components/ui/item-actions'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

function Skills({ resumeData, setResumeData }: Props) {
  const [keywordInputs, setKeywordInputs] = useState<Record<string, string>>({})
  const { addItem, updateItem, removeItem, moveItem } = createResumeDataSetter(
    () => resumeData,
    setResumeData,
  )

  const addSkill = () => {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: '',
      level: '',
      keywords: [],
      enabled: true,
    }
    addItem('skills', newSkill)
  }

  const updateSkill = (
    index: number,
    field: keyof Skill,
    value: string | Array<string>,
  ) => {
    updateItem('skills', index, { [field]: value })
  }

  const removeSkill = (index: number) => {
    removeItem('skills', index)
  }

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    moveItem('skills', index, direction)
  }

  const updateKeywordInput = (skillId: string, value: string) => {
    setKeywordInputs((prev) => ({
      ...prev,
      [skillId]: value,
    }))
  }

  const processKeywords = (skillId: string, value: string) => {
    const keywords = value
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    const skillIndex = (resumeData.skills || []).findIndex(
      (s) => s.id === skillId,
    )
    if (skillIndex !== -1) {
      updateSkill(skillIndex, 'keywords', keywords)
    }
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
            <div key={skill.id} className="border rounded-md p-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Skill {index + 1}
                </h4>
                <ItemActions
                  index={index}
                  totalItems={resumeData.skills?.length || 0}
                  onMoveUp={() => moveSkill(index, 'up')}
                  onMoveDown={() => moveSkill(index, 'down')}
                  onRemove={() => removeSkill(index)}
                />
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
                    keywordInputs[skill.id!] ?? getKeywordsString(skill.keywords)
                  }
                  onChange={(e) =>
                    updateKeywordInput(skill.id!, e.target.value)
                  }
                  onBlur={(e) => processKeywords(skill.id!, e.target.value)}
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

export default Skills
