package com.foodflow.dto;
import lombok.Data;
import com.foodflow.entity.Role;
@Data public class RegisterRequest { private String name; private String email; private String password; private Role role; }
