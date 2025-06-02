package br.com.concessionaria.user.config;

import br.com.concessionaria.user.model.User;
import br.com.concessionaria.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;

    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            if (userRepository.count() == 0) {
                log.info("=== Iniciando criação de dados iniciais ===");
                createInitialUsers();
                log.info("=== Dados iniciais criados com sucesso ===");
            } else {
                log.info("Banco já possui dados. Seed não executado.");
            }
        };
    }

    private void createInitialUsers() {
        User vendedor = new User();
        vendedor.setDocument("111.111.111-11");
        vendedor.setName("João Silva Vendedor");
        vendedor.setUsername("vendedor@concessionaria.com");
        vendedor.setPassword("123456");
        vendedor.setProfile(User.Profile.VENDEDOR);
        vendedor.setVip(false);
        userRepository.save(vendedor);
        log.info("✓ Vendedor criado: {}", vendedor.getName());

        User clienteNormal = new User();
        clienteNormal.setDocument("222.222.222-22");
        clienteNormal.setName("Maria Santos Cliente");
        clienteNormal.setUsername("maria@email.com");
        clienteNormal.setPassword("123456");
        clienteNormal.setProfile(User.Profile.CLIENTE);
        clienteNormal.setVip(false);
        userRepository.save(clienteNormal);
        log.info("✓ Cliente normal criado: {}", clienteNormal.getName());

        User clienteVip = new User();
        clienteVip.setDocument("333.333.333-33");
        clienteVip.setName("Carlos Oliveira VIP");
        clienteVip.setUsername("carlos.vip@email.com");
        clienteVip.setPassword("123456");
        clienteVip.setProfile(User.Profile.CLIENTE);
        clienteVip.setVip(true);
        userRepository.save(clienteVip);
        log.info("✓ Cliente VIP criado: {}", clienteVip.getName());

        log.info("Total de usuários criados: {}", userRepository.count());
        log.info("Credenciais de acesso:");
        log.info("  Vendedor: vendedor@concessionaria.com / 123456");
        log.info("  Cliente Normal: maria@email.com / 123456");
        log.info("  Cliente VIP: carlos.vip@email.com / 123456");
    }
}
