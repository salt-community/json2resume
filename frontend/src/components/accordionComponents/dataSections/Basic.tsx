import { useState } from 'react'
import type { ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Basic({ resumeData, setResumeData }: Props) {
  // Determine initial image mode based on which field has data
  const [imageMode, setImageMode] = useState<'url' | 'upload'>(() => {
    return resumeData.basics?.uploadedImage ? 'upload' : 'url'
  })

  const updateBasics = (field: keyof NonNullable<typeof resumeData.basics>, value: any) => {
    setResumeData({
      ...resumeData,
      basics: {
        ...resumeData.basics,
        enabled: resumeData.basics?.enabled ?? true,
        [field]: value
      },
    })
  }

  const handleImageModeChange = (mode: 'url' | 'upload') => {
    setImageMode(mode)
    
    // Clear the opposite field when switching modes to avoid confusion
    if (mode === 'url') {
      updateBasics('uploadedImage', undefined)
    } else {
      updateBasics('image', undefined)
    }
  }

  const updateLocation = (
    field: keyof NonNullable<NonNullable<typeof resumeData.basics>['location']>,
    value: string,
  ) => {
    setResumeData({
      ...resumeData,
      basics: {
        ...resumeData.basics,
        enabled: resumeData.basics?.enabled ?? true,
        location: {
          ...resumeData.basics?.location,
          enabled: resumeData.basics?.location?.enabled ?? true,
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="Your full name"
            value={resumeData.basics?.name || ''}
            onChange={(e) => updateBasics('name', e.target.value)}
          />
        </div>

        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="label">Professional Title</Label>
          <Input
            id="label"
            placeholder="e.g. Software Engineer"
            value={resumeData.basics?.label || ''}
            onChange={(e) => updateBasics('label', e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={resumeData.basics?.email || ''}
            onChange={(e) => updateBasics('email', e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={resumeData.basics?.phone || ''}
            onChange={(e) => updateBasics('phone', e.target.value)}
          />
        </div>

        {/* Profile Image */}
        <div className="space-y-2">
          <Label htmlFor="image">Profile Image URL</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              {imageMode === 'url' ? (
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={resumeData.basics?.image || ''}
                  onChange={(e) => updateBasics('image', e.target.value)}
                />
              ) : (
                <ImageUpload
                  value={resumeData.basics?.uploadedImage}
                  onChange={(value) => updateBasics('uploadedImage', value)}
                  showLabel={false}
                />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleImageModeChange('url')}
                className={`text-xs px-3 py-2 h-8 ${
                  imageMode === 'url'
                    ? 'bg-[var(--color-selected)] text-[var(--color-on-selected)] border-[var(--color-selected)] !cursor-default hover:!bg-[var(--color-selected)] hover:!text-[var(--color-on-selected)]'
                    : ''
                }`}
              >
                URL
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleImageModeChange('upload')}
                className={`text-xs px-3 py-2 h-8 ${
                  imageMode === 'upload'
                    ? 'bg-[var(--color-selected)] text-[var(--color-on-selected)] border-[var(--color-selected)] !cursor-default hover:!bg-[var(--color-selected)] hover:!text-[var(--color-on-selected)]'
                    : ''
                }`}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          placeholder="Brief description of your professional background and key achievements..."
          value={resumeData.basics?.summary || ''}
          onChange={(e) => updateBasics('summary', e.target.value)}
          rows={4}
        />
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              value={resumeData.basics?.location?.address || ''}
              onChange={(e) => updateLocation('address', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
              value={resumeData.basics?.location?.city || ''}
              onChange={(e) => updateLocation('city', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">State/Region</Label>
            <Input
              id="region"
              placeholder="NY"
              value={resumeData.basics?.location?.region || ''}
              onChange={(e) => updateLocation('region', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="10001"
              value={resumeData.basics?.location?.postalCode || ''}
              onChange={(e) => updateLocation('postalCode', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="countryCode">Country Code</Label>
            <Input
              id="countryCode"
              placeholder="US"
              value={resumeData.basics?.location?.countryCode || ''}
              onChange={(e) => updateLocation('countryCode', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
