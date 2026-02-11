import type { GlobalDateConfig, SectionDateConfig } from '@/types'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

type DateConfigSectionProps = {
    globalConfig?: GlobalDateConfig
    sectionConfig: SectionDateConfig
    onGlobalChange?: (key: keyof GlobalDateConfig, value: string) => void
    onSectionChange: (key: keyof SectionDateConfig, value: string) => void
    sectionIdPrefix: string
}

export function DateConfigSection({
    globalConfig,
    sectionConfig,
    onGlobalChange,
    onSectionChange,
    sectionIdPrefix,
}: DateConfigSectionProps) {
    const isSwedish = globalConfig?.locale === 'se'

    return (
        <div className="bg-muted/50 p-4 rounded-lg space-y-4 border">
            <h4 className="text-sm font-medium">Date Settings</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Global Settings */}
                {globalConfig && onGlobalChange && (
                    <div className="space-y-4 border-r pr-6">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Global Settings
                        </h5>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Language</Label>
                                <Select
                                    value={globalConfig.locale}
                                    onValueChange={(value: string) => onGlobalChange('locale', value)}
                                >
                                    <SelectTrigger id={`loc-${sectionIdPrefix}`} className="bg-surface">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="se">Swedish</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">
                                    Custom "Present" Text
                                </Label>
                                <Input
                                    id={`present-${sectionIdPrefix}`}
                                    placeholder={isSwedish ? 'nu' : 'present'}
                                    value={globalConfig.presentString || ''}
                                    onChange={(e) => onGlobalChange('presentString', e.target.value)}
                                    className="bg-surface"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Local Settings */}
                <div className="space-y-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Section Settings
                    </h5>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Format</Label>
                        <Select
                            value={sectionConfig.format}
                            onValueChange={(value: string) => onSectionChange('format', value)}
                        >
                            <SelectTrigger id={`fmt-${sectionIdPrefix}`} className="bg-surface">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="YMD">
                                    {isSwedish ? 'YYYY-MM-DD' : 'MM-DD-YYYY'}
                                </SelectItem>
                                <SelectItem value="YM">
                                    {isSwedish ? 'YYYY-MM' : 'MM/YYYY'}
                                </SelectItem>
                                <SelectItem value="YTextM">Month YYYY</SelectItem>
                                <SelectItem value="Y">YYYY</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}
