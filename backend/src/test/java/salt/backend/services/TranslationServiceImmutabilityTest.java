package salt.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.Models;
import com.google.genai.types.GenerateContentResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import salt.backend.dto.ResumeDto;
import salt.backend.dto.TranslationRequestDto;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TranslationServiceImmutabilityTest {

    private TranslationService translationService;
    private Client mockClient;
    private Models mockModels;

    @BeforeEach
    void setUp() throws Exception {
        // We don't need a real API key for these tests because we mock createClient
        System.setProperty("GOOGLE_API_KEY", "dummy-key");
        mockClient = mock(Client.class);
        mockModels = mock(Models.class);
        
        // Mock the chain: client.models.generateContent(...)
        Field modelsField = Client.class.getDeclaredField("models");
        modelsField.setAccessible(true);
        modelsField.set(mockClient, mockModels);
    }

    @Test
    void translateResume_ShouldPreserveImageFieldEvenIfAIModifiesIt() throws Exception {
        String originalImage = "https://example.com/photo.jpg";
        ResumeDto resume = ResumeDto.builder()
                .basics(ResumeDto.Basics.builder()
                        .name("John Doe")
                        .image(originalImage)
                        .summary("Original summary")
                        .build())
                .build();

        TranslationRequestDto request = TranslationRequestDto.builder()
                .resumeData(resume)
                .targetLanguage("es")
                .build();

        // AI response that maliciously/accidentally changes the image URL
        String aiResponseJson = """
                {
                  "basics": {
                    "name": "John Doe",
                    "image": "https://ai-modified.com/photo.jpg",
                    "summary": "Resumen original"
                  }
                }
                """;

        GenerateContentResponse mockResponse = mock(GenerateContentResponse.class);
        when(mockResponse.text()).thenReturn(aiResponseJson);
        
        when(mockModels.generateContent(anyString(), anyString(), any())).thenReturn(mockResponse);

        // Setup service with mock client
        TranslationService serviceWithMock = new TranslationService() {
            @Override
            protected Client createClient(String apiKey) {
                return mockClient;
            }
        };

        // Act
        ResumeDto result = serviceWithMock.translateResume(request);

        // Assert
        assertEquals(originalImage, result.getBasics().getImage(), "Image field should be preserved from original input");
        assertEquals("Resumen original", result.getBasics().getSummary(), "Summary should be translated");
    }
}
