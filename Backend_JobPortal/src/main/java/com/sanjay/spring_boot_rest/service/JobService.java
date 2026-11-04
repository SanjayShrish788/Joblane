package com.sanjay.spring_boot_rest.service;
import com.sanjay.spring_boot_rest.model.JobPost;
import com.sanjay.spring_boot_rest.repo.JobRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
@Service
public class JobService {
    private final JobRepo repo;
    public JobService(JobRepo repo) { this.repo=repo; }
    public List<JobPost> getAllJobs() { return repo.findAll(); }
    public JobPost getJob(int id) { return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); }
    @Transactional
    public JobPost addJob(JobPost job, String username) {
        job.setPostId(null);
        job.setOwnerUsername(username);
        return repo.save(job);
    }
    @Transactional
    public JobPost updateJob(JobPost job, String username) {
        if (job.getPostId()==null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        JobPost stored=getJob(job.getPostId());
        checkOwner(stored,username);
        stored.setPostProfile(job.getPostProfile());
        stored.setPostDesc(job.getPostDesc());
        stored.setReqExperience(job.getReqExperience());
        stored.setPostTechStack(job.getPostTechStack());
        return repo.save(stored);
    }
    @Transactional
    public void deleteJob(int id,String username) { JobPost job=getJob(id); checkOwner(job,username); repo.delete(job); }
    private void checkOwner(JobPost job,String username) {
        if (!username.equals(job.getOwnerUsername())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
    public List<JobPost> search(String keyword) { return repo.findByPostProfileContainingOrPostDescContaining(keyword,keyword); }
}
