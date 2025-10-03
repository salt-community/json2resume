package salt.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for file upload requests (images and PDFs).
 * Contains the file data as base64 string and file type.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadRequestDto {

    @NotBlank(message = "File data is required")
    private String fileData; // Base64 encoded file content

    @NotBlank(message = "File type is required")
    private String fileType; // MIME type (e.g., "image/jpeg", "application/pdf")

    @NotBlank(message = "File name is required")
    private String fileName; // Original file name

    private String targetLanguage; // Optional: for future multi-language support
}
