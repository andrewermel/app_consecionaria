package br.com.concessionaria.user.repository;

import br.com.concessionaria.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Interface responsável pelo acesso aos dados da entidade User no banco de dados
 */
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Busca um usuário pelo username (login)
     *
     * @param username o username do usuário
     * @return um Optional contendo o usuário encontrado, ou vazio se nenhum usuário foi encontrado com o username fornecido
     */
    Optional<User> findByUsername(String username);
}
