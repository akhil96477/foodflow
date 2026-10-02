package com.foodflow.service;
import com.foodflow.dto.FoodItemDto;
import com.foodflow.entity.FoodItem;
import com.foodflow.entity.Restaurant;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.repository.FoodItemRepository;
import com.foodflow.repository.RestaurantRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodItemService {
    private final FoodItemRepository repository;
    private final RestaurantRepository restaurantRepository;

    public FoodItemService(FoodItemRepository repository, RestaurantRepository restaurantRepository) {
        this.repository = repository;
        this.restaurantRepository = restaurantRepository;
    }

    @Cacheable(value = "menu", key = "#restaurantId")
    public List<FoodItemDto> getMenuByRestaurant(Long restaurantId) {
        return repository.findByRestaurantId(restaurantId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @CacheEvict(value = "menu", allEntries = true)
    public FoodItemDto createFoodItem(FoodItemDto dto) {
        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        FoodItem item = new FoodItem();
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setImageUrl(dto.getImageUrl());
        item.setRestaurant(restaurant);
        return mapToDto(repository.save(item));
    }

    @CacheEvict(value = "menu", allEntries = true)
    public FoodItemDto updateFoodItem(Long id, FoodItemDto dto) {
        FoodItem item = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Food item not found"));
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setImageUrl(dto.getImageUrl());
        return mapToDto(repository.save(item));
    }

    @CacheEvict(value = "menu", allEntries = true)
    public void deleteFoodItem(Long id) {
        repository.deleteById(id);
    }

    private FoodItemDto mapToDto(FoodItem item) {
        FoodItemDto dto = new FoodItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setImageUrl(item.getImageUrl());
        dto.setRestaurantId(item.getRestaurant().getId());
        return dto;
    }
}
