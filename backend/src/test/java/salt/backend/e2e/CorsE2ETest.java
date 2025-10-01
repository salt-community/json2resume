package salt.backend.e2e;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import salt.backend.dto.ResumeDto;
import salt.backend.dto.TranslationRequestDto;
import salt.backend.services.TranslationService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CorsE2ETest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Value("${cors.allowed-origins}")
    private static String FRONTEND_ORIGIN;
    private static final String BLOCKED_ORIGIN = "http://localhost:3001";

    @Test
    void preflight_Translate_AllowsPostAndContentType() {
        // Arrange
        HttpHeaders headers = new HttpHeaders();
        headers.add("Origin", FRONTEND_ORIGIN);
        headers.add("Access-Control-Request-Method", "POST");
        headers.add("Access-Control-Request-Headers", "Content-Type");

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.OPTIONS,
                new HttpEntity<>(headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        HttpHeaders resp = response.getHeaders();
        assertEquals(FRONTEND_ORIGIN, resp.getFirst("Access-Control-Allow-Origin"));
        String allowMethods = resp.getFirst("Access-Control-Allow-Methods");
        assertNotNull(allowMethods);
        assertTrue(allowMethods.contains("POST"));
        String allowHeaders = resp.getFirst("Access-Control-Allow-Headers");
        assertNotNull(allowHeaders);
        assertTrue(allowHeaders.toLowerCase().contains("content-type"));
    }

    @Test
    void preflight_Health_AllowsGet() {
        // Arrange
        HttpHeaders headers = new HttpHeaders();
        headers.add("Origin", FRONTEND_ORIGIN);
        headers.add("Access-Control-Request-Method", "GET");

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/health",
                HttpMethod.OPTIONS,
                new HttpEntity<>(headers),
                String.class
        );

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        HttpHeaders resp = response.getHeaders();
        assertEquals(FRONTEND_ORIGIN, resp.getFirst("Access-Control-Allow-Origin"));
        String allowMethods = resp.getFirst("Access-Control-Allow-Methods");
        assertNotNull(allowMethods);
        assertTrue(allowMethods.contains("GET"));
    }

    @Test
    void simpleRequest_Translate_IncludesCorsHeader() {
        // Arrange: minimal request with Origin header
        ResumeDto resume = ResumeDto.builder()
                .basics(ResumeDto.Basics.builder()
                        .name("John Doe")
                        .email("john.doe@example.com")
                        .summary("Experienced software developer")
                        .build())
                .build();

        TranslationRequestDto reqBody = TranslationRequestDto.builder()
                .resumeData(resume)
                .targetLanguage("es")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("Origin", FRONTEND_ORIGIN);

        // Act
        ResponseEntity<ResumeDto> response = restTemplate.postForEntity(
                "/api/translate",
                new HttpEntity<>(reqBody, headers),
                ResumeDto.class
        );

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(FRONTEND_ORIGIN, response.getHeaders().getFirst("Access-Control-Allow-Origin"));
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getBasics());
        assertEquals("Translated: John Doe", response.getBody().getBasics().getName());
        assertEquals("Translated to es", response.getBody().getBasics().getSummary());
    }

    @Test
    void preflight_Translate_DisallowedOrigin_ShouldBeForbidden() {
        // Arrange
        HttpHeaders headers = new HttpHeaders();
        headers.add("Origin", BLOCKED_ORIGIN);
        headers.add("Access-Control-Request-Method", "POST");
        headers.add("Access-Control-Request-Headers", "Content-Type");

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/translate",
                HttpMethod.OPTIONS,
                new HttpEntity<>(headers),
                String.class
        );

        // Assert
        // For disallowed origins, Spring typically returns 403 for preflight
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        // And should not include Access-Control-Allow-* headers
        assertNull(response.getHeaders().getFirst("Access-Control-Allow-Origin"));
        assertNull(response.getHeaders().getFirst("Access-Control-Allow-Methods"));
        assertNull(response.getHeaders().getFirst("Access-Control-Allow-Headers"));
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
                        String originalName = req.getResumeData() != null
                                && req.getResumeData().getBasics() != null
                                && req.getResumeData().getBasics().getName() != null
                                ? req.getResumeData().getBasics().getName()
                                : "Unknown";

                        String lang = req.getTargetLanguage() != null ? req.getTargetLanguage() : "unknown";

                        return ResumeDto.builder()
                                .basics(ResumeDto.Basics.builder()
                                        .name("Translated: " + originalName)
                                        .summary("Translated to " + lang)
                                        .build())
                                .build();
                    });
            return mockService;
        }
    }
}
