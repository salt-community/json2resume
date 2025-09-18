package com.example.backend.dto;

import com.example.backend.model.Resume;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Data Transfer Objects for Resume entity.
 * Provides different views for different use cases.
 */
public class ResumeDto {

    /**
     * DTO for resume creation requests.
     */
    public record CreateResumeRequest(
            @NotBlank(message = "Title is required")
            @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters")
            String title,

            @Size(max = 500, message = "Description must not exceed 500 characters")
            String description,

            @NotBlank(message = "JSON data is required")
            String jsonData
    ) {}

    /**
     * DTO for resume update requests.
     */
    public record UpdateResumeRequest(
            @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters")
            String title,

            @Size(max = 500, message = "Description must not exceed 500 characters")
            String description,

            String jsonData,

            Resume.ResumeStatus status
    ) {}

    /**
     * DTO for full resume responses.
     */
    @Builder
    public record ResumeResponse(
            Long id,
            String title,
            String description,
            String jsonData,
            Resume.ResumeStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {}

    /**
     * DTO for resume list responses (without full JSON data).
     */
    @Builder
    public record ResumeSummary(
            Long id,
            String title,
            String description,
            Resume.ResumeStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {}

    /**
     * DTO for resume status update requests.
     */
    public record UpdateResumeStatusRequest(
            @NotNull(message = "Status is required")
            Resume.ResumeStatus status
    ) {}
}
