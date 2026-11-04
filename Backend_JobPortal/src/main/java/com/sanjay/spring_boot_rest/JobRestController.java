package com.sanjay.spring_boot_rest;
import com.sanjay.spring_boot_rest.model.JobPost;
import com.sanjay.spring_boot_rest.service.JobService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
@RestController
public class JobRestController {
    private final JobService service;
    public JobRestController(JobService service) { this.service=service; }
    @GetMapping("/jobPosts") public List<JobPost> all() { return service.getAllJobs(); }
    @GetMapping("/jobPost/{id}") public JobPost get(@PathVariable int id) { return service.getJob(id); }
    @GetMapping("/jobPosts/keyword/{keyword}") public List<JobPost> search(@PathVariable String keyword) { return service.search(keyword); }
    @PostMapping("/jobPost") public JobPost create(@Valid @RequestBody JobPost job,Principal principal) { return service.addJob(job,principal.getName()); }
    @PutMapping("/jobPost") public JobPost update(@Valid @RequestBody JobPost job,Principal principal) { return service.updateJob(job,principal.getName()); }
    @DeleteMapping("/jobPost/{id}") public void delete(@PathVariable int id,Principal principal) { service.deleteJob(id,principal.getName()); }
}
