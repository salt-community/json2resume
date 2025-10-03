package salt.backend.services;

import org.springframework.stereotype.Service;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import salt.backend.dto.TranslationRequestDto;
import salt.backend.dto.ResumeDto;
import salt.backend.dto.FileUploadRequestDto;

@Slf4j
@Service
public class TranslationService {
    // The client gets the API key from the environment variable `GOOGLE_API_KEY`.
    private final Client client;
    private final ObjectMapper objectMapper;

    public TranslationService() {
        // Check if API key is available
        String apiKey = System.getenv("GOOGLE_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException(
                "Google API key is required. Please set the GOOGLE_API_KEY environment variable."
            );
        }
        
        this.client = new Client();
        this.objectMapper = new ObjectMapper();
        log.info("🔑 Google Gemini client initialized successfully");
    }

    public ResumeDto translateResume(TranslationRequestDto request) throws Exception {
        try {
            // Convert the resume to JSON string
            String resumeJson = objectMapper.writeValueAsString(request.getResumeData());
            
            // Create the prompt for Gemini AI
            String prompt = buildTranslationPrompt(resumeJson, request.getTargetLanguage());
            
            log.info("📤 Sending translation request to Gemini AI for language: {}", request.getTargetLanguage());
            
            // Send request to Gemini AI
            GenerateContentResponse response = client.models.generateContent(
                "gemini-2.0-flash-exp",
                prompt,
                null
            );
            
            String translatedJson = response.text();
            log.info("📥 Received response from Gemini AI");
            
            // Clean up the response (remove potential markdown formatting)
            translatedJson = cleanJsonResponse(translatedJson);
            
            // Parse the translated JSON back to ResumeDto
            ResumeDto translatedResume = objectMapper.readValue(translatedJson, ResumeDto.class);
            
            log.info("✅ Successfully translated resume to {}", request.getTargetLanguage());
            return translatedResume;
            
        } catch (JsonProcessingException e) {
            log.error("❌ JSON processing error during translation", e);
            throw new Exception("Failed to process JSON during translation: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("❌ Error during AI translation", e);
            throw new Exception("Translation service error: " + e.getMessage(), e);
        }
    }

    private String buildTranslationPrompt(String resumeJson, String languageCode) {
        return String.format("""
            You are a professional resume translator. Translate the following resume JSON data to %s language.
            
            CRITICAL INSTRUCTIONS:
            1. Translate ONLY the text content, preserve ALL field names, structure, dates, URLs, and email addresses
            2. Do NOT translate: field names, email addresses, URLs, phone numbers, dates, or country codes
            3. DO translate: summaries, descriptions, job titles, company names, education details, skills, and other text content
            4. Maintain the exact JSON structure and formatting
            5. Return ONLY the translated JSON, no additional text or markdown formatting
            6. Ensure the output is valid JSON that can be parsed
            7. If a field is null or empty, keep it as null or empty
            8. Do translate SectionHeaders
            Resume JSON to translate:
            %s
            
            Return the translated resume in the same JSON format:
            """, languageCode, resumeJson);
    }

    public ResumeDto convertFileToResume(FileUploadRequestDto request) throws Exception {
        try {
            log.info("📤 Converting {} file to resume JSON", request.getFileType());
            
            // Create the prompt for Gemini AI based on file type
            String prompt = buildFileConversionPrompt(request);
            
            // Send request to Gemini AI with file data
            GenerateContentResponse response = client.models.generateContent(
                "gemini-2.0-flash-exp",
                prompt,
                null
            );
            
            String resumeJson = response.text();
            log.info("📥 Received response from Gemini AI for file conversion");
            
            // Clean up the response (remove potential markdown formatting)
            resumeJson = cleanJsonResponse(resumeJson);
            
            // Parse the JSON back to ResumeDto
            ResumeDto resume = objectMapper.readValue(resumeJson, ResumeDto.class);
            
            log.info("✅ Successfully converted file to resume JSON");
            return resume;
            
        } catch (JsonProcessingException e) {
            log.error("❌ JSON processing error during file conversion", e);
            throw new Exception("Failed to process JSON during file conversion: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("❌ Error during file to resume conversion", e);
            throw new Exception("File conversion service error: " + e.getMessage(), e);
        }
    }

    private String buildFileConversionPrompt(FileUploadRequestDto request) {
        String fileTypeDescription = getFileTypeDescription(request.getFileType());
        
        return String.format("""
            You are a professional resume parser. Convert the following %s file content to JSON Resume format.
            
            CRITICAL INSTRUCTIONS:
            1. Extract ALL relevant information from the file content
            2. Structure the data according to the JSON Resume schema
            3. Use appropriate field names: basics, work, education, skills, etc.
            4. For dates, use YYYY-MM-DD format when possible
            5. For contact info, extract emails, phones, URLs accurately
            6. For work experience, extract company names, positions, dates, descriptions
            7. For education, extract institutions, degrees, dates, courses
            8. For skills, create meaningful skill categories with keywords
            9. If information is missing or unclear, use null or empty strings
            10. Ensure the output is valid JSON that can be parsed
            11. Return ONLY the JSON, no additional text or markdown formatting
            
            File Type: %s
            File Name: %s
            File Content:
            %s
            
            Return the resume in JSON Resume format:
            """, 
            fileTypeDescription, 
            request.getFileType(), 
            request.getFileName(),
            request.getFileData()
        );
    }

    private String getFileTypeDescription(String fileType) {
        if (fileType.startsWith("image/")) {
            return "image (resume photo or scanned document)";
        } else if (fileType.equals("application/pdf")) {
            return "PDF document";
        } else {
            return "document";
        }
    }

    private String cleanJsonResponse(String response) {
        // Remove potential markdown code blocks
        String cleaned = response.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        }
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }
}
