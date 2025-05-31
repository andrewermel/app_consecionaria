package br.com.concessionaria.user.config;

import br.com.concessionaria.user.model.User;
import br.com.concessionaria.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração para popular o banco de dados com dados iniciais.
 * Cria usuários de exemplo para demonstração e testes da aplicação.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;

    /**
     * Executa a criação de dados iniciais na inicialização da aplicação.
     * Só adiciona os dados se o banco estiver vazio para evitar duplicatas.
     */
    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            // Verifica se já existem usuários no banco
            if (userRepository.count() == 0) {
                log.info("=== Iniciando criação de dados iniciais ===");
                createInitialUsers();
                log.info("=== Dados iniciais criados com sucesso ===");
            } else {
                log.info("Banco já possui dados. Seed não executado.");
            }
        };
    }

    /**
     * Cria os usuários iniciais do sistema.
     */
    private void createInitialUsers() {
        // 1. Vendedor
        User vendedor = new User();
        vendedor.setDocument("111.111.111-11");
        vendedor.setName("João Silva Vendedor");
        vendedor.setUsername("vendedor@concessionaria.com");
        vendedor.setPassword("123456"); // Será criptografada automaticamente
        vendedor.setProfile(User.Profile.VENDEDOR);
        vendedor.setVip(false); // Vendedores não são VIP
        userRepository.save(vendedor);
        log.info("✓ Vendedor criado: {}", vendedor.getName());

        // 2. Cliente Normal
        User clienteNormal = new User();
        clienteNormal.setDocument("222.222.222-22");
        clienteNormal.setName("Maria Santos Cliente");
        clienteNormal.setUsername("maria@email.com");
        clienteNormal.setPassword("123456"); // Será criptografada automaticamente
        clienteNormal.setProfile(User.Profile.CLIENTE);
        clienteNormal.setVip(false);
        userRepository.save(clienteNormal);
        log.info("✓ Cliente normal criado: {}", clienteNormal.getName());

        // 3. Cliente VIP
        User clienteVip = new User();
        clienteVip.setDocument("333.333.333-33");
        clienteVip.setName("Carlos Oliveira VIP");
        clienteVip.setUsername("carlos.vip@email.com");
        clienteVip.setPassword("123456"); // Será criptografada automaticamente
        clienteVip.setProfile(User.Profile.CLIENTE);
        clienteVip.setVip(true); // Cliente VIP com 10% de desconto
        userRepository.save(clienteVip);
        log.info("✓ Cliente VIP criado: {}", clienteVip.getName());

        log.info("Total de usuários criados: {}", userRepository.count());
        log.info("Credenciais de acesso:");
        log.info("  Vendedor: vendedor@concessionaria.com / 123456");
        log.info("  Cliente Normal: maria@email.com / 123456");
        log.info("  Cliente VIP: carlos.vip@email.com / 123456");
    }
}
