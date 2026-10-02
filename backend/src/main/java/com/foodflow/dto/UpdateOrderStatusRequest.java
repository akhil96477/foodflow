package com.foodflow.dto;
import com.foodflow.entity.OrderStatus;
import lombok.Data;
@Data public class UpdateOrderStatusRequest {
    private OrderStatus status;
}
