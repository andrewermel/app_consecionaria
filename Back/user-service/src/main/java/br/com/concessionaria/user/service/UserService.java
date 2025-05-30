package br.com.concessionaria.user.service;

import br.com.concessionaria.user.model.User;
import br.com.concessionaria.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Serviço responsável pela lógica de negócio relacionada aos usuários.
 * 
 * Esta classe implementa as regras de negócio para operações CRUD de usuários,
 * fornecendo uma camada de abstração entre os controladores e o repositório.
 * Gerencia operações como criação, busca, atualização e remoção de usuários.
 * 
 * @author Sistema de Concessionária
 * @version 1.0
 * @since 2025
 */
@Service
public class UserService {
    
    /**
     * Repositório para acesso aos dados dos usuários.
     * Injeta automaticamente a implementação do repositório JPA.
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Retorna todos os usuários cadastrados no sistema.
     * 
     * @return Lista com todos os usuários cadastrados
     */
    public List<User> findAll() {
        return userRepository.findAll();
    }

    /**
     * Busca um usuário específico pelo seu identificador único.
     * 
     * @param id Identificador único do usuário
     * @return Optional contendo o usuário se encontrado, vazio caso contrário
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Busca um usuário pelo nome de usuário (username/login).
     * Utilizado principalmente para autenticação e verificação de duplicatas.
     * 
     * @param username Nome de usuário para busca
     * @return Optional contendo o usuário se encontrado, vazio caso contrário
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Busca um usuário pelo documento (CPF).
     * Garante que não existam usuários duplicados com o mesmo CPF.
     * 
     * @param document Número do documento (CPF) para busca
     * @return Optional contendo o usuário se encontrado, vazio caso contrário
     */
    public Optional<User> findByDocument(String document) {
        return userRepository.findByDocument(document);
    }

    /**
     * Salva um novo usuário ou atualiza um usuário existente.
     * Persiste os dados do usuário no banco de dados.
     * 
     * @param user Objeto User a ser salvo
     * @return Usuário salvo com ID gerado (se novo) ou atualizado
     */
    public User save(User user) {
        return userRepository.save(user);
    }

    /**
     * Remove um usuário do sistema pelo seu identificador.
     * 
     * @param id Identificador único do usuário a ser removido
     */
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
