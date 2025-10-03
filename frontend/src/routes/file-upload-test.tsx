import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FileUploader } from '@/components/FileUpload/FileUploader'
import { useFileConversion } from '@/hooks/useFileConversion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import type { ResumeData } from '@/types'

export const Route = createFileRoute('/file-upload-test')({
  component: FileUploadTestPage,
})

function FileUploadTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [convertedResume, setConvertedResume] = useState<ResumeData | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)

  const fileConversion = useFileConversion()

  const handleFileUpload = (file: File) => {
    setSelectedFile(file)
    setError(null)
    setConvertedResume(null)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setError(null)
    setConvertedResume(null)
  }

  const handleConvert = () => {
    if (!selectedFile) return

    fileConversion.mutate(selectedFile, {
      onSuccess: (resumeData) => {
        setConvertedResume(resumeData)
        setError(null)
      },
      onError: (error) => {
        setError(error.message)
        setConvertedResume(null)
      },
    })
  }

  const handleReset = () => {
    setSelectedFile(null)
    setConvertedResume(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-text-strong">
            File Upload Test
          </h1>
          <p className="text-text-muted">
            Upload an image or PDF of your resume to convert it to JSON format
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>
                Select an image (JPG, PNG) or PDF file of your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                disabled={fileConversion.isPending}
                isLoading={fileConversion.isPending}
              />

              {selectedFile && (
                <div className="space-y-2">
                  <Button
                    onClick={handleConvert}
                    disabled={fileConversion.isPending}
                    className="w-full"
                  >
                    {fileConversion.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      'Convert to JSON'
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={fileConversion.isPending}
                    className="w-full"
                  >
                    Reset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Results</CardTitle>
              <CardDescription>
                View the converted resume data in JSON format
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fileConversion.isPending && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-text-muted">
                    Processing file...
                  </span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {convertedResume && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    File converted successfully! Scroll down to view the JSON
                    data.
                  </AlertDescription>
                </Alert>
              )}

              {!fileConversion.isPending && !error && !convertedResume && (
                <div className="text-center py-8 text-text-muted">
                  Upload a file to see the conversion results here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* JSON Output */}
        {convertedResume && (
          <Card>
            <CardHeader>
              <CardTitle>Converted Resume JSON</CardTitle>
              <CardDescription>
                The extracted resume data in JSON Resume format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-surface-strong p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {JSON.stringify(convertedResume, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ol className="list-decimal list-inside space-y-1 text-sm text-text-muted">
              <li>Upload an image (JPG, PNG) or PDF file of your resume</li>
              <li>Click "Convert to JSON" to process the file with AI</li>
              <li>View the extracted resume data in JSON format below</li>
              <li>
                The AI will extract information like name, contact details, work
                experience, education, and skills
              </li>
              <li>You can then use this JSON data in the main editor</li>
            </ol>
            <div className="mt-4 p-3 bg-surface-strong rounded-lg">
              <p className="text-sm font-medium text-text-strong mb-1">
                Supported File Types:
              </p>
              <ul className="text-sm text-text-muted space-y-1">
                <li>• Images: JPG, PNG (up to 10MB)</li>
                <li>• Documents: PDF (up to 10MB)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
