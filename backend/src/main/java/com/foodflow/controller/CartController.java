package com.foodflow.controller;
import com.foodflow.dto.CartDto;
import com.foodflow.dto.CartItemRequest;
import com.foodflow.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService service;
    public CartController(CartService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<CartDto> getCart(Authentication authentication) {
        return ResponseEntity.ok(service.getCart(authentication.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(Authentication authentication, @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(service.addToCart(authentication.getName(), request));
    }

    @PutMapping("/update")
    public ResponseEntity<CartDto> updateCartItem(Authentication authentication, @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(service.updateCartItem(authentication.getName(), request));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<CartDto> removeCartItem(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(service.removeCartItem(authentication.getName(), id));
    }
}
