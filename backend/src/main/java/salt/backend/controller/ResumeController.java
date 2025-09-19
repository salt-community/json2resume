package salt.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import salt.backend.dto.ResumeDto;
import salt.backend.dto.TranslationRequestDto;

import jakarta.validation.Valid;

/**
 * REST controller for handling resume translation requests.
 * Accepts resume data from the frontend and returns translated resume.
 */
@Slf4j
@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResumeController {


    @PostMapping(path = "/translate", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResumeDto> translateResume(@Valid @RequestBody TranslationRequestDto request) {
        log.info("🚀 Received translation request for language: {}", request.getLanguageCode());
        
        try {
            // TODO: Implement translation service integration
            // For now, return the original resume data
            log.info("📝 Translation completed successfully");
            return ResponseEntity.ok(request.getResume());
            
        } catch (Exception e) {
            log.error("❌ Error processing translation request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

 
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Resume Translation API is running");
    }
}
