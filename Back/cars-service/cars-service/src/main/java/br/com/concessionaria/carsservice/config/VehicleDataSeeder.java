package br.com.concessionaria.carsservice.config;

import br.com.concessionaria.carsservice.model.Vehicle;
import br.com.concessionaria.carsservice.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class VehicleDataSeeder {

    private final VehicleRepository vehicleRepository;

    @Bean
    public CommandLineRunner seedVehicleDatabase() {
        return args -> {
            if (vehicleRepository.count() == 0) {
                log.info("=== Iniciando criação de veículos iniciais ===");
                createInitialVehicles();
                log.info("=== Veículos iniciais criados com sucesso ===");
            } else {
                log.info("Banco já possui veículos. Seed não executado.");
            }
        };
    }

    private void createInitialVehicles() {
        createVehicle(2023, 75000.00, "Branco", "Onix", true);
        createVehicle(2023, 73000.00, "Prata", "Onix", true);
        createVehicle(2022, 68000.00, "Vermelho", "Onix", true);
        
        createVehicle(2023, 85000.00, "Preto", "HB20", true);
        createVehicle(2022, 78000.00, "Azul", "HB20", true);
        
        createVehicle(2024, 92000.00, "Branco", "Argo", true);
        createVehicle(2023, 87000.00, "Cinza", "Argo", true);

        createVehicle(2023, 135000.00, "Prata", "Corolla", true);
        createVehicle(2023, 138000.00, "Preto", "Corolla", true);
        createVehicle(2022, 128000.00, "Branco", "Corolla", true);
        
        createVehicle(2024, 145000.00, "Azul", "Civic", true);
        createVehicle(2023, 140000.00, "Cinza", "Civic", true);
        createVehicle(2023, 142000.00, "Vermelho", "Civic", true);

        createVehicle(2023, 125000.00, "Branco", "Sentra", true);
        createVehicle(2022, 118000.00, "Prata", "Sentra", true);

        createVehicle(2024, 185000.00, "Preto", "Compass", true);
        createVehicle(2023, 175000.00, "Branco", "Compass", true);
        createVehicle(2023, 178000.00, "Cinza", "Compass", true);

        createVehicle(2024, 195000.00, "Azul", "HR-V", true);
        createVehicle(2023, 188000.00, "Vermelho", "HR-V", true);

        createVehicle(2023, 165000.00, "Prata", "T-Cross", true);
        createVehicle(2024, 170000.00, "Preto", "T-Cross", true);

        createVehicle(2024, 285000.00, "Preto", "Camry", true);
        createVehicle(2023, 275000.00, "Prata", "Camry", true);

        createVehicle(2024, 320000.00, "Azul", "Accord", true);
        createVehicle(2023, 310000.00, "Branco", "Accord", true);

        createVehicle(2022, 125000.00, "Verde", "Corolla", false);
        createVehicle(2021, 115000.00, "Amarelo", "Civic", false);
        createVehicle(2022, 165000.00, "Roxo", "Compass", false);

        log.info("Total de veículos criados: {}", vehicleRepository.count());
        log.info("Veículos disponíveis: {}", vehicleRepository.countByAvailableTrue());
        log.info("Veículos vendidos: {}", vehicleRepository.countByAvailableFalse());
    }

    private void createVehicle(Integer year, Double price, String color, String model, Boolean available) {
        Vehicle vehicle = new Vehicle();
        vehicle.setYear(year);
        vehicle.setBasePrice(price);
        vehicle.setColor(color);
        vehicle.setModel(model);
        vehicle.setAvailable(available);
        
        Vehicle saved = vehicleRepository.save(vehicle);
        String status = available ? "disponível" : "vendido";
        log.info("✓ {} {} {} {} - R$ {} ({})", 
                saved.getYear(), saved.getModel(), saved.getColor(), 
                saved.getId(), String.format("%.2f", saved.getBasePrice()), status);
    }
}
