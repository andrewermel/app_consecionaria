package br.com.concessionaria.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCrypt;

@Entity // Indica que esta classe é uma entidade JPA
@Table(name = "users") // Define o nome da tabela no banco de dados
@Data // Lombok: gera getters, setters, equals, hashCode e toString automaticamente
@NoArgsConstructor // Lombok: gera construtor sem argumentos
@AllArgsConstructor // Lombok: gera construtor com todos os argumentos
public class User {
    @Id // Chave primária da entidade
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento do ID
    private Long id;

    @Column(nullable = false) // Campo obrigatório (documento do usuário, ex: CPF)
    private String document;

    @Column(nullable = false) // Campo obrigatório (nome do usuário)
    private String name;

    @Column(nullable = false, unique = true) // Campo obrigatório e único (login do usuário)
    private String username;

    @Column(nullable = false) // Campo obrigatório (senha do usuário)
    private String password;

    @Enumerated(EnumType.STRING) // Enum armazenado como texto
    @Column(nullable = false) // Campo obrigatório (perfil do usuário)
    private Profile profile;

    // Criptografa e define a senha do usuário
    public void setPassword(String password) {
        this.password = BCrypt.hashpw(password, BCrypt.gensalt());
    }

    // Define o documento do usuário (sem criptografia)
    public void setDocument(String document) {
        this.document = document;
    }

    // Define o nome do usuário (sem criptografia)
    public void setName(String name) {
        this.name = name;
    }

    // Define o username do usuário (sem criptografia)
    public void setUsername(String username) {
        this.username = username;
    }

    // Enum para os perfis de acesso do usuário
    public enum Profile {
        VENDEDOR, CLIENTE
    }
}
