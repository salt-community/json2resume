package salt.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for translation requests from the frontend.
 * Contains the resume data and target language code.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranslationRequestDto {

    @Valid
    @NotNull(message = "Resume data is required")
    private ResumeDto resumeData;

    @NotBlank(message = "Language code is required")
    private String targetLanguage;
}
