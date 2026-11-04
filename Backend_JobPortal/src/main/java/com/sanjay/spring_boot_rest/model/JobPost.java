package com.sanjay.spring_boot_rest.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
@Data @NoArgsConstructor @Entity
public class JobPost {
    @Id @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="job_ids")
    @SequenceGenerator(name="job_ids", sequenceName="job_post_seq", allocationSize=1)
    private Integer postId;
    @NotBlank @Size(max=100) @Column(nullable=false,length=100)
    private String postProfile;
    @NotBlank @Size(max=255) @Column(nullable=false)
    private String postDesc;
    @Min(0) @Max(50) @Column(nullable=false)
    private int reqExperience;
    @NotEmpty @Size(max=30) @Column(nullable=false)
    private List<@NotBlank @Size(max=255) String> postTechStack;
    @Column(nullable=false,length=40)
    private String ownerUsername;
}
