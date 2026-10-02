package com.foodflow.service;
import com.foodflow.dto.OrderDto;
import com.foodflow.dto.OrderItemDto;
import com.foodflow.entity.*;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.repository.CartRepository;
import com.foodflow.repository.OrderRepository;
import com.foodflow.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final SimpMessagingTemplate messagingTemplate;
    private final PaymentService paymentService;

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository, UserRepository userRepository, CartService cartService, SimpMessagingTemplate messagingTemplate, PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
        this.messagingTemplate = messagingTemplate;
        this.paymentService = paymentService;
    }

    public OrderDto placeOrder(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        
        if (cart.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderStatus(OrderStatus.PLACED);
        order.setOrderItems(new ArrayList<>());
        
        BigDecimal total = BigDecimal.ZERO;
        
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setFoodItem(cartItem.getFoodItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getFoodItem().getPrice());
            orderItem.setOrder(order);
            
            order.getOrderItems().add(orderItem);
            total = total.add(orderItem.getPrice().multiply(new BigDecimal(orderItem.getQuantity())));
        }
        
        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);
        
        cartService.clearCart(cart);
        
        OrderDto dto = mapToDto(savedOrder);
        try {
            com.stripe.model.checkout.Session session = paymentService.createCheckoutSession(savedOrder);
            savedOrder.setStripeSessionId(session.getId());
            orderRepository.save(savedOrder);
            dto.setStripeSessionId(session.getId());
            dto.setCheckoutUrl(session.getUrl());
        } catch (com.stripe.exception.StripeException e) {
            e.printStackTrace();
            // Fallback or handle error
        }
        
        return dto;
    }

    public OrderDto getOrderById(Long id) {
        return mapToDto(orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    public List<OrderDto> getUserOrders(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public OrderDto updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setOrderStatus(status);
        Order savedOrder = orderRepository.save(order);
        OrderDto dto = mapToDto(savedOrder);
        
        // Broadcast the update to the specific order's topic
        messagingTemplate.convertAndSend("/topic/orders/" + id, dto);
        
        return dto;
    }

    private OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setStripeSessionId(order.getStripeSessionId());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setOrderItems(order.getOrderItems().stream().map(item -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setId(item.getId());
            itemDto.setFoodItemId(item.getFoodItem().getId());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setPrice(item.getPrice());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
