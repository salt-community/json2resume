import { Checkbox } from '../ui/checkbox'
import type { Basics } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  basics: Basics
  setBasics: (data: Basics) => void
}

export default function Basic({ basics, setBasics }: Props) {
  return (
    <div className="p-2">
      <div className="grid w-full max-w-sm items-center gap-3">
        <div className="flex items-center gap-2">
          <Checkbox id="email" />
          <Label htmlFor="email">Name</Label>
        </div>
        <Input type="email" id="email" placeholder="Name" />
      </div>
    </div>
  )
}
