package com.foodflow.controller;
import com.foodflow.dto.FoodItemDto;
import com.foodflow.service.FoodItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FoodItemController {
    private final FoodItemService service;
    public FoodItemController(FoodItemService service) { this.service = service; }

    @GetMapping("/restaurants/{restaurantId}/menu")
    public ResponseEntity<List<FoodItemDto>> getMenu(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(service.getMenuByRestaurant(restaurantId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/foods")
    public ResponseEntity<FoodItemDto> createFoodItem(@RequestBody FoodItemDto dto) {
        return ResponseEntity.ok(service.createFoodItem(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/foods/{id}")
    public ResponseEntity<FoodItemDto> updateFoodItem(@PathVariable Long id, @RequestBody FoodItemDto dto) {
        return ResponseEntity.ok(service.updateFoodItem(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/foods/{id}")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        service.deleteFoodItem(id);
        return ResponseEntity.ok().build();
    }
}
