import type { Basics, ResumeData } from '@/types'

type Props = {
  basics: Basics
  setResumeData: (data: ResumeData) => void
}

export default function Basic({ basics, setResumeData }: Props) {
  return <div>{basics.name}</div>
}
