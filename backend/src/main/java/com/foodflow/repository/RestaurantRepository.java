package com.foodflow.repository;
import com.foodflow.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}
