import type { DateConfig } from '@/types'
import { Label } from '@/components/ui/label'

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
    return (
        <div className="bg-muted/50 p-4 rounded-lg space-y-4 border">
            <h4 className="text-sm font-medium">Date Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Format</Label>
                    <div className="flex flex-col space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`fmt-${sectionIdPrefix}-ymd`}
                                name={`${sectionIdPrefix}-fmt`}
                                value="YMD"
                                checked={config.format === 'YMD'}
                                onChange={(e) => onConfigChange('format', e.target.value)}
                                className="accent-primary"
                            />
                            <Label
                                htmlFor={`fmt-${sectionIdPrefix}-ymd`}
                                className="font-normal cursor-pointer"
                            >
                                Year, Month, Day
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`fmt-${sectionIdPrefix}-ym`}
                                name={`${sectionIdPrefix}-fmt`}
                                value="YM"
                                checked={config.format === 'YM'}
                                onChange={(e) => onConfigChange('format', e.target.value)}
                                className="accent-primary"
                            />
                            <Label
                                htmlFor={`fmt-${sectionIdPrefix}-ym`}
                                className="font-normal cursor-pointer"
                            >
                                Year, Month
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`fmt-${sectionIdPrefix}-y`}
                                name={`${sectionIdPrefix}-fmt`}
                                value="Y"
                                checked={config.format === 'Y'}
                                onChange={(e) => onConfigChange('format', e.target.value)}
                                className="accent-primary"
                            />
                            <Label
                                htmlFor={`fmt-${sectionIdPrefix}-y`}
                                className="font-normal cursor-pointer"
                            >
                                Year
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`fmt-${sectionIdPrefix}-ytm`}
                                name={`${sectionIdPrefix}-fmt`}
                                value="YTextM"
                                checked={config.format === 'YTextM'}
                                onChange={(e) => onConfigChange('format', e.target.value)}
                                className="accent-primary"
                            />
                            <Label
                                htmlFor={`fmt-${sectionIdPrefix}-ytm`}
                                className="font-normal cursor-pointer"
                            >
                                Year, Text(Month)
                            </Label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Locale</Label>
                    <div className="flex flex-col space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`loc-${sectionIdPrefix}-se`}
                                name={`${sectionIdPrefix}-loc`}
                                value="se"
                                checked={config.locale === 'se'}
                                onChange={(e) => onConfigChange('locale', e.target.value)}
                                className="accent-primary"
                            />
                            <Label
                                htmlFor={`loc-${sectionIdPrefix}-se`}
                                className="font-normal cursor-pointer"
                            >
                                Swedish (YYYY-MM-DD)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`loc-${sectionIdPrefix}-en`}
                                name={`${sectionIdPrefix}-loc`}
                                value="en"
                                checked={config.locale === 'en'}
                                onChange={(e) => onConfigChange('locale', e.target.value)}
                                className="accent-primary"
                            />
                            <Label
                                htmlFor={`loc-${sectionIdPrefix}-en`}
                                className="font-normal cursor-pointer"
                            >
                                English (MM-DD-YYYY)
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
