package com.foodflow.controller;

import com.foodflow.entity.Order;
import com.foodflow.repository.OrderRepository;
import com.foodflow.service.EmailService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class PaymentController {

    @Value("${stripe.webhook.secret:whsec_test_secret}")
    private String endpointSecret;

    private final OrderRepository orderRepository;
    private final EmailService emailService;

    public PaymentController(OrderRepository orderRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event = null;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            System.out.println("Webhook signature verification failed.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("");
        } catch (Exception e) {
            System.out.println("Error parsing webhook: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            if (dataObjectDeserializer.getObject().isPresent()) {
                Session session = (Session) dataObjectDeserializer.getObject().get();
                String orderIdStr = session.getMetadata().get("orderId");
                
                if (orderIdStr != null) {
                    Long orderId = Long.parseLong(orderIdStr);
                    orderRepository.findById(orderId).ifPresent(order -> {
                        order.setPaymentStatus("PAID");
                        orderRepository.save(order);
                        
                        emailService.sendOrderConfirmation(order);
                    });
                }
            }
        }

        return ResponseEntity.ok("");
    }
}
