package salt.backend.services;

import org.springframework.stereotype.Service;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import salt.backend.dto.TranslationRequestDto;
import salt.backend.dto.ResumeDto;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class TranslationService {
    private final List<String> apiKeys;
    private final AtomicInteger keyIndex;
    private final ObjectMapper objectMapper;

    public TranslationService() {
        // Load all API keys from environment variables
        this.apiKeys = loadApiKeys();
        
        if (apiKeys.isEmpty()) {
            throw new IllegalStateException(
                "At least one Google API key is required. Please set at least one of: " +
                "GOOGLE_API_KEY, GOOGLE_API_KEY_TWO, GOOGLE_API_KEY_THREE, GOOGLE_API_KEY_FOUR"
            );
        }
        
        this.keyIndex = new AtomicInteger(0);
        this.objectMapper = new ObjectMapper();
        log.info("🔑 Google Gemini client initialized with {} API key(s)", apiKeys.size());
    }
    
    private List<String> loadApiKeys() {
        List<String> keys = new ArrayList<>();
        String[] envVarNames = {
            "GOOGLE_API_KEY",
            "GOOGLE_API_KEY_TWO",
            "GOOGLE_API_KEY_THREE",
            "GOOGLE_API_KEY_FOUR"
        };
        
        for (String envVarName : envVarNames) {
            String apiKey = System.getenv(envVarName);
            if (apiKey != null && !apiKey.trim().isEmpty()) {
                keys.add(apiKey.trim());
                log.debug("Loaded API key from {}", envVarName);
            }
        }
        
        return keys;
    }

    public ResumeDto translateResume(TranslationRequestDto request) throws Exception {
        // Convert the resume to JSON string
        String resumeJson = objectMapper.writeValueAsString(request.getResumeData());
        
        // Create the prompt for Gemini AI
        String prompt = buildTranslationPrompt(resumeJson, request.getTargetLanguage());
        
        log.info("📤 Sending translation request to Gemini AI for language: {}", request.getTargetLanguage());
        
        // Get the starting key index for this request (round-robin)
        int startIndex = keyIndex.getAndIncrement() % apiKeys.size();
        
        // Try all API keys starting from the round-robin index, wrapping around if needed
        Exception lastException = null;
        int attempts = 0;
        
        for (int i = 0; i < apiKeys.size(); i++) {
            // Calculate the actual index to use (wrapping around)
            int currentIndex = (startIndex + i) % apiKeys.size();
            String apiKey = apiKeys.get(currentIndex);
            
            try {
                log.debug("Attempting translation with API key index: {} (attempt {}/{})", 
                    currentIndex, i + 1, apiKeys.size());
                
                // Create a new client with the current API key
                Client client = Client.builder()
                    .apiKey(apiKey)
                    .build();
                
                // Send request to Gemini AI
                GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash",
                    prompt,
                    null
                );
                
                String translatedJson = response.text();
                log.info("📥 Received response from Gemini AI (using key index: {})", currentIndex);
                
                // Clean up the response (remove potential markdown formatting)
                translatedJson = cleanJsonResponse(translatedJson);
                
                // Parse the translated JSON back to ResumeDto
                ResumeDto translatedResume = objectMapper.readValue(translatedJson, ResumeDto.class);
                
                log.info("✅ Successfully translated resume to {} (using key index: {})", 
                    request.getTargetLanguage(), currentIndex);
                return translatedResume;
                
            } catch (JsonProcessingException e) {
                // JSON processing errors are not related to API key, don't retry
                log.error("❌ JSON processing error during translation", e);
                throw new Exception("Failed to process JSON during translation: " + e.getMessage(), e);
            } catch (Exception e) {
                attempts++;
                lastException = e;
                log.warn("❌ Translation attempt {} failed with API key index {}: {}", 
                    attempts, currentIndex, e.getMessage());
                
                // If this was the last key, break and throw error
                if (i == apiKeys.size() - 1) {
                    break;
                }
                
                // Otherwise, try next key
                log.info("🔄 Retrying with next API key...");
            }
        }
        
        // All keys failed
        log.error("❌ All {} API key(s) exhausted. Translation failed.", apiKeys.size());
        throw new Exception(
            "Translation service error: All API keys failed after " + attempts + " attempt(s). " +
            "Last error: " + (lastException != null ? lastException.getMessage() : "Unknown error"),
            lastException
        );
    }

    private String buildTranslationPrompt(String resumeJson, String languageCode) {
        return String.format("""
            You are a professional resume translator. Translate the following resume JSON data to %s language.
            
            CRITICAL INSTRUCTIONS:
            1. Translate ONLY the text content, preserve ALL field names, structure, dates, URLs, and email addresses
            2. Do NOT translate: field names, company names, email addresses, URLs, phone numbers, dates, or country codes
            3. DO translate: summaries, descriptions, job titles, education details, skills, and other text content
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
