package com.example.backend.service.impl;

import com.example.backend.dto.ResumeDto;
import com.example.backend.model.Resume;
import com.example.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of ResumeService.
 * Handles all resume-related business logic with proper validation.
 * Uses direct JPA operations instead of repositories as requested.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ResumeServiceImpl implements ResumeService {

    private final EntityManager entityManager;

    @Override
    @Transactional
    public ResumeDto.ResumeResponse createResume(ResumeDto.CreateResumeRequest createRequest) {
        log.info("Creating resume with title: {}", createRequest.title());

        Resume resume = Resume.builder()
                .title(createRequest.title())
                .description(createRequest.description())
                .jsonData(createRequest.jsonData())
                .status(Resume.ResumeStatus.DRAFT)
                .build();

        entityManager.persist(resume);
        entityManager.flush();

        log.info("Successfully created resume with ID: {}", resume.getId());
        return mapToResumeResponse(resume);
    }

    @Override
    @Transactional
    public ResumeDto.ResumeResponse updateResume(Long resumeId, ResumeDto.UpdateResumeRequest updateRequest) {
        log.info("Updating resume ID: {}", resumeId);

        Resume resume = entityManager.find(Resume.class, resumeId);
        if (resume == null) {
            throw new IllegalArgumentException("Resume not found with ID: " + resumeId);
        }

        // Update fields if provided
        if (updateRequest.title() != null) {
            resume.setTitle(updateRequest.title());
        }

        if (updateRequest.description() != null) {
            resume.setDescription(updateRequest.description());
        }

        if (updateRequest.jsonData() != null) {
            resume.setJsonData(updateRequest.jsonData());
        }

        if (updateRequest.status() != null) {
            resume.setStatus(updateRequest.status());
        }

        Resume savedResume = entityManager.merge(resume);
        log.info("Successfully updated resume with ID: {}", savedResume.getId());

        return mapToResumeResponse(savedResume);
    }

    @Override
    public Optional<ResumeDto.ResumeResponse> findResumeById(Long resumeId) {
        log.debug("Finding resume by ID: {}", resumeId);
        Resume resume = entityManager.find(Resume.class, resumeId);
        return Optional.ofNullable(resume).map(this::mapToResumeResponse);
    }

    @Override
    public Page<ResumeDto.ResumeSummary> getAllResumes(Pageable pageable) {
        log.debug("Getting all resumes with pagination: {}", pageable);

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        
        // Query for data
        CriteriaQuery<Resume> query = cb.createQuery(Resume.class);
        Root<Resume> root = query.from(Resume.class);
        query.select(root);
        
        // Add sorting
        if (pageable.getSort().isSorted()) {
            pageable.getSort().forEach(order -> {
                if (order.isAscending()) {
                    query.orderBy(cb.asc(root.get(order.getProperty())));
                } else {
                    query.orderBy(cb.desc(root.get(order.getProperty())));
                }
            });
        } else {
            query.orderBy(cb.desc(root.get("updatedAt")));
        }

        TypedQuery<Resume> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Resume> resumes = typedQuery.getResultList();

        // Query for count
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Resume> countRoot = countQuery.from(Resume.class);
        countQuery.select(cb.count(countRoot));

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        List<ResumeDto.ResumeSummary> summaries = resumes.stream()
                .map(this::mapToResumeSummary)
                .toList();

        return new PageImpl<>(summaries, pageable, total);
    }

    @Override
    public Page<ResumeDto.ResumeSummary> getResumesByStatus(Resume.ResumeStatus status, Pageable pageable) {
        log.debug("Getting resumes by status: {} with pagination: {}", status, pageable);

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        
        // Query for data
        CriteriaQuery<Resume> query = cb.createQuery(Resume.class);
        Root<Resume> root = query.from(Resume.class);
        query.select(root).where(cb.equal(root.get("status"), status));
        
        // Add sorting
        if (pageable.getSort().isSorted()) {
            pageable.getSort().forEach(order -> {
                if (order.isAscending()) {
                    query.orderBy(cb.asc(root.get(order.getProperty())));
                } else {
                    query.orderBy(cb.desc(root.get(order.getProperty())));
                }
            });
        } else {
            query.orderBy(cb.desc(root.get("updatedAt")));
        }

        TypedQuery<Resume> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Resume> resumes = typedQuery.getResultList();

        // Query for count
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Resume> countRoot = countQuery.from(Resume.class);
        countQuery.select(cb.count(countRoot)).where(cb.equal(countRoot.get("status"), status));

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        List<ResumeDto.ResumeSummary> summaries = resumes.stream()
                .map(this::mapToResumeSummary)
                .toList();

        return new PageImpl<>(summaries, pageable, total);
    }

    @Override
    public Page<ResumeDto.ResumeSummary> searchResumes(String searchTerm, Pageable pageable) {
        log.debug("Searching resumes with term: {}", searchTerm);

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        
        // Query for data
        CriteriaQuery<Resume> query = cb.createQuery(Resume.class);
        Root<Resume> root = query.from(Resume.class);
        
        // Build search predicates
        List<Predicate> predicates = new ArrayList<>();
        String likePattern = "%" + searchTerm.toLowerCase() + "%";
        
        predicates.add(cb.like(cb.lower(root.get("title")), likePattern));
        predicates.add(cb.like(cb.lower(root.get("description")), likePattern));
        
        query.select(root).where(cb.or(predicates.toArray(new Predicate[0])));
        
        // Add sorting
        if (pageable.getSort().isSorted()) {
            pageable.getSort().forEach(order -> {
                if (order.isAscending()) {
                    query.orderBy(cb.asc(root.get(order.getProperty())));
                } else {
                    query.orderBy(cb.desc(root.get(order.getProperty())));
                }
            });
        } else {
            query.orderBy(cb.desc(root.get("updatedAt")));
        }

        TypedQuery<Resume> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Resume> resumes = typedQuery.getResultList();

        // Query for count
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Resume> countRoot = countQuery.from(Resume.class);
        countQuery.select(cb.count(countRoot)).where(cb.or(predicates.toArray(new Predicate[0])));

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        List<ResumeDto.ResumeSummary> summaries = resumes.stream()
                .map(this::mapToResumeSummary)
                .toList();

        return new PageImpl<>(summaries, pageable, total);
    }

    @Override
    @Transactional
    public ResumeDto.ResumeResponse updateResumeStatus(Long resumeId, Resume.ResumeStatus status) {
        log.info("Updating resume status for ID: {} to {}", resumeId, status);

        Resume resume = entityManager.find(Resume.class, resumeId);
        if (resume == null) {
            throw new IllegalArgumentException("Resume not found with ID: " + resumeId);
        }

        resume.setStatus(status);
        Resume savedResume = entityManager.merge(resume);

        log.info("Successfully updated resume status for ID: {}", savedResume.getId());
        return mapToResumeResponse(savedResume);
    }

    @Override
    @Transactional
    public void deleteResume(Long resumeId) {
        log.info("Deleting resume ID: {}", resumeId);

        Resume resume = entityManager.find(Resume.class, resumeId);
        if (resume == null) {
            throw new IllegalArgumentException("Resume not found with ID: " + resumeId);
        }

        entityManager.remove(resume);
        log.info("Successfully deleted resume with ID: {}", resumeId);
    }

    @Override
    public long countResumes() {
        log.debug("Counting all resumes");
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<Resume> root = query.from(Resume.class);
        query.select(cb.count(root));
        
        return entityManager.createQuery(query).getSingleResult();
    }

    /**
     * Maps Resume entity to ResumeResponse DTO.
     */
    private ResumeDto.ResumeResponse mapToResumeResponse(Resume resume) {
        return ResumeDto.ResumeResponse.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .description(resume.getDescription())
                .jsonData(resume.getJsonData())
                .status(resume.getStatus())
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }

    /**
     * Maps Resume entity to ResumeSummary DTO (without JSON data for performance).
     */
    private ResumeDto.ResumeSummary mapToResumeSummary(Resume resume) {
        return ResumeDto.ResumeSummary.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .description(resume.getDescription())
                .status(resume.getStatus())
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }
}