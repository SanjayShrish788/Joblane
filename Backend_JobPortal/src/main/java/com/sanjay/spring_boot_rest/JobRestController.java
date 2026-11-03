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

    //only shows json not xml cuz here  produces are created
    @GetMapping(path = "jobPosts",produces = {"application/json"})
    public List<JobPost> getAllJobs(){
        return service.getAllJobs();
    }

    @GetMapping("jobPost/{postId}")
    public JobPost getJob(@PathVariable("postId") int postId){
        return service.getJob(postId);
    }

    @PostMapping(path = "jobPost") // ,consumes = {"application/json"} beside "jobPost"
    public JobPost addJob(@RequestBody JobPost jobPost){  //to send data to server use @RequestBody
        service.addJob(jobPost);
        return service.getJob(jobPost.getPostId());
    }

    @PutMapping("jobPost")
    public JobPost updateJob(@RequestBody JobPost jobPost){
        service.updateJob(jobPost);
        return service.getJob(jobPost.getPostId());
    }

    @DeleteMapping("jobPost/{postId}")
    public String deleteJob(@PathVariable("postId") int postId){
        service.deleteJob(postId);
        return "Deleted";
    }
    
    @GetMapping("load")
    public String loadData(){
        service.load();
        return "success";
    }

    @GetMapping("jobPosts/keyword/{keyword}")
    public List<JobPost> searchByKeyword(@PathVariable("keyword") String keyword){
        return service.search(keyword);
    }
}