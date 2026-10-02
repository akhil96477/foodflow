package com.foodflow.dto;
import lombok.Data;
import java.math.BigDecimal;
@Data public class OrderItemDto {
    private Long id;
    private Long foodItemId;
    private Integer quantity;
    private BigDecimal price;
}
