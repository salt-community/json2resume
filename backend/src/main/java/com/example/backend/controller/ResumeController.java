package com.example.backend.controller;

import com.example.backend.dto.ResumeDto;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller that accepts JSON Resume payloads
 * in two ways:
 *  - POST /api/resumes/raw : raw JSON (JsonNode)
 *  - POST /api/resumes/dto : mapped DTO (ResumeDto) covering basics, work, volunteer,
 *    education, awards, certificates, publications, skills, languages, interests,
 *    references and projects.
 */
@RestController
@RequestMapping(path = "/api/resumes", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResumeController {

    /**
     * Accepts raw JSON payload without mapping.
     * Useful when storing or passing-through the resume as-is.
     */
    @PostMapping(path = "/raw", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JsonNode> acceptRaw(@RequestBody JsonNode resumeJson) {
        return ResponseEntity.ok(resumeJson);
    }

    /**
     * Accepts a JSON Resume payload mapped to DTOs and validated.
     */
    @PostMapping(path = "/dto", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResumeDto> acceptDto(@Valid @RequestBody ResumeDto resume) {
        return ResponseEntity.ok(resume);
    }
}
