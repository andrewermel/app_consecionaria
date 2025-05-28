package br.com.concessionaria.carsservice.config;

import br.com.concessionaria.carsservice.model.Vehicle;
import br.com.concessionaria.carsservice.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Classe para inicializar dados de exemplo no banco
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Só adiciona dados se não existirem veículos
        if (vehicleRepository.count() == 0) {
            // Criando veículos de exemplo
            Vehicle vehicle1 = new Vehicle(null, 2023, 85000.0, "Branco", "Honda Civic", true);
            Vehicle vehicle2 = new Vehicle(null, 2022, 120000.0, "Preto", "Toyota Corolla", true);
            Vehicle vehicle3 = new Vehicle(null, 2024, 95000.0, "Prata", "Hyundai HB20", true);
            Vehicle vehicle4 = new Vehicle(null, 2023, 110000.0, "Azul", "Volkswagen Jetta", true);
            Vehicle vehicle5 = new Vehicle(null, 2022, 75000.0, "Vermelho", "Chevrolet Onix", true);
            Vehicle vehicle6 = new Vehicle(null, 2023, 130000.0, "Cinza", "Nissan Sentra", false);
            Vehicle vehicle7 = new Vehicle(null, 2024, 98000.0, "Branco", "Ford Ka", true);
            Vehicle vehicle8 = new Vehicle(null, 2022, 140000.0, "Preto", "Jeep Compass", true);

            vehicleRepository.save(vehicle1);
            vehicleRepository.save(vehicle2);
            vehicleRepository.save(vehicle3);
            vehicleRepository.save(vehicle4);
            vehicleRepository.save(vehicle5);
            vehicleRepository.save(vehicle6);
            vehicleRepository.save(vehicle7);
            vehicleRepository.save(vehicle8);

            System.out.println("Dados de veículos inicializados com sucesso!");
        }
    }
}
