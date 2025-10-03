package salt.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


import jakarta.validation.Valid;
import salt.backend.dto.TranslationRequestDto;
import salt.backend.dto.ResumeDto;
import salt.backend.dto.FileUploadRequestDto;
import salt.backend.services.TranslationService;

/**
 * REST controller for handling resume translation requests.
 * Accepts resume data from the frontend and returns translated resume.
 */
@Slf4j
@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResumeController {

    private final TranslationService translationService;

    public ResumeController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @PostMapping(path = "/translate", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResumeDto> translateResume(@Valid @RequestBody TranslationRequestDto request) {
        log.info("🚀 Received translation request for language: {}", request.getTargetLanguage());

        try {
            ResumeDto translatedResume = translationService.translateResume(request);
            log.info("📝 Translation completed successfully for language: {}", request.getTargetLanguage());
            return ResponseEntity.ok(translatedResume);

        } catch (Exception e) {
            log.error("❌ Error processing translation request for language: {}", request.getTargetLanguage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping(path = "/convert-file", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> convertFileToResume(@Valid @RequestBody FileUploadRequestDto request) {
        log.info("🚀 Received file conversion request for file: {}", request.getFileName());

        try {
            // Validate file type
            if (!isValidFileType(request.getFileType())) {
                log.warn("❌ Invalid file type: {}", request.getFileType());
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid file type. Only images (JPG, PNG) and PDF files are supported."));
            }

            // Validate file size (basic check on base64 length)
            if (request.getFileData().length() > 50 * 1024 * 1024) { // ~37MB base64 = ~25MB file
                log.warn("❌ File too large: {}", request.getFileName());
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "File too large. Maximum size is 25MB."));
            }

            ResumeDto convertedResume = translationService.convertFileToResume(request);
            log.info("📝 File conversion completed successfully for file: {}", request.getFileName());
            return ResponseEntity.ok(convertedResume);

        } catch (Exception e) {
            log.error("❌ Error processing file conversion request for file: {}", request.getFileName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to convert file. Please try again."));
        }
    }

    private boolean isValidFileType(String fileType) {
        return fileType != null && (
            fileType.startsWith("image/") || 
            fileType.equals("application/pdf")
        );
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Resume Translation API is running");
    }
}
