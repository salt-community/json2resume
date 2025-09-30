package salt.backend.e2e;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import salt.backend.dto.ResumeDto;
import salt.backend.dto.TranslationRequestDto;
import salt.backend.services.TranslationService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ResumeControllerE2ETest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void health_E2E_ShouldReturnOkWithMessage() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/health", String.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Resume Translation API is running", response.getBody());
    }

    @Test
    void translate_E2E_WithValidRequest_ShouldReturnTranslatedResume() {
        // Arrange: minimal realistic request similar to what the frontend would send
        ResumeDto resume = ResumeDto.builder()
                .basics(ResumeDto.Basics.builder()
                        .name("John Doe")
                        .email("john.doe@example.com")
                        .summary("Experienced software developer")
                        .build())
                .build();

        TranslationRequestDto request = TranslationRequestDto.builder()
                .resumeData(resume)
                .targetLanguage("es")
                .build();

        // Act
        ResponseEntity<ResumeDto> response =
                restTemplate.postForEntity("/api/translate", request, ResumeDto.class);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getBasics());
        assertEquals("Translated: John Doe", response.getBody().getBasics().getName());
        assertEquals("Translated to es", response.getBody().getBasics().getSummary());
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

                        // Return a deterministic "translated" resume for assertions
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
