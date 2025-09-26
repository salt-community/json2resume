import type { Language, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Languages({ resumeData, setResumeData }: Props) {
  const addLanguage = () => {
    const newLanguage: Language = {
      language: '',
      fluency: '',
    }
    setResumeData({
      ...resumeData,
      languages: [...(resumeData.languages || []), newLanguage],
    })
  }

  const updateLanguage = (
    index: number,
    field: keyof Language,
    value: string,
  ) => {
    const updatedLanguages = [...(resumeData.languages || [])]
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      languages: updatedLanguages,
    })
  }

  const removeLanguage = (index: number) => {
    const updatedLanguages = (resumeData.languages || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      languages: updatedLanguages,
    })
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Languages</h3>
        <Button onClick={addLanguage} size="sm">
          Add Language
        </Button>
      </div>

      {resumeData.languages && resumeData.languages.length > 0 ? (
        <div className="space-y-3">
          {resumeData.languages.map((language, index) => (
            <div key={index} className="border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Language {index + 1}
                </h4>
                <Button
                  onClick={() => removeLanguage(index)}
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Language Name */}
                <div className="space-y-1">
                  <Label htmlFor={`language-name-${index}`} className="text-sm">
                    Language *
                  </Label>
                  <Input
                    id={`language-name-${index}`}
                    placeholder="e.g. English, Spanish, French"
                    value={language.language || ''}
                    onChange={(e) =>
                      updateLanguage(index, 'language', e.target.value)
                    }
                    className="h-8"
                  />
                </div>

                {/* Fluency Level */}
                <div className="space-y-1">
                  <Label
                    htmlFor={`language-fluency-${index}`}
                    className="text-sm"
                  >
                    Fluency Level
                  </Label>
                  <Input
                    id={`language-fluency-${index}`}
                    placeholder="e.g. Native, Fluent, Intermediate, Beginner"
                    value={language.fluency || ''}
                    onChange={(e) =>
                      updateLanguage(index, 'fluency', e.target.value)
                    }
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No languages added yet.</p>
          <p className="text-sm">Click "Add Language" to get started.</p>
        </div>
      )}
    </div>
  )
}
