package br.com.concessionaria.user.service;

import br.com.concessionaria.user.model.User;
import br.com.concessionaria.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Classe responsável pela lógica de negócio relacionada ao usuário
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Retorna todos os usuários cadastrados
    public List<User> findAll() {
        return userRepository.findAll();
    }

    // Busca um usuário pelo ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // Busca um usuário pelo username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Salva um novo usuário
    public User save(User user) {
        return userRepository.save(user);
    }
}
