package com.foodflow;

import com.foodflow.entity.FoodItem;
import com.foodflow.entity.Restaurant;
import com.foodflow.entity.Role;
import com.foodflow.entity.User;
import com.foodflow.repository.FoodItemRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, RestaurantRepository restaurantRepository, FoodItemRepository foodItemRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.foodItemRepository = foodItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder().name("Admin").email("admin@foodflow.com").password(passwordEncoder.encode("admin")).role(Role.ADMIN).build());
            userRepository.save(User.builder().name("User").email("user@foodflow.com").password(passwordEncoder.encode("user")).role(Role.USER).build());
        }

        if (restaurantRepository.count() < 15) {
            String[] restaurantNames = {
                "Meghana Foods", "Punjabi Dhaba", "Bawarchi", "Haldiram's", "Truffles",
                "Empire Restaurant", "KFC", "McDonald's", "Dominos Pizza", "Pizza Hut",
                "Subway", "Burger King", "Taco Bell", "Starbucks", "Barbeque Nation", "Absolute Barbecue"
            };
            
            String[] foodImages = {
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400",
                "https://images.unsplash.com/photo-1582269243035-2e6ad1e73bef?w=400"
            };

            List<Restaurant> newRestaurants = new ArrayList<>();
            for (int i = (int) restaurantRepository.count(); i < 15; i++) {
                String rName = i < restaurantNames.length ? restaurantNames[i] : "Restaurant " + (i + 1);
                newRestaurants.add(Restaurant.builder()
                        .name(rName)
                        .address("Location " + (i + 1) + ", City Center")
                        .description("Premium quality food and dining experience.")
                        .imageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800")
                        .build());
            }
            if (!newRestaurants.isEmpty()) {
                newRestaurants = restaurantRepository.saveAll(newRestaurants);
                
                List<FoodItem> newFoodItems = new ArrayList<>();
                for (int i = 0; i < newRestaurants.size(); i++) {
                    Restaurant r = newRestaurants.get(i);
                    for (int j = 1; j <= 10; j++) {
                        newFoodItems.add(FoodItem.builder()
                                .name(r.getName() + " Special Item " + j)
                                .description("Delicious and freshly prepared " + r.getName() + " signature dish.")
                                .price(new BigDecimal(100 + (j * 25) + (i * 10)))
                                .imageUrl(foodImages[j % foodImages.length])
                                .restaurant(r)
                                .build());
                    }
                }
                foodItemRepository.saveAll(newFoodItems);
            }
        }
    }
}

