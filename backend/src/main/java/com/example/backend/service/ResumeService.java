package com.example.backend.service;

import com.example.backend.dto.ResumeDto;
import com.example.backend.model.Resume;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service interface for Resume operations.
 * Defines the contract for resume-related business logic.
 */
public interface ResumeService {

    /**
     * Create a new resume.
     *
     * @param createRequest the resume creation request
     * @return the created resume response
     */
    ResumeDto.ResumeResponse createResume(ResumeDto.CreateResumeRequest createRequest);

    /**
     * Update an existing resume.
     *
     * @param resumeId the resume ID
     * @param updateRequest the resume update request
     * @return the updated resume response
     * @throws IllegalArgumentException if resume not found
     */
    ResumeDto.ResumeResponse updateResume(Long resumeId, ResumeDto.UpdateResumeRequest updateRequest);

    /**
     * Find resume by ID.
     *
     * @param resumeId the resume ID
     * @return the resume response if found
     */
    Optional<ResumeDto.ResumeResponse> findResumeById(Long resumeId);

    /**
     * Get all resumes with pagination.
     *
     * @param pageable pagination information
     * @return page of resume summaries
     */
    Page<ResumeDto.ResumeSummary> getAllResumes(Pageable pageable);

    /**
     * Get resumes by status with pagination.
     *
     * @param status the resume status
     * @param pageable pagination information
     * @return page of resume summaries
     */
    Page<ResumeDto.ResumeSummary> getResumesByStatus(Resume.ResumeStatus status, Pageable pageable);

    /**
     * Search resumes by search term.
     *
     * @param searchTerm the search term
     * @param pageable pagination information
     * @return page of matching resume summaries
     */
    Page<ResumeDto.ResumeSummary> searchResumes(String searchTerm, Pageable pageable);

    /**
     * Update resume status.
     *
     * @param resumeId the resume ID
     * @param status the new status
     * @return the updated resume response
     * @throws IllegalArgumentException if resume not found
     */
    ResumeDto.ResumeResponse updateResumeStatus(Long resumeId, Resume.ResumeStatus status);

    /**
     * Delete a resume.
     *
     * @param resumeId the resume ID
     * @throws IllegalArgumentException if resume not found
     */
    void deleteResume(Long resumeId);

    /**
     * Count all resumes.
     *
     * @return the total count of resumes
     */
    long countResumes();
}