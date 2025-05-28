package br.com.concessionaria.carsservice.controller;

import br.com.concessionaria.carsservice.model.Vehicle;
import br.com.concessionaria.carsservice.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Controller para endpoints de veículos
@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    // Lista todos os veículos disponíveis
    @GetMapping
    public List<Vehicle> getAllAvailable() {
        List<Vehicle> vehicles = vehicleService.findAll();
        if (vehicles == null) {
            return List.of(); // Retorna lista vazia se for null
        }
        return vehicles.stream()
                .filter(vehicle -> vehicle != null && vehicle.getAvailable() != null && vehicle.getAvailable())
                .toList();
    }

    // Detalhes de um veículo por ID
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getById(@PathVariable Long id) {
        Optional<Vehicle> vehicle = vehicleService.findById(id);
        return vehicle.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Cria um novo veículo
    @PostMapping
    public Vehicle create(@RequestBody Vehicle vehicle) {
        return vehicleService.save(vehicle);
    }
}
