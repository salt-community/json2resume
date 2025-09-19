package salt.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import java.util.List;

/**
 * DTO representing the JSON Resume schema.
 * All fields are optional to support partial resume data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeDto {

    @Valid
    private Basics basics;

    private List<@Valid Work> work;

    private List<@Valid Volunteer> volunteer;

    private List<@Valid Education> education;

    private List<@Valid Award> awards;

    private List<@Valid Certificate> certificates;

    private List<@Valid Publication> publications;

    private List<@Valid Skill> skills;

    private List<@Valid Language> languages;

    private List<@Valid Interest> interests;

    private List<@Valid Reference> references;

    private List<@Valid Project> projects;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Basics {
        private String name;
        private String label;
        private String image;
        private String email;
        private String phone;
        private String url;
        private String summary;
        
        @Valid
        private Location location;
        
        private List<@Valid Profile> profiles;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
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
    public static class Profile {
        private String network;
        private String username;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Work {
        private String name;
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
    public static class Education {
        private String institution;
        private String url;
        private String area;
        private String studyType;
        private String startDate;
        private String endDate;
        private String score;
        private List<String> courses;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Award {
        private String title;
        private String date;
        private String awarder;
        private String summary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Certificate {
        private String name;
        private String date;
        private String issuer;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Publication {
        private String name;
        private String publisher;
        private String releaseDate;
        private String url;
        private String summary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Skill {
        private String name;
        private String level;
        private List<String> keywords;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Language {
        private String language;
        private String fluency;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Interest {
        private String name;
        private List<String> keywords;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Reference {
        private String name;
        private String reference;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Project {
        private String name;
        private String startDate;
        private String endDate;
        private String description;
        private List<String> highlights;
        private String url;
    }
}
