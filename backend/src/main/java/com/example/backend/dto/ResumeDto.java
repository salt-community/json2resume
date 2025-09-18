package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTOs modeling the JSON Resume schema (https://jsonresume.org/schema).
 * Unknown properties are ignored to stay forward-compatible with the full schema.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeDto {

    @Valid
    private Basics basics;

    @Valid
    private List<Work> work;

    @Valid
    private List<Volunteer> volunteer;

    @Valid
    private List<Education> education;

    @Valid
    private List<Award> awards;

    @Valid
    private List<Certificate> certificates;

    @Valid
    private List<Publication> publications;

    @Valid
    private List<Skill> skills;

    @Valid
    private List<Language> languages;

    @Valid
    private List<Interest> interests;

    @Valid
    private List<Reference> references;

    @Valid
    private List<Project> projects;

    // ---- Nested DTOs ----

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Basics {
        @NotBlank
        private String name;

        private String label;

        private String image;

        @Email
        private String email;

        private String phone;
        private String url;

        @Size(max = 1000)
        private String summary;

        @Valid
        private Location location;

        @Valid
        private List<Profile> profiles;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Location {
        private String address;
        private String postalCode;
        private String city;
        private String countryCode;
        private String region;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Profile {
        private String network;
        private String username;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Work {
        private String name;
        private String position;
        private String url;
        private String startDate; // ISO-8601 date string
        private String endDate;   // ISO-8601 date string
        private String summary;
        private List<String> highlights;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Volunteer {
        private String organization;
        private String position;
        private String url;
        private String startDate;
        private String endDate;
        private String summary;
        private List<String> highlights;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Education {
        private String institution;
        private String url;
        private String area;
        private String studyType;
        private String startDate; // ISO-8601 date string
        private String endDate;   // ISO-8601 date string
        private String score;
        private List<String> courses;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Award {
        private String title;
        private String date;     // ISO-8601 date string
        private String awarder;
        private String summary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Certificate {
        private String name;
        private String date;     // ISO-8601 date string
        private String issuer;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Publication {
        private String name;
        private String publisher;
        private String releaseDate; // ISO-8601 date string
        private String url;
        private String summary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Skill {
        private String name;
        private String level; // e.g., Beginner, Intermediate, Advanced
        private List<String> keywords;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Language {
        private String language;
        private String fluency;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Interest {
        private String name;
        private List<String> keywords;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Reference {
        private String name;
        private String reference;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Project {
        private String name;
        private String startDate; // ISO-8601 date string
        private String endDate;   // ISO-8601 date string
        private String description;
        private List<String> highlights;
        private String url;
    }
}
