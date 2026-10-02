package com.foodflow.dto;
import lombok.Data;
@Data public class RestaurantDto {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String imageUrl;
}
