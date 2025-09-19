package salt.backend.services;

import org.springframework.stereotype.Service;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import salt.backend.dto.TranslationRequestDto;
import salt.backend.dto.ResumeDto;

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
            String resumeJson = objectMapper.writeValueAsString(request.getResume());
            
            // Create the prompt for Gemini AI
            String prompt = buildTranslationPrompt(resumeJson, request.getLanguageCode());
            
            log.info("📤 Sending translation request to Gemini AI for language: {}", request.getLanguageCode());
            
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
            
            log.info("✅ Successfully translated resume to {}", request.getLanguageCode());
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
            
            Resume JSON to translate:
            %s
            
            Return the translated resume in the same JSON format:
            """, languageCode, resumeJson);
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
