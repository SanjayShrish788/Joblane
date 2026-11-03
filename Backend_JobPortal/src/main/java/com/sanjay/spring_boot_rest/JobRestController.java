package com.sanjay.spring_boot_rest;

import com.sanjay.spring_boot_rest.model.JobPost;
import com.sanjay.spring_boot_rest.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class JobRestController {

    @Autowired
    private JobService service;

    /** Lists jobs as JSON for the public job board. */
    @GetMapping(path = "jobPosts",produces = {"application/json"})
    public List<JobPost> getAllJobs(){
        return service.getAllJobs();
    }

    /** Looks up one job using the ID supplied in the URL. */
    @GetMapping("jobPost/{postId}")
    public JobPost getJob(@PathVariable("postId") int postId){
        return service.getJob(postId);
    }

    /** Saves the JSON request body and returns the persisted job. Requires login. */
    @PostMapping(path = "jobPost")
    public JobPost addJob(@RequestBody JobPost jobPost){
        service.addJob(jobPost);
        return service.getJob(jobPost.getPostId());
    }

    /** Saves changes using the postId in the request body. Requires login. */
    @PutMapping("jobPost")
    public JobPost updateJob(@RequestBody JobPost jobPost){
        service.updateJob(jobPost);
        return service.getJob(jobPost.getPostId());
    }

    /** Deletes a job permanently. Access is checked by Spring Security. */
    @DeleteMapping("jobPost/{postId}")
    public String deleteJob(@PathVariable("postId") int postId){
        service.deleteJob(postId);
        return "Deleted";
    }
    
    /** Legacy sample-data endpoint: despite using GET, it writes to the database. */
    @GetMapping("load")
    public String loadData(){
        service.load();
        return "success";
    }

    /** Searches titles and descriptions; skill filtering is handled by the frontend. */
    @GetMapping("jobPosts/keyword/{keyword}")
    public List<JobPost> searchByKeyword(@PathVariable("keyword") String keyword){
        return service.search(keyword);
    }
}
