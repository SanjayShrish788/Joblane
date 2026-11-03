package com.sanjay.spring_boot_rest.service;

import com.sanjay.spring_boot_rest.model.User;
import com.sanjay.spring_boot_rest.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    /** Hashes a new account's plain-text password before persisting it. */
    public User saveUser(User user){

        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }
}
