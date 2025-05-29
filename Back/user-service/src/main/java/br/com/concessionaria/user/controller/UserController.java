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

// Controller responsável pelos endpoints de usuário
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    // Endpoint para listar usuários (apenas para perfil VENDEDOR)
    @PreAuthorize("hasAuthority('VENDEDOR')")
    @GetMapping
    public ResponseEntity<List<UserListResponse>> listUsers() {
        List<UserListResponse> users = userService.findAll().stream()
                .map(user -> new UserListResponse(
                        user.getDocument(),
                        user.getName(),
                        user.getUsername(),
                        user.getProfile().name()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Endpoint para criar um novo usuário (acessível publicamente, não precisa estar autenticado)
    @PostMapping
    public ResponseEntity<UserListResponse> createUser(@RequestBody CreateUserRequest request) {
        User user = new User();
        user.setDocument(request.getDocument());
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setProfile(User.Profile.valueOf(request.getProfile()));
        User saved = userService.save(user);
        return ResponseEntity.ok(new UserListResponse(
                saved.getDocument(),
                saved.getName(),
                saved.getUsername(),
                saved.getProfile().name()
        ));
    }

    // Endpoint para buscar usuário por CPF (apenas para perfil VENDEDOR)
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
                user.getProfile().name()
        ));
    }

    // Endpoint para atualizar usuário (apenas para perfil VENDEDOR)
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
        
        User updated = userService.save(user);
        return ResponseEntity.ok(new UserListResponse(
                updated.getDocument(),
                updated.getName(),
                updated.getUsername(),
                updated.getProfile().name()
        ));
    }

    // Endpoint para excluir usuário (apenas para perfil VENDEDOR)
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

    // DTO de resposta para listagem de usuários
    @Data
    public static class UserListResponse {
        private final String document;
        private final String name;
        private final String username;
        private final String profile;
    }

    // DTO para criação de usuário
    @Data
    public static class CreateUserRequest {
        private String document;
        private String name;
        private String username;
        private String password;
        private String profile; // VENDEDOR ou CLIENTE
    }

    // DTO para atualização de usuário
    @Data
    public static class UpdateUserRequest {
        private String name;
        private String username;
        private String password;
        private String profile; // VENDEDOR ou CLIENTE
    }
}
