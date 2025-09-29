# LinkedIn Importer Component

This component allows users to import LinkedIn data export files (ZIP or CSV) and convert them into the JSON Resume format used by this application.

## Features

- **Drag & Drop Support**: Users can drag and drop ZIP files or multiple CSV files
- **File Browser**: Click to browse and select files
- **ZIP Processing**: Automatically extracts and processes all CSV files from LinkedIn ZIP exports
- **CSV Parsing**: Uses Papa Parse for robust CSV parsing with header normalization
- **Data Mapping**: Intelligently maps LinkedIn CSV filenames to logical collection keys
- **Resume Conversion**: Converts LinkedIn data to JSON Resume format
- **Preview**: Shows parsed data and converted resume data
- **Export Options**: Download raw JSON or import directly to resume editor
- **Privacy**: All processing happens locally in the browser

## Dependencies

Before using this component, install the required dependencies:

```bash
npm install papaparse jszip @types/papaparse
```

## Usage

The component is integrated into the main accordion interface. Users can:

1. Navigate to the "LinkedIn Import" section
2. Upload their LinkedIn data export (ZIP file) or individual CSV files
3. Preview the parsed data
4. Import the data directly to the resume editor or download as JSON

## Supported File Types

- **ZIP files**: LinkedIn data export ZIP files containing multiple CSV files
- **CSV files**: Individual CSV files from LinkedIn exports

## Data Mapping

The component maps LinkedIn CSV filenames to logical collections:

- `position*` or `experience*` → `positions`
- `education*` → `education`
- `skill*` → `skills`
- `language*` → `languages`
- `certification*` → `certifications`
- `project*` → `projects`
- `course*` → `courses`
- `accomplishment*` → `accomplishments`
- `recommendation*` → `recommendations`
- `connection*` → `connections`
- `profile*` → `profile`

## Data Conversion

The component converts LinkedIn data to JSON Resume format:

- **Profile data** → `basics` section
- **Positions** → `work` section
- **Education** → `education` section
- **Skills** → `skills` section
- **Languages** → `languages` section
- **Certifications** → `certificates` section
- **Projects** → `projects` section

## Error Handling

- Invalid file types are ignored with user feedback
- CSV parsing errors are logged and displayed
- Network errors are handled gracefully
- All errors are shown in the activity log

## Privacy & Security

- All data processing happens locally in the browser
- No data is sent to external servers
- Files are processed in memory and not stored
- Users maintain full control over their data
