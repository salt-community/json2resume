import type { Award, GlobalDateConfig, ResumeData, SectionDateConfig } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createResumeDataSetter } from '@/utils/resumeDataUtils'
import { ItemActions } from '@/components/ui/item-actions'
import { DateConfigSection } from '@/components/ui/DateConfigSection'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Awards({ resumeData, setResumeData }: Props) {
  const { addItem, updateItem, removeItem, moveItem, updateMeta } =
    createResumeDataSetter(() => resumeData, setResumeData)

  const globalDateConfig = resumeData.meta?.globalDateConfig || {
    locale: 'en',
  }

  const awardsDateConfig = resumeData.meta?.awardsDateConfig || {
    format: 'YM',
  }

  const handleGlobalConfigChange = (key: keyof GlobalDateConfig, value: string) => {
    updateMeta({
      globalDateConfig: {
        ...globalDateConfig,
        [key]: value,
      },
    })
  }

  const handleSectionConfigChange = (key: keyof SectionDateConfig, value: string) => {
    updateMeta({
      awardsDateConfig: {
        ...awardsDateConfig,
        [key]: value as SectionDateConfig['format'],
      },
    })
  }

  const addAward = () => {
    const newAward: Award = {
      enabled: true,
      title: '',
      date: '',
      awarder: '',
      summary: '',
    }
    addItem('awards', newAward)
  }

  const updateAward = (index: number, field: keyof Award, value: string) => {
    updateItem('awards', index, { [field]: value })
  }

  const removeAward = (index: number) => {
    removeItem('awards', index)
  }

  const moveAward = (index: number, direction: 'up' | 'down') => {
    moveItem('awards', index, direction)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Awards & Recognition</h3>
      </div>

      {/* Date Configuration Settings */}
      <DateConfigSection
        globalConfig={globalDateConfig}
        sectionConfig={awardsDateConfig}
        onGlobalChange={handleGlobalConfigChange}
        onSectionChange={handleSectionConfigChange}
        sectionIdPrefix="awards"
      />

      {resumeData.awards && resumeData.awards.length > 0 ? (
        <div className="space-y-6">
          {resumeData.awards.map((award, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-lg font-medium">Award {index + 1}</h4>
                <ItemActions
                  index={index}
                  totalItems={resumeData.awards?.length || 0}
                  onMoveUp={() => moveAward(index, 'up')}
                  onMoveDown={() => moveAward(index, 'down')}
                  onRemove={() => removeAward(index)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Award Title */}
                <div className="space-y-2">
                  <Label htmlFor={`award-title-${index}`}>Award Title *</Label>
                  <Input
                    id={`award-title-${index}`}
                    placeholder="e.g. Employee of the Year, Best Project Award"
                    value={award.title || ''}
                    onChange={(e) =>
                      updateAward(index, 'title', e.target.value)
                    }
                  />
                </div>

                {/* Awarder */}
                <div className="space-y-2">
                  <Label htmlFor={`award-awarder-${index}`}>Awarded By</Label>
                  <Input
                    id={`award-awarder-${index}`}
                    placeholder="e.g. Company Name, Organization"
                    value={award.awarder || ''}
                    onChange={(e) =>
                      updateAward(index, 'awarder', e.target.value)
                    }
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor={`award-date-${index}`}>Date</Label>
                  <Input
                    id={`award-date-${index}`}
                    type="date"
                    value={award.date || ''}
                    onChange={(e) => updateAward(index, 'date', e.target.value)}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor={`award-summary-${index}`}>Description</Label>
                <Textarea
                  id={`award-summary-${index}`}
                  placeholder="Brief description of the award, criteria, or significance..."
                  value={award.summary || ''}
                  onChange={(e) =>
                    updateAward(index, 'summary', e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No awards added yet.</p>
          <p className="text-sm">Click "Add Award" to get started.</p>
        </div>
      )}
      <div className="flex flex-row-reverse">
        <Button onClick={addAward} size="sm" className="flex-shrink-0">
          Add Award
        </Button>
      </div>
    </div>
  )
}
