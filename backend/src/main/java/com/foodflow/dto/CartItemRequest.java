package com.foodflow.dto;
import lombok.Data;
@Data public class CartItemRequest {
    private Long foodItemId;
    private Integer quantity;
}
