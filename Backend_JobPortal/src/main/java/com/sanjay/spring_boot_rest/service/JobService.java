package com.sanjay.spring_boot_rest.service;


import com.sanjay.spring_boot_rest.model.JobPost;
import com.sanjay.spring_boot_rest.repo.JobRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {
    @Autowired
    public JobRepo repo;


    /** Saves a job to PostgreSQL; an existing ID updates its record. */
    public void addJob(JobPost jobPost) {
        repo.save(jobPost);

    }

    /** Reads persisted jobs rather than an in-memory sample list. */
    public List<JobPost> getAllJobs() {
        return repo.findAll();


    }

    /** Returns an empty job when the requested ID is absent (the current API convention). */
    public JobPost getJob(int postId) {
        return repo.findById(postId).orElse(new JobPost());
    }

    /** Saves the supplied fields; JPA also inserts if this ID does not exist. */
    public void updateJob(JobPost jobPost) {
        repo.save(jobPost);
    }

    /** Removes the persisted job identified by its primary key. */
    public void deleteJob(int postId){
        repo.deleteById(postId);
    }

    /** Loads fixed sample IDs; calling this can overwrite jobs with those IDs. */
    public void load() {
        List<JobPost> jobs =
                new ArrayList<>(List.of(
                        new JobPost(1, "Software Engineer", "Exciting opportunity for a skilled software engineer.", 3, List.of("Java", "Spring", "SQL")),
                        new JobPost(2, "Data Scientist", "Join our data science team and work on cutting-edge projects.", 5, List.of("Python", "Machine Learning", "TensorFlow")),
                        new JobPost(3, "Frontend Developer", "Create amazing user interfaces with our talented frontend team.", 2, List.of("JavaScript", "React", "CSS")),
                        new JobPost(4, "Network Engineer", "Design and maintain our robust network infrastructure.", 4, List.of("Cisco", "Routing", "Firewalls")),
                        new JobPost(5, "UX Designer", "Shape the user experience with your creative design skills.", 3, List.of("UI/UX Design", "Adobe XD", "Prototyping"))

                ));
        repo.saveAll(jobs);
    }

    /** Matches the same keyword against either the title or description. */
    public List<JobPost> search(String keyword) {
        return repo.findByPostProfileContainingOrPostDescContaining(keyword,keyword);
    }
}
