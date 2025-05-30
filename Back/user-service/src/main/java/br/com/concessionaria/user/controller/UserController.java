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

/**
 * Controller responsável pelo gerenciamento de usuários da concessionária.
 * Fornece endpoints para operações CRUD (Create, Read, Update, Delete) de usuários.
 * Apenas usuários com perfil VENDEDOR podem acessar a maioria dos endpoints.
 */
@RestController
@RequestMapping("/users") // Define que todos os endpoints deste controller começam com /users
public class UserController {
    
    // Injeta automaticamente o serviço de usuários
    @Autowired
    private UserService userService;

    /**
     * Lista todos os usuários cadastrados no sistema.
     * Endpoint: GET /users
     * Acesso: Apenas usuários com perfil VENDEDOR
     * 
     * @return Lista de usuários com suas informações básicas
     */
    @PreAuthorize("hasAuthority('VENDEDOR')") // Apenas vendedores podem listar usuários
    @GetMapping
    public ResponseEntity<List<UserListResponse>> listUsers() {
        // Busca todos os usuários e converte para DTO de resposta
        List<UserListResponse> users = userService.findAll().stream()
                .map(user -> new UserListResponse(
                        user.getDocument(),  // CPF do usuário
                        user.getName(),      // Nome completo
                        user.getUsername(),  // Email de login
                        user.getProfile().name() // Perfil (VENDEDOR ou CLIENTE)
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     * Cria um novo usuário no sistema.
     * Endpoint: POST /users
     * Acesso: Público (não requer autenticação)
     * 
     * @param request Dados do usuário a ser criado
     * @return Dados do usuário criado
     */
    @PostMapping
    public ResponseEntity<UserListResponse> createUser(@RequestBody CreateUserRequest request) {
        // Cria um novo objeto User com os dados recebidos
        User user = new User();
        user.setDocument(request.getDocument());   // Define o CPF
        user.setName(request.getName());           // Define o nome completo
        user.setUsername(request.getUsername());   // Define o email de login
        user.setPassword(request.getPassword());   // Define a senha (será criptografada automaticamente)
        user.setProfile(User.Profile.valueOf(request.getProfile())); // Define o perfil (VENDEDOR ou CLIENTE)
        
        // Salva o usuário no banco de dados
        User saved = userService.save(user);
        
        // Retorna os dados do usuário criado (sem a senha por segurança)
        return ResponseEntity.ok(new UserListResponse(
                saved.getDocument(),
                saved.getName(),
                saved.getUsername(),
                saved.getProfile().name()
        ));
    }

    /**
     * Busca um usuário específico pelo CPF.
     * Endpoint: GET /users/{cpf}
     * Acesso: Apenas usuários com perfil VENDEDOR
     * 
     * @param cpf CPF do usuário a ser buscado
     * @return Dados do usuário encontrado ou 404 se não encontrado
     */
    @PreAuthorize("hasAuthority('VENDEDOR')") // Apenas vendedores podem buscar usuários específicos
    @GetMapping("/{cpf}")
    public ResponseEntity<UserListResponse> getUserByCpf(@PathVariable String cpf) {
        // Busca o usuário pelo CPF
        Optional<User> userOpt = userService.findByDocument(cpf);
        
        // Se não encontrou o usuário, retorna erro 404
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Converte os dados do usuário para DTO de resposta
        User user = userOpt.get();
        return ResponseEntity.ok(new UserListResponse(
                user.getDocument(),
                user.getName(),
                user.getUsername(),
                user.getProfile().name()
        ));
    }

    /**
     * Atualiza os dados de um usuário existente.
     * Endpoint: PUT /users/{cpf}
     * Acesso: Apenas usuários com perfil VENDEDOR
     * 
     * @param cpf CPF do usuário a ser atualizado
     * @param request Novos dados do usuário (campos opcionais)
     * @return Dados do usuário atualizado ou 404 se não encontrado
     */
    @PreAuthorize("hasAuthority('VENDEDOR')") // Apenas vendedores podem atualizar usuários
    @PutMapping("/{cpf}")
    public ResponseEntity<UserListResponse> updateUser(@PathVariable String cpf, @RequestBody UpdateUserRequest request) {
        // Busca o usuário pelo CPF
        Optional<User> userOpt = userService.findByDocument(cpf);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Atualiza apenas os campos que foram enviados na requisição
        User user = userOpt.get();
        if (request.getName() != null) {
            user.setName(request.getName()); // Atualiza o nome se fornecido
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername()); // Atualiza o email se fornecido
        }
        if (request.getProfile() != null) {
            user.setProfile(User.Profile.valueOf(request.getProfile())); // Atualiza o perfil se fornecido
        }
        if (request.getPassword() != null) {
            user.setPassword(request.getPassword()); // Atualiza a senha se fornecida
        }
        
        // Salva as alterações no banco de dados
        User updated = userService.save(user);
        return ResponseEntity.ok(new UserListResponse(
                updated.getDocument(),
                updated.getName(),
                updated.getUsername(),
                updated.getProfile().name()
        ));
    }

    /**
     * Remove um usuário do sistema.
     * Endpoint: DELETE /users/{cpf}
     * Acesso: Apenas usuários com perfil VENDEDOR
     * 
     * @param cpf CPF do usuário a ser removido
     * @return Resposta vazia com status 204 (No Content) ou 404 se não encontrado
     */
    @PreAuthorize("hasAuthority('VENDEDOR')") // Apenas vendedores podem excluir usuários
    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> deleteUser(@PathVariable String cpf) {
        // Busca o usuário pelo CPF
        Optional<User> userOpt = userService.findByDocument(cpf);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Remove o usuário do banco de dados usando seu ID interno
        userService.deleteById(userOpt.get().getId());
        return ResponseEntity.noContent().build(); // Retorna status 204 (No Content)
    }

    /**
     * DTO (Data Transfer Object) para resposta de listagem de usuários.
     * Contém apenas as informações básicas que devem ser expostas publicamente.
     */
    @Data
    public static class UserListResponse {
        private final String document;  // CPF do usuário
        private final String name;      // Nome completo
        private final String username;  // Email de login
        private final String profile;   // Perfil (VENDEDOR ou CLIENTE)
    }

    /**
     * DTO para criação de novos usuários.
     * Contém todos os campos obrigatórios para criar um usuário.
     */
    @Data
    public static class CreateUserRequest {
        private String document;  // CPF do usuário (obrigatório)
        private String name;      // Nome completo (obrigatório)
        private String username;  // Email de login (obrigatório)
        private String password;  // Senha (obrigatório)
        private String profile;   // Perfil: "VENDEDOR" ou "CLIENTE" (obrigatório)
    }

    /**
     * DTO para atualização de usuários existentes.
     * Todos os campos são opcionais - apenas os fornecidos serão atualizados.
     */
    @Data
    public static class UpdateUserRequest {
        private String name;      // Nome completo (opcional)
        private String username;  // Email de login (opcional)
        private String password;  // Nova senha (opcional)
        private String profile;   // Novo perfil: "VENDEDOR" ou "CLIENTE" (opcional)
    }
}
