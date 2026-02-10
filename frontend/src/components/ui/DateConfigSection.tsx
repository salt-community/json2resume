import type { DateConfig } from '@/types'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type DateConfigSectionProps = {
    config: DateConfig
    onConfigChange: (key: keyof DateConfig, value: string) => void
    sectionIdPrefix: string // e.g., 'education', 'work' to ensure unique IDs
}

export function DateConfigSection({
    config,
    onConfigChange,
    sectionIdPrefix,
}: DateConfigSectionProps) {
    const isSwedish = config.locale === 'se'

    return (
        <div className="bg-muted/50 p-4 rounded-lg space-y-4 border">
            <h4 className="text-sm font-medium">Date Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Language</Label>
                    <div className="flex flex-col space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                            <Select
                                value={config.locale}
                                onValueChange={(value: string) => onConfigChange('locale', value)}
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
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Format</Label>
                    <Select
                        value={config.format}
                        onValueChange={(value: string) => onConfigChange('format', value)}
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
    )
}
