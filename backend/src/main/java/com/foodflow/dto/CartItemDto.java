package com.foodflow.dto;
import lombok.Data;
@Data public class CartItemDto {
    private Long id;
    private Long foodItemId;
    private String foodItemName;
    private Integer quantity;
}
