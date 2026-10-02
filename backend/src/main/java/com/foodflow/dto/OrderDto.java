package com.foodflow.dto;
import com.foodflow.entity.OrderStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Data public class OrderDto {
    private Long id;
    private Long userId;
    private List<OrderItemDto> orderItems;
    private BigDecimal totalAmount;
    private OrderStatus orderStatus;
    private LocalDateTime createdAt;
    private String paymentStatus;
    private String stripeSessionId;
    private String checkoutUrl;
}
