package br.com.concessionaria.user;

import br.com.concessionaria.user.model.User;
import br.com.concessionaria.user.model.User.Profile;
import br.com.concessionaria.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("vendedor_teste@gmail.com").isEmpty()) {
                User vendedor = new User();
                vendedor.setDocument("12345678900");
                vendedor.setName("vendedor_teste");
                vendedor.setUsername("vendedor_teste@gmail.com");
                vendedor.setPassword("123456");
                vendedor.setProfile(Profile.VENDEDOR);
                userRepository.save(vendedor);
            }
            if (userRepository.findByUsername("cliente_teste@gmail.com").isEmpty()) {
                User cliente = new User();
                cliente.setDocument("98765432100");
                cliente.setName("cliente_teste");
                cliente.setUsername("cliente_teste@gmail.com");
                cliente.setPassword("123456");
                cliente.setProfile(Profile.CLIENTE);
                userRepository.save(cliente);
            }
        };
    }
}
