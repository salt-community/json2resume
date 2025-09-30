package salt.backend.e2e;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.*;
import salt.backend.dto.ResumeDto;
import salt.backend.dto.TranslationRequestDto;
import salt.backend.services.TranslationService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiContractE2ETest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void translate_MinimalValidRequest_ReturnsExpectedSchema() throws Exception {
        // Arrange: minimal valid request with only basics.name
        String requestJson = """
            {
              "resumeData": {
                "basics": { "name": "John Doe" }
              },
              "targetLanguage": "es"
            }
            """;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.POST,
                new HttpEntity<>(requestJson, headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getHeaders().getContentType().isCompatibleWith(MediaType.APPLICATION_JSON));

        JsonNode body = objectMapper.readTree(response.getBody());
        assertTrue(body.has("basics"));
        assertEquals("John Doe", body.at("/basics/name").asText());

        // Optional sections may be absent or explicitly null when not provided
        assertTrue(isMissingOrNull(body, "skills"));
        assertTrue(isMissingOrNull(body, "work"));
        assertTrue(isMissingOrNull(body, "projects"));
        assertTrue(isMissingOrNull(body, "education"));
    }

    @Test
    void translate_UnknownFieldsAreIgnored_NotPresentInResponse() throws Exception {
        // Arrange: add unknown fields at various levels
        String requestJson = """
            {
              "resumeData": {
                "basics": {
                  "name": "Jane Smith",
                  "unknownBasicsField": "shouldBeIgnored"
                },
                "unknownRootResumeField": 123
              },
              "targetLanguage": "fr",
              "unknownTopLevel": true
            }
            """;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.POST,
                new HttpEntity<>(requestJson, headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        JsonNode body = objectMapper.readTree(response.getBody());

        // Known fields present
        assertEquals("Jane Smith", body.at("/basics/name").asText());

        // Unknown fields should not be present in the response schema
        assertTrue(body.at("/basics/unknownBasicsField").isMissingNode());
        assertTrue(body.at("/unknownRootResumeField").isMissingNode());
        assertTrue(body.at("/unknownTopLevel").isMissingNode());
    }

    @Test
    void translate_InvalidJson_ReturnsBadRequest() {
        // Arrange
        String invalidJson = "{ invalid json }";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.POST,
                new HttpEntity<>(invalidJson, headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void translate_WrongContentType_ReturnsUnsupportedMediaType() {
        // Arrange
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.POST,
                new HttpEntity<>("plain text", headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, response.getStatusCode());
    }

    @Test
    void translate_MissingResumeData_ReturnsBadRequest() {
        // Arrange
        String requestJson = """
            {
              "resumeData": null,
              "targetLanguage": "es"
            }
            """;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.POST,
                new HttpEntity<>(requestJson, headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void translate_MissingTargetLanguage_ReturnsBadRequest() {
        // Arrange
        String requestJson = """
            {
              "resumeData": { "basics": { "name": "John Doe" } },
              "targetLanguage": null
            }
            """;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.POST,
                new HttpEntity<>(requestJson, headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void translate_EmptyTargetLanguage_ReturnsBadRequest() {
        // Arrange
        String requestJson = """
            {
              "resumeData": { "basics": { "name": "John Doe" } },
              "targetLanguage": ""
            }
            """;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.POST,
                new HttpEntity<>(requestJson, headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void translate_ArraysAndNestedTypes_ArePreserved() throws Exception {
        // Arrange: include arrays and nested structures
        String requestJson = """
            {
              "resumeData": {
                "basics": { "name": "Alex Dev", "email": "alex@example.com" },
                "work": [
                  { "name": "Acme Inc", "position": "Engineer", "startDate": "2022-01" },
                  { "name": "Beta LLC", "position": "Senior Engineer", "startDate": "2023-03" }
                ],
                "skills": [
                  { "name": "Java", "level": "Expert", "keywords": ["Spring", "Maven"] },
                  { "name": "JavaScript", "level": "Advanced", "keywords": ["React", "TypeScript"] }
                ]
              },
              "targetLanguage": "de"
            }
            """;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.POST,
                new HttpEntity<>(requestJson, headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        JsonNode body = objectMapper.readTree(response.getBody());

        // Basics preserved
        assertEquals("Alex Dev", body.at("/basics/name").asText());
        assertEquals("alex@example.com", body.at("/basics/email").asText());

        // Arrays preserved with correct lengths
        assertTrue(body.at("/work").isArray());
        assertEquals(2, body.at("/work").size());
        assertEquals("Engineer", body.at("/work/0/position").asText());

        assertTrue(body.at("/skills").isArray());
        assertEquals(2, body.at("/skills").size());
        assertEquals("Java", body.at("/skills/0/name").asText());
        assertTrue(body.at("/skills/0/keywords").isArray());
        assertEquals(2, body.at("/skills/0/keywords").size());
    }

    // Helper: returns true if a direct child field is absent or explicitly null
    private static boolean isMissingOrNull(JsonNode node, String field) {
        JsonNode child = node.get(field);
        return child == null || child.isNull();
    }

    @TestConfiguration
    static class StubbedTranslationServiceConfig {
        @Bean
        @Primary
        TranslationService translationService() throws Exception {
            TranslationService mockService = mock(TranslationService.class);
            when(mockService.translateResume(any(TranslationRequestDto.class)))
                    .thenAnswer(invocation -> {
                        TranslationRequestDto req = invocation.getArgument(0);
                        if (req == null || req.getResumeData() == null || req.getTargetLanguage() == null
                                || (req.getTargetLanguage() instanceof String s && s.isEmpty())) {
                            throw new IllegalArgumentException("Invalid request");
                        }
                        // Echo back the resumeData as the "translated" resume to validate contract shape
                        return req.getResumeData();
                    });
            return mockService;
        }
    }
}
