package com.example.backend.controller;

import com.example.backend.dto.ResumeDto;
import com.example.backend.model.Resume;
import com.example.backend.service.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Resume operations.
 * Provides RESTful endpoints for resume management with proper validation.
 * Follows REST conventions and includes comprehensive error handling.
 */
@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeService resumeService;

    /**
     * Create a new resume.
     * POST /api/v1/resumes
     */
    @PostMapping
    public ResponseEntity<ResumeDto.ResumeResponse> createResume(
            @Valid @RequestBody ResumeDto.CreateResumeRequest request) {
        log.info("REST request to create resume with title: {}", request.title());
        ResumeDto.ResumeResponse response = resumeService.createResume(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get resume by ID.
     * GET /api/v1/resumes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResumeDto.ResumeResponse> getResumeById(@PathVariable Long id) {
        log.debug("REST request to get resume by ID: {}", id);
        return resumeService.findResumeById(id)
                .map(resume -> ResponseEntity.ok(resume))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update resume by ID.
     * PUT /api/v1/resumes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResumeDto.ResumeResponse> updateResume(
            @PathVariable Long id,
            @Valid @RequestBody ResumeDto.UpdateResumeRequest request) {
        log.info("REST request to update resume: {}", id);
        ResumeDto.ResumeResponse response = resumeService.updateResume(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all resumes with pagination.
     * GET /api/v1/resumes
     */
    @GetMapping
    public ResponseEntity<Page<ResumeDto.ResumeSummary>> getAllResumes(
            @PageableDefault(size = 20, sort = "updatedAt") Pageable pageable) {
        log.debug("REST request to get all resumes with pagination");
        Page<ResumeDto.ResumeSummary> resumes = resumeService.getAllResumes(pageable);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Get resumes by status.
     * GET /api/v1/resumes/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<ResumeDto.ResumeSummary>> getResumesByStatus(
            @PathVariable Resume.ResumeStatus status,
            @PageableDefault(size = 20, sort = "updatedAt") Pageable pageable) {
        log.debug("REST request to get resumes by status: {}", status);
        Page<ResumeDto.ResumeSummary> resumes = resumeService.getResumesByStatus(status, pageable);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Search all resumes.
     * GET /api/v1/resumes/search?q={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ResumeDto.ResumeSummary>> searchResumes(
            @RequestParam("q") String searchTerm,
            @PageableDefault(size = 20, sort = "updatedAt") Pageable pageable) {
        log.debug("REST request to search resumes with term: {}", searchTerm);
        Page<ResumeDto.ResumeSummary> resumes = resumeService.searchResumes(searchTerm, pageable);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Update resume status.
     * PATCH /api/v1/resumes/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResumeDto.ResumeResponse> updateResumeStatus(
            @PathVariable Long id,
            @Valid @RequestBody ResumeDto.UpdateResumeStatusRequest request) {
        log.info("REST request to update resume status: {} to {}", id, request.status());
        ResumeDto.ResumeResponse response = resumeService.updateResumeStatus(id, request.status());
        return ResponseEntity.ok(response);
    }

    /**
     * Delete resume.
     * DELETE /api/v1/resumes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        log.info("REST request to delete resume: {}", id);
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get total resume count.
     * GET /api/v1/resumes/count
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getResumeCount() {
        log.debug("REST request to get resume count");
        long count = resumeService.countResumes();
        return ResponseEntity.ok(count);
    }
}