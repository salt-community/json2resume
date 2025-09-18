package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Resume entity representing a resume document in the system.
 * Contains JSON data for resume information.
 */
@Entity
@Table(name = "resumes", indexes = {
    @Index(name = "idx_resume_title", columnList = "title")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String jsonData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ResumeStatus status = ResumeStatus.DRAFT;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    public enum ResumeStatus {
        DRAFT, PUBLISHED, ARCHIVED
    }
}
