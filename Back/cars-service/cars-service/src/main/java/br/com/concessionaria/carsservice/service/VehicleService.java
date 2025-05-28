package br.com.concessionaria.carsservice.service;

import br.com.concessionaria.carsservice.model.Vehicle;
import br.com.concessionaria.carsservice.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Service para regras de negócio relacionadas a veículos
@Service
public class VehicleService {
    @Autowired
    private VehicleRepository vehicleRepository;

    // Retorna todos os veículos cadastrados
    public List<Vehicle> findAll() {
        return vehicleRepository.findAll();
    }

    // Busca um veículo por ID
    public Optional<Vehicle> findById(Long id) {
        return vehicleRepository.findById(id);
    }

    // Salva ou atualiza um veículo
    public Vehicle save(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    // Remove um veículo pelo ID
    public void deleteById(Long id) {
        vehicleRepository.deleteById(id);
    }
}
