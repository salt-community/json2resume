import { createFileRoute } from '@tanstack/react-router'
import { LinkedinImporterTest } from '@/components/LinkedinImport'

export const Route = createFileRoute('/linkedin-test')({
  component: LinkedinImporterTest,
})
