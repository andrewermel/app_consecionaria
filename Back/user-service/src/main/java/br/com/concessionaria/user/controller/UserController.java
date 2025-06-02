package br.com.concessionaria.user.controller;

import br.com.concessionaria.user.model.User;
import br.com.concessionaria.user.service.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PreAuthorize("hasAuthority('VENDEDOR')")
    @GetMapping
    public List<UserListResponse> getAllUsers() {
        return userService.findAll().stream()
                .map(user -> new UserListResponse(
                        user.getDocument(),
                        user.getName(),
                        user.getUsername(),
                        user.getProfile().name(),
                        user.getVip()
                ))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('VENDEDOR')")
    @PostMapping
    public ResponseEntity<UserListResponse> createUser(@RequestBody CreateUserRequest request) {
        if (request.getDocument() == null || request.getName() == null ||
            request.getUsername() == null || request.getPassword() == null ||
            request.getProfile() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (userService.findByDocument(request.getDocument()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        if (userService.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setDocument(request.getDocument());
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setProfile(User.Profile.valueOf(request.getProfile()));
        user.setVip(request.getVip() != null ? request.getVip() : false);

        User savedUser = userService.save(user);

        return ResponseEntity.ok(new UserListResponse(
                savedUser.getDocument(),
                savedUser.getName(),
                savedUser.getUsername(),
                savedUser.getProfile().name(),
                savedUser.getVip()
        ));
    }

    @PreAuthorize("hasAuthority('VENDEDOR')")
    @GetMapping("/{cpf}")
    public ResponseEntity<UserListResponse> getUserByCpf(@PathVariable String cpf) {
        Optional<User> userOpt = userService.findByDocument(cpf);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        return ResponseEntity.ok(new UserListResponse(
                user.getDocument(),
                user.getName(),
                user.getUsername(),
                user.getProfile().name(),
                user.getVip()
        ));
    }

    @PreAuthorize("hasAuthority('VENDEDOR')")
    @PutMapping("/{cpf}")
    public ResponseEntity<UserListResponse> updateUser(@PathVariable String cpf, @RequestBody UpdateUserRequest request) {
        Optional<User> userOpt = userService.findByDocument(cpf);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getProfile() != null) {
            user.setProfile(User.Profile.valueOf(request.getProfile()));
        }
        if (request.getPassword() != null) {
            user.setPassword(request.getPassword());
        }
        if (request.getVip() != null) {
            user.setVip(request.getVip());
        }

        User updated = userService.save(user);

        return ResponseEntity.ok(new UserListResponse(
                updated.getDocument(),
                updated.getName(),
                updated.getUsername(),
                updated.getProfile().name(),
                updated.getVip()
        ));
    }

    @PreAuthorize("hasAuthority('VENDEDOR')")
    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> deleteUser(@PathVariable String cpf) {
        Optional<User> userOpt = userService.findByDocument(cpf);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userService.deleteById(userOpt.get().getId());
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class UserListResponse {
        private final String document;
        private final String name;
        private final String username;
        private final String profile;
        private final Boolean vip;
    }

    @Data
    public static class CreateUserRequest {
        private String document;
        private String name;
        private String username;
        private String password;
        private String profile;
        private Boolean vip;
    }

    @Data
    public static class UpdateUserRequest {
        private String name;
        private String username;
        private String password;
        private String profile;
        private Boolean vip;
    }
}
