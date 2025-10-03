import { useMutation } from '@tanstack/react-query'
import {
  convertFile,
  type FileConversionRequest,
} from '@/services/fileConversionService'
import type { ResumeData } from '@/types'

export function useFileConversion() {
  return useMutation<ResumeData, Error, File>({
    mutationFn: convertFile,
    onSuccess: (data) => {
      console.log('File conversion successful:', data)
    },
    onError: (error) => {
      console.error('File conversion failed:', error)
    },
  })
}

export function useFileConversionWithRequest() {
  return useMutation<ResumeData, Error, FileConversionRequest>({
    mutationFn: async (request) => {
      const { convertFileToResume } = await import(
        '@/services/fileConversionService'
      )
      return convertFileToResume(request)
    },
    onSuccess: (data) => {
      console.log('File conversion successful:', data)
    },
    onError: (error) => {
      console.error('File conversion failed:', error)
    },
  })
}
