package com.foodflow.service;
import com.foodflow.dto.CartDto;
import com.foodflow.dto.CartItemDto;
import com.foodflow.dto.CartItemRequest;
import com.foodflow.entity.Cart;
import com.foodflow.entity.CartItem;
import com.foodflow.entity.FoodItem;
import com.foodflow.entity.User;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.repository.CartItemRepository;
import com.foodflow.repository.CartRepository;
import com.foodflow.repository.FoodItemRepository;
import com.foodflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, FoodItemRepository foodItemRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.foodItemRepository = foodItemRepository;
        this.userRepository = userRepository;
    }

    public CartDto getCart(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setCartItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });
        return mapToDto(cart);
    }

    public CartDto addToCart(String email, CartItemRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setCartItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });
        
        FoodItem foodItem = foodItemRepository.findById(request.getFoodItemId()).orElseThrow(() -> new ResourceNotFoundException("Food item not found"));
        
        cart.getCartItems().stream()
            .filter(item -> item.getFoodItem().getId().equals(foodItem.getId()))
            .findFirst()
            .ifPresentOrElse(
                item -> item.setQuantity(item.getQuantity() + request.getQuantity()),
                () -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setFoodItem(foodItem);
                    newItem.setQuantity(request.getQuantity());
                    cart.getCartItems().add(newItem);
                }
            );
        return mapToDto(cartRepository.save(cart));
    }

    public CartDto updateCartItem(String email, CartItemRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow();
        cart.getCartItems().stream()
            .filter(item -> item.getFoodItem().getId().equals(request.getFoodItemId()))
            .findFirst()
            .ifPresent(item -> item.setQuantity(request.getQuantity()));
        return mapToDto(cartRepository.save(cart));
    }

    public CartDto removeCartItem(String email, Long cartItemId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getCartItems().removeIf(item -> item.getId().equals(cartItemId));
        return mapToDto(cartRepository.save(cart));
    }
    
    public void clearCart(Cart cart) {
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private CartDto mapToDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        dto.setCartItems(cart.getCartItems().stream().map(item -> {
            CartItemDto itemDto = new CartItemDto();
            itemDto.setId(item.getId());
            itemDto.setFoodItemId(item.getFoodItem().getId());
            itemDto.setFoodItemName(item.getFoodItem().getName());
            itemDto.setQuantity(item.getQuantity());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
