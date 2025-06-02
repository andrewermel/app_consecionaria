package br.com.concessionaria.carsservice.controller;

import br.com.concessionaria.carsservice.model.Vehicle;
import br.com.concessionaria.carsservice.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    
    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public List<Vehicle> getAllAvailable() {
        List<Vehicle> vehicles = vehicleService.findAll();
        
        if (vehicles == null) {
            return List.of();
        }
        
        return vehicles.stream()
                .filter(vehicle -> vehicle != null && 
                         vehicle.getAvailable() != null && 
                         vehicle.getAvailable())
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getById(@PathVariable Long id) {
        Optional<Vehicle> vehicle = vehicleService.findById(id);
        
        return vehicle.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Vehicle create(@RequestBody Vehicle vehicle) {
        return vehicleService.save(vehicle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> update(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        Optional<Vehicle> existingVehicle = vehicleService.findById(id);
        if (existingVehicle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        vehicle.setId(id);
        
        Vehicle updatedVehicle = vehicleService.save(vehicle);
        return ResponseEntity.ok(updatedVehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<Vehicle> existingVehicle = vehicleService.findById(id);
        if (existingVehicle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        vehicleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
