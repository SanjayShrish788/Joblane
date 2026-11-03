package com.sanjay.spring_boot_rest;

import com.sanjay.spring_boot_rest.model.User;
import com.sanjay.spring_boot_rest.repo.UserRepo;
import com.sanjay.spring_boot_rest.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserRepo users;
    private final UserService service;

    public UserController(UserRepo users, UserService service) {
        this.users = users;
        this.service = service;
    }

    @PostMapping("/register")
    public synchronized ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        String username = user.getUsername() == null ? "" : user.getUsername().trim();
        String password = user.getPassword();
        if (!username.matches("[A-Za-z0-9_.-]{3,40}") || password == null
                || password.length() < 8 || password.getBytes(StandardCharsets.UTF_8).length > 72) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid username or password"));
        }
        if (users.findByUsername(username) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username already exists"));
        }
        // The existing User entity uses manually assigned IDs.
        int nextId = users.findAll().stream().mapToInt(User::getId).max().orElse(0) + 1;
        user.setId(nextId);
        user.setUsername(username);
        service.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("username", username));
    }
}
