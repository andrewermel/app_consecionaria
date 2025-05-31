package br.com.concessionaria.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCrypt;

/**
 * Entidade que representa um usuário do sistema da concessionária.
 * Armazena informações pessoais, credenciais de acesso e perfil de permissões.
 * As senhas são automaticamente criptografadas usando BCrypt para segurança.
 */
@Entity // Indica que esta classe é uma entidade JPA (mapeada para uma tabela do banco)
@Table(name = "users") // Define o nome da tabela no banco de dados como "users"
@Data // Lombok: gera getters, setters, equals, hashCode e toString automaticamente
@NoArgsConstructor // Lombok: gera construtor sem argumentos (necessário para JPA)
@AllArgsConstructor // Lombok: gera construtor com todos os argumentos
public class User {
    
    /**
     * Identificador único do usuário no sistema.
     * Gerado automaticamente pelo banco de dados.
     */
    @Id // Define como chave primária da entidade
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento do ID
    private Long id;

    /**
     * Documento de identificação do usuário (CPF).
     * Campo obrigatório e usado para identificar o usuário.
     */
    @Column(nullable = false) // Campo obrigatório no banco de dados
    private String document;

    /**
     * Nome completo do usuário.
     * Campo obrigatório usado para exibição e identificação.
     */
    @Column(nullable = false) // Campo obrigatório no banco de dados
    private String name;

    /**
     * Email do usuário, usado como login no sistema.
     * Campo obrigatório e único - cada email pode ter apenas uma conta.
     */
    @Column(nullable = false, unique = true) // Campo obrigatório e único no banco
    private String username;

    /**
     * Senha do usuário criptografada com BCrypt.
     * A senha é automaticamente criptografada quando definida via setter.
     */
    @Column(nullable = false) // Campo obrigatório no banco de dados
    private String password;

    /**
     * Perfil de acesso do usuário no sistema.
     * Define as permissões que o usuário possui (VENDEDOR ou CLIENTE).
     */
    @Enumerated(EnumType.STRING) // Enum armazenado como texto no banco
    @Column(nullable = false) // Campo obrigatório no banco de dados
    private Profile profile;

    /**
     * Indica se o usuário é um cliente VIP.
     * Clientes VIP recebem descontos especiais nas compras.
     * Aplicável apenas para usuários com perfil CLIENTE.
     */
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean vip = false;

    /**
     * Define a senha do usuário com criptografia automática.
     * A senha é criptografada usando BCrypt antes de ser armazenada.
     * 
     * @param password Senha em texto plano a ser criptografada
     */
    public void setPassword(String password) {
        this.password = BCrypt.hashpw(password, BCrypt.gensalt());
    }

    /**
     * Define o documento (CPF) do usuário.
     * 
     * @param document CPF do usuário
     */
    public void setDocument(String document) {
        this.document = document;
    }

    /**
     * Define o nome completo do usuário.
     * 
     * @param name Nome completo do usuário
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Define o email (username) do usuário.
     * 
     * @param username Email do usuário usado para login
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Define o perfil de acesso do usuário.
     * 
     * @param profile Perfil do usuário (VENDEDOR ou CLIENTE)
     */
    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    /**
     * Define se o usuário é VIP.
     * 
     * @param vip True se o usuário é VIP, false caso contrário
     */
    public void setVip(Boolean vip) {
        this.vip = vip != null ? vip : false;
    }

    /**
     * Enumeration que define os tipos de perfil de acesso do usuário.
     * VENDEDOR: Possui acesso completo a todas as funcionalidades do sistema
     * CLIENTE: Possui acesso limitado, apenas para visualizar e comprar veículos
     */
    public enum Profile {
        VENDEDOR, // Funcionário da concessionária com permissões administrativas
        CLIENTE   // Cliente que pode visualizar e comprar veículos
    }
}
