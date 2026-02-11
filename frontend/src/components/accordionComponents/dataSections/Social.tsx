import type { Profile, ResumeData } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export default function Social({ resumeData, setResumeData }: Props) {
  const updateBasics = (
    field: keyof NonNullable<typeof resumeData.basics>,
    value: any,
  ) => {
    setResumeData({
      ...resumeData,
      basics: {
        ...resumeData.basics,
        enabled: resumeData.basics?.enabled ?? true,
        [field]: value,
      },
    })
  }

  const updateMetaSocial = (field: 'network' | 'username', value: string) => {
    setResumeData({
      ...resumeData,
      meta: {
        ...resumeData.meta,
        social: {
          enabled: resumeData.meta?.social?.enabled ?? true,
          ...resumeData.meta?.social,
          website: {
            ...resumeData.meta?.social?.website,
            [field]: value,
          },
        },
      },
    })
  }

  const addProfile = () => {
    const newProfile: Profile = {
      network: '',
      username: '',
      url: '',
      enabled: true,
    }
    setResumeData({
      ...resumeData,
      basics: {
        ...resumeData.basics,
        enabled: resumeData.basics?.enabled ?? true,
        profiles: [...(resumeData.basics?.profiles || []), newProfile],
      },
    })
  }

  const updateProfile = (
    index: number,
    field: keyof Profile,
    value: string,
  ) => {
    const updatedProfiles = [...(resumeData.basics?.profiles || [])]
    updatedProfiles[index] = { ...updatedProfiles[index], [field]: value }
    setResumeData({
      ...resumeData,
      basics: {
        ...resumeData.basics,
        enabled: resumeData.basics?.enabled ?? true,
        profiles: updatedProfiles,
      },
    })
  }

  const removeProfile = (index: number) => {
    const updatedProfiles = (resumeData.basics?.profiles || []).filter(
      (_, i) => i !== index,
    )
    setResumeData({
      ...resumeData,
      basics: {
        ...resumeData.basics,
        enabled: resumeData.basics?.enabled ?? true,
        profiles: updatedProfiles,
      },
    })
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Website</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Network */}
          <div className="space-y-2">
            <Label htmlFor="website-network">Network</Label>
            <Input
              id="website-network"
              placeholder="e.g. Portfolio"
              value={resumeData.meta?.social?.website?.network || ''}
              onChange={(e) => updateMetaSocial('network', e.target.value)}
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="website-username">Username</Label>
            <Input
              id="website-username"
              placeholder="your-username"
              value={resumeData.meta?.social?.website?.username || ''}
              onChange={(e) => updateMetaSocial('username', e.target.value)}
            />
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://yourwebsite.com"
              value={resumeData.basics?.url || ''}
              onChange={(e) => updateBasics('url', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Profiles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Social Profiles</h3>
        </div>

        {resumeData.basics?.profiles &&
        resumeData.basics.profiles.length > 0 ? (
          <div className="space-y-4">
            {resumeData.basics.profiles.map((profile, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Profile {index + 1}</h4>
                  <Button
                    onClick={() => removeProfile(index)}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`profile-network-${index}`}>Network</Label>
                    <Input
                      id={`profile-network-${index}`}
                      placeholder="e.g. LinkedIn, GitHub, Twitter"
                      value={profile.network || ''}
                      onChange={(e) =>
                        updateProfile(index, 'network', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`profile-username-${index}`}>
                      Username
                    </Label>
                    <Input
                      id={`profile-username-${index}`}
                      placeholder="your-username"
                      value={profile.username || ''}
                      onChange={(e) =>
                        updateProfile(index, 'username', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`profile-url-${index}`}>URL</Label>
                    <Input
                      id={`profile-url-${index}`}
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={profile.url || ''}
                      onChange={(e) =>
                        updateProfile(index, 'url', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No profiles added yet.</p>
            <p className="text-sm">Click "Add Profile" to get started.</p>
          </div>
        )}

        <div className="flex flex-row-reverse">
          <Button onClick={addProfile} size="sm">
            Add Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
