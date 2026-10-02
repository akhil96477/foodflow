package com.foodflow.service;
import com.foodflow.dto.RestaurantDto;
import com.foodflow.entity.Restaurant;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.repository.RestaurantRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    private final RestaurantRepository repository;
    public RestaurantService(RestaurantRepository repository) { this.repository = repository; }

    @Cacheable(value = "restaurants", key = "#search != null ? #search : 'ALL'")
    public List<RestaurantDto> getAllRestaurants(String search) {
        List<Restaurant> restaurants;
        if (search != null && !search.trim().isEmpty()) {
            restaurants = repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search);
        } else {
            restaurants = repository.findAll();
        }
        return restaurants.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Cacheable(value = "restaurant", key = "#id")
    public RestaurantDto getRestaurantById(Long id) {
        Restaurant restaurant = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        return mapToDto(restaurant);
    }

    @CacheEvict(value = {"restaurants", "restaurant", "menu"}, allEntries = true)
    public RestaurantDto createRestaurant(RestaurantDto dto) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setImageUrl(dto.getImageUrl());
        return mapToDto(repository.save(restaurant));
    }

    @CacheEvict(value = {"restaurants", "restaurant", "menu"}, allEntries = true)
    public RestaurantDto updateRestaurant(Long id, RestaurantDto dto) {
        Restaurant restaurant = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setImageUrl(dto.getImageUrl());
        return mapToDto(repository.save(restaurant));
    }

    @CacheEvict(value = {"restaurants", "restaurant", "menu"}, allEntries = true)
    public void deleteRestaurant(Long id) {
        repository.deleteById(id);
    }

    private RestaurantDto mapToDto(Restaurant restaurant) {
        RestaurantDto dto = new RestaurantDto();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setDescription(restaurant.getDescription());
        dto.setAddress(restaurant.getAddress());
        dto.setImageUrl(restaurant.getImageUrl());
        return dto;
    }
}
