package salt.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import salt.backend.dto.ResumeDto;
import salt.backend.dto.TranslationRequestDto;
import salt.backend.services.TranslationService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Simple unit tests for ResumeController without Spring context.
 * Tests the controller logic directly using Mockito.
 */
@ExtendWith(MockitoExtension.class)
class ResumeControllerSimpleTest {

    @Mock
    private TranslationService translationService;

    @InjectMocks
    private ResumeController resumeController;

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
                .resumeData(sampleResume)
                .targetLanguage("es")
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

        // Act
        ResponseEntity<ResumeDto> response = resumeController.translateResume(validRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Juan Pérez", response.getBody().getBasics().getName());
        assertEquals("Desarrollador de software experimentado", response.getBody().getBasics().getSummary());
        assertEquals("Desarrollador Senior", response.getBody().getWork().get(0).getPosition());
        assertEquals("Experto", response.getBody().getSkills().get(0).getLevel());

        verify(translationService, times(1)).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void translateResume_WhenServiceThrowsException_ShouldReturnInternalServerError() throws Exception {
        // Arrange
        when(translationService.translateResume(any(TranslationRequestDto.class)))
                .thenThrow(new RuntimeException("Translation service error"));

        // Act
        ResponseEntity<ResumeDto> response = resumeController.translateResume(validRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());

        verify(translationService, times(1)).translateResume(any(TranslationRequestDto.class));
    }

    @Test
    void health_ShouldReturnOkWithMessage() throws Exception {
        // Act
        ResponseEntity<String> response = resumeController.health();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Resume Translation API is running", response.getBody());
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
                .resumeData(minimalResume)
                .targetLanguage("fr")
                .build();

        ResumeDto translatedResume = ResumeDto.builder()
                .basics(ResumeDto.Basics.builder()
                        .name("Jeanne Martin")
                        .build())
                .build();

        when(translationService.translateResume(any(TranslationRequestDto.class)))
                .thenReturn(translatedResume);

        // Act
        ResponseEntity<ResumeDto> response = resumeController.translateResume(minimalRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Jeanne Martin", response.getBody().getBasics().getName());

        verify(translationService, times(1)).translateResume(any(TranslationRequestDto.class));
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
                .resumeData(complexResume)
                .targetLanguage("de")
                .build();

        when(translationService.translateResume(any(TranslationRequestDto.class)))
                .thenReturn(complexResume); // Return the same for simplicity

        // Act
        ResponseEntity<ResumeDto> response = resumeController.translateResume(complexRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Alice Johnson", response.getBody().getBasics().getName());
        assertNotNull(response.getBody().getWork());
        assertEquals(1, response.getBody().getWork().size());
        assertNotNull(response.getBody().getEducation());
        assertEquals(1, response.getBody().getEducation().size());
        assertNotNull(response.getBody().getSkills());
        assertEquals(2, response.getBody().getSkills().size());
        assertNotNull(response.getBody().getProjects());
        assertEquals(1, response.getBody().getProjects().size());

        verify(translationService, times(1)).translateResume(any(TranslationRequestDto.class));
    }
}
