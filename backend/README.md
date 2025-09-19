# JSON to Resume Translation Backend

A Spring Boot backend service that translates resume data using Google Gemini AI while preserving the JSON Resume schema structure.

## 🚀 Quick Start

### Prerequisites

- Java 21 or higher
- Maven 3.6+
- Google Gemini API Key

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Set Environment Variable

The application requires a Google Gemini API key. Set it as an environment variable:

**Windows (Command Prompt):**

```cmd
set GOOGLE_API_KEY=your_actual_api_key_here
```

**Windows (PowerShell):**

```powershell
$env:GOOGLE_API_KEY="your_actual_api_key_here"
```

**macOS/Linux:**

```bash
export GOOGLE_API_KEY=your_actual_api_key_here
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## 📋 API Endpoints

### Health Check

```
GET /api/health
```

### Translate Resume

```
POST /api/translate
Content-Type: application/json
```

## 🧪 Example Requests

### cURL Example

```bash
curl -X POST http://localhost:8080/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "resume": {
      "basics": {
        "name": "John Doe",
        "label": "Software Engineer",
        "email": "john@example.com",
        "summary": "Experienced software developer with expertise in web technologies"
      },
      "work": [{
        "name": "Tech Company",
        "position": "Senior Developer",
        "summary": "Led development of web applications",
        "highlights": ["Improved performance by 40%", "Mentored junior developers"]
      }],
      "skills": [{
        "name": "Programming",
        "keywords": ["JavaScript", "Python", "Java"]
      }]
    },
    "languageCode": "Spanish"
  }'
```

### Postman Collection

#### 1. Health Check

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/health`

#### 2. Translate Resume

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/translate`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "resume": {
      "basics": {
        "name": "John Doe",
        "label": "Software Engineer",
        "email": "john@example.com",
        "phone": "(555) 123-4567",
        "summary": "Experienced software developer with expertise in web technologies",
        "location": {
          "city": "San Francisco",
          "region": "California",
          "countryCode": "US"
        }
      },
      "work": [
        {
          "name": "Tech Company",
          "position": "Senior Developer",
          "startDate": "2020-01-01",
          "summary": "Led development of web applications",
          "highlights": ["Improved application performance by 40%", "Mentored 5 junior developers"]
        }
      ],
      "education": [
        {
          "institution": "University of Technology",
          "area": "Computer Science",
          "studyType": "Bachelor",
          "startDate": "2016-09-01",
          "endDate": "2020-05-01"
        }
      ],
      "skills": [
        {
          "name": "Programming Languages",
          "keywords": ["JavaScript", "Python", "Java", "TypeScript"]
        }
      ]
    },
    "languageCode": "Spanish"
  }
  ```

## 🔧 Configuration

### Environment Variables

- `GOOGLE_API_KEY` - Your Google Gemini API key (required)

### Application Properties

Located in `src/main/resources/application.properties`:

```properties
spring.application.name=backend
```

## 🏗️ Project Structure

```
src/
├── main/
│   ├── java/salt/backend/
│   │   ├── BackendApplication.java
│   │   ├── controller/
│   │   │   └── ResumeController.java
│   │   ├── dto/
│   │   │   ├── ResumeDto.java
│   │   │   └── TranslationRequestDto.java
│   │   └── services/
│   │       └── TranslationService.java
│   └── resources/
│       └── application.properties
└── test/
```

## 📝 Translation Behavior

The AI translation service:

✅ **Translates:**

- Job titles and descriptions
- Summaries and highlights
- Company names
- Education details
- Skills and interests

❌ **Preserves:**

- Field names and JSON structure
- Email addresses and URLs
- Phone numbers and dates
- Country codes

## 🐛 Troubleshooting

### Common Issues

1. **"API key must be provided"**

   - Ensure `GOOGLE_API_KEY` environment variable is set
   - Restart your terminal/IDE after setting the environment variable

2. **Application won't start**

   - Check Java version: `java -version` (requires Java 21+)
   - Check Maven version: `mvn -version`

3. **Compilation errors**
   - Run `mvn clean compile` to rebuild the project

### Build Commands

```bash
# Clean and compile
mvn clean compile

# Run tests
mvn test

# Package application
mvn package

# Run with different profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## 🔗 API Response Example

**Request:**

```json
{
  "resume": {
    "basics": {
      "name": "John Doe",
      "summary": "Software developer"
    }
  },
  "languageCode": "Spanish"
}
```

**Response:**

```json
{
  "basics": {
    "name": "John Doe",
    "summary": "Desarrollador de software"
  }
}
```
