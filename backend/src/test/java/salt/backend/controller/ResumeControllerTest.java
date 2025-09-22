package salt.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import salt.backend.dto.ResumeDto;
import salt.backend.dto.TranslationRequestDto;
import salt.backend.services.TranslationService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for ResumeController.
 * Tests all endpoints and various scenarios including success cases, validation errors, and exceptions.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TranslationService translationService;

    @Autowired
    private ObjectMapper objectMapper;

    private ResumeDto sampleResume;
    private TranslationRequestDto validRequest;

    @BeforeEach
    void setUp() {
        // Create a sample resume for testing
        sampleResume = ResumeDto.builder()
                .basics(ResumeDto.Basics.builder()
                        .name("John Doe")
                        .email("john.doe@example.com")
                        .phone("+1-555-0123")
                        .summary("Experienced software developer")
                        .location(ResumeDto.Location.builder()
                                .city("New York")
                                .countryCode("US")
                                .build())
                        .build())
                .work(List.of(ResumeDto.Work.builder()
                        .name("Tech Corp")
                        .position("Senior Developer")
                        .startDate("2020-01")
                        .summary("Led development of microservices")
                        .build()))
                .skills(List.of(ResumeDto.Skill.builder()
                        .name("Java")
                        .level("Expert")
                        .build()))
                .build();

        validRequest = TranslationRequestDto.builder()
                .resume(sampleResume)
                .languageCode("es")
                .build();
    }

    @Test
    void translateResume_WithValidRequest_ShouldReturnTranslatedResume() throws Exception {
        // Arrange
        ResumeDto translatedResume = ResumeDto.builder()
                .basics(ResumeDto.Basics.builder()
                        .name("Juan Pérez")
                        .email("juan.perez@ejemplo.com")
                        .phone("+1-555-0123")
                        .summary("Desarrollador de software experimentado")
                        .location(ResumeDto.Location.builder()
                                .city("Nueva York")
                                .countryCode("US")
                                .build())
                        .build())
                .work(List.of(ResumeDto.Work.builder()
                        .name("Tech Corp")
                        .position("Desarrollador Senior")
                        .startDate("2020-01")
                        .summary("Lideró el desarrollo de microservicios")
                        .build()))
                .skills(List.of(ResumeDto.Skill.builder()
                        .name("Java")
                        .level("Experto")
                        .build()))
                .build();

        when(translationService.translateResume(any(TranslationRequestDto.class)))
                .thenReturn(translatedResume);

        // Act & Assert
        mockMvc.perform(post("/api/translate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.basics.name").value("Juan Pérez"))
                .andExpect(jsonPath("$.basics.summary").value("Desarrollador de software experimentado"))
                .andExpect(jsonPath("$.work[0].position").value("Desarrollador Senior"))
                .andExpect(jsonPath("$.skills[0].level").value("Experto"));

        verify(translationService, times(1)).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void translateResume_WithEmptyResume_ShouldReturnBadRequest() throws Exception {
        // Arrange
        TranslationRequestDto invalidRequest = TranslationRequestDto.builder()
                .resume(null)
                .languageCode("es")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/translate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(translationService, never()).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void translateResume_WithEmptyLanguageCode_ShouldReturnBadRequest() throws Exception {
        // Arrange
        TranslationRequestDto invalidRequest = TranslationRequestDto.builder()
                .resume(sampleResume)
                .languageCode("")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/translate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(translationService, never()).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void translateResume_WithNullLanguageCode_ShouldReturnBadRequest() throws Exception {
        // Arrange
        TranslationRequestDto invalidRequest = TranslationRequestDto.builder()
                .resume(sampleResume)
                .languageCode(null)
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/translate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(translationService, never()).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void translateResume_WithInvalidJson_ShouldReturnBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/translate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ invalid json }"))
                .andExpect(status().isBadRequest());

        verify(translationService, never()).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void translateResume_WithWrongContentType_ShouldReturnUnsupportedMediaType() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/translate")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("some text"))
                .andExpect(status().isUnsupportedMediaType());

        verify(translationService, never()).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void translateResume_WhenServiceThrowsException_ShouldReturnInternalServerError() throws Exception {
        // Arrange
        when(translationService.translateResume(any(TranslationRequestDto.class)))
                .thenThrow(new RuntimeException("Translation service error"));

        // Act & Assert
        mockMvc.perform(post("/api/translate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isInternalServerError());

        verify(translationService, times(1)).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void translateResume_WithMinimalResume_ShouldWork() throws Exception {
        // Arrange
        ResumeDto minimalResume = ResumeDto.builder()
                .basics(ResumeDto.Basics.builder()
                        .name("Jane Smith")
                        .build())
                .build();

        TranslationRequestDto minimalRequest = TranslationRequestDto.builder()
                .resume(minimalResume)
                .languageCode("fr")
                .build();

        ResumeDto translatedResume = ResumeDto.builder()
                .basics(ResumeDto.Basics.builder()
                        .name("Jeanne Martin")
                        .build())
                .build();

        when(translationService.translateResume(any(TranslationRequestDto.class)))
                .thenReturn(translatedResume);

        // Act & Assert
        mockMvc.perform(post("/api/translate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(minimalRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.basics.name").value("Jeanne Martin"));

        verify(translationService, times(1)).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void health_ShouldReturnOkWithMessage() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Resume Translation API is running"));
    }

    @Test
    void translateResume_WithComplexResume_ShouldWork() throws Exception {
        // Arrange
        ResumeDto complexResume = ResumeDto.builder()
                .basics(ResumeDto.Basics.builder()
                        .name("Alice Johnson")
                        .email("alice@example.com")
                        .phone("+1-555-9999")
                        .summary("Full-stack developer with 5+ years experience")
                        .location(ResumeDto.Location.builder()
                                .address("123 Main St")
                                .city("San Francisco")
                                .region("CA")
                                .countryCode("US")
                                .postalCode("94105")
                                .build())
                        .profiles(List.of(
                                ResumeDto.Profile.builder()
                                        .network("GitHub")
                                        .username("alicej")
                                        .url("https://github.com/alicej")
                                        .build(),
                                ResumeDto.Profile.builder()
                                        .network("LinkedIn")
                                        .username("alice-johnson")
                                        .url("https://linkedin.com/in/alice-johnson")
                                        .build()
                        ))
                        .build())
                .work(List.of(
                        ResumeDto.Work.builder()
                                .name("Tech Startup Inc")
                                .position("Lead Developer")
                                .url("https://techstartup.com")
                                .startDate("2022-01")
                                .endDate("present")
                                .summary("Led a team of 5 developers in building scalable web applications")
                                .highlights(List.of(
                                        "Implemented microservices architecture",
                                        "Reduced API response time by 40%",
                                        "Mentored junior developers"
                                ))
                                .build(),
                        ResumeDto.Work.builder()
                                .name("Previous Company")
                                .position("Software Developer")
                                .startDate("2020-06")
                                .endDate("2021-12")
                                .summary("Developed and maintained web applications")
                                .highlights(List.of("Built REST APIs", "Implemented CI/CD pipeline"))
                                .build()
                ))
                .education(List.of(
                        ResumeDto.Education.builder()
                                .institution("University of Technology")
                                .url("https://university.edu")
                                .area("Computer Science")
                                .studyType("Bachelor")
                                .startDate("2016-09")
                                .endDate("2020-05")
                                .score("3.8/4.0")
                                .courses(List.of("Data Structures", "Algorithms", "Database Systems"))
                                .build()
                ))
                .skills(List.of(
                        ResumeDto.Skill.builder()
                                .name("Java")
                                .level("Expert")
                                .keywords(List.of("Spring Boot", "Hibernate", "Maven"))
                                .build(),
                        ResumeDto.Skill.builder()
                                .name("JavaScript")
                                .level("Advanced")
                                .keywords(List.of("React", "Node.js", "TypeScript"))
                                .build()
                ))
                .projects(List.of(
                        ResumeDto.Project.builder()
                                .name("E-commerce Platform")
                                .startDate("2023-01")
                                .endDate("2023-06")
                                .description("Built a full-stack e-commerce platform")
                                .highlights(List.of("Handled 10k+ concurrent users", "Implemented payment processing"))
                                .url("https://github.com/alicej/ecommerce")
                                .build()
                ))
                .build();

        TranslationRequestDto complexRequest = TranslationRequestDto.builder()
                .resume(complexResume)
                .languageCode("de")
                .build();

        when(translationService.translateResume(any(TranslationRequestDto.class)))
                .thenReturn(complexResume); // Return the same for simplicity

        // Act & Assert
        mockMvc.perform(post("/api/translate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(complexRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.basics.name").value("Alice Johnson"))
                .andExpect(jsonPath("$.work").isArray())
                .andExpect(jsonPath("$.work.length()").value(2))
                .andExpect(jsonPath("$.education").isArray())
                .andExpect(jsonPath("$.skills").isArray())
                .andExpect(jsonPath("$.projects").isArray());

        verify(translationService, times(1)).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void translateResume_WithDifferentLanguageCodes_ShouldWork() throws Exception {
        // Test with different language codes
        String[] languageCodes = {"es", "fr", "de", "it", "pt", "ja", "ko", "zh"};

        for (String langCode : languageCodes) {
            TranslationRequestDto request = TranslationRequestDto.builder()
                    .resume(sampleResume)
                    .languageCode(langCode)
                    .build();

            when(translationService.translateResume(any(TranslationRequestDto.class)))
                    .thenReturn(sampleResume);

            mockMvc.perform(post("/api/translate")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            verify(translationService, atLeastOnce()).translateResume(any(TranslationRequestDto.class));
        }
    }
}
