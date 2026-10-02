package com.foodflow.service;

import com.foodflow.entity.Order;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendOrderConfirmation(Order order) {
        CompletableFuture.runAsync(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage(); 
                message.setFrom("noreply@foodflow.com");
                message.setTo(order.getUser().getEmail()); 
                message.setSubject("Order Confirmation #" + order.getId()); 
                message.setText("Thank you for your order!\n\n" +
                                "Your order #" + order.getId() + " has been successfully placed.\n" +
                                "Total Amount: ₹" + order.getTotalAmount() + "\n\n" +
                                "We are preparing your food and it will be delivered soon.");
                emailSender.send(message);
                System.out.println("Order confirmation email sent to " + order.getUser().getEmail());
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
        });
    }
}
