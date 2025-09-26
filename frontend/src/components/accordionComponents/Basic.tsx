import type { ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Basic({ resumeData, setResumeData }: Props) {
  const updateBasics = (field: keyof typeof resumeData.basics, value: any) => {
    setResumeData({
      ...resumeData,
      basics: { ...resumeData.basics, [field]: value },
    })
  }

  const updateLocation = (
    field: keyof NonNullable<typeof resumeData.basics.location>,
    value: string,
  ) => {
    setResumeData({
      ...resumeData,
      basics: {
        ...resumeData.basics,
        location: {
          ...resumeData.basics.location,
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
            value={resumeData.basics.name}
            onChange={(e) => updateBasics('name', e.target.value)}
          />
        </div>

        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="label">Professional Title</Label>
          <Input
            id="label"
            placeholder="e.g. Software Engineer"
            value={resumeData.basics.label || ''}
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
            value={resumeData.basics.email || ''}
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
            value={resumeData.basics.phone || ''}
            onChange={(e) => updateBasics('phone', e.target.value)}
          />
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <Label htmlFor="url">Website</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://yourwebsite.com"
            value={resumeData.basics.url || ''}
            onChange={(e) => updateBasics('url', e.target.value)}
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <Label htmlFor="image">Profile Image URL</Label>
          <Input
            id="image"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={resumeData.basics.image || ''}
            onChange={(e) => updateBasics('image', e.target.value)}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          placeholder="Brief description of your professional background and key achievements..."
          value={resumeData.basics.summary || ''}
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
              value={resumeData.basics.location?.address || ''}
              onChange={(e) => updateLocation('address', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
              value={resumeData.basics.location?.city || ''}
              onChange={(e) => updateLocation('city', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">State/Region</Label>
            <Input
              id="region"
              placeholder="NY"
              value={resumeData.basics.location?.region || ''}
              onChange={(e) => updateLocation('region', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="10001"
              value={resumeData.basics.location?.postalCode || ''}
              onChange={(e) => updateLocation('postalCode', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="countryCode">Country Code</Label>
            <Input
              id="countryCode"
              placeholder="US"
              value={resumeData.basics.location?.countryCode || ''}
              onChange={(e) => updateLocation('countryCode', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
