package com.example.orderservice.controller;

import com.example.orderservice.dto.PlaceOrderRequest;
import com.example.orderservice.dto.OrderResponse;
import com.example.orderservice.entity.Order;
import com.example.orderservice.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/retailers/me/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Place Order
    @PostMapping
    public OrderResponse placeOrder(
            @RequestParam Long retailerId,
            @RequestBody PlaceOrderRequest request
    ) {
        return orderService.placeOrder(retailerId, request);
    }

    // Get Retailer Orders
    @GetMapping("/retailer")
    public List<Order> getRetailerOrders(@RequestParam Long retailerId) {
        return orderService.getOrdersByRetailer(retailerId);
    }

    // Get Farmer Orders
    @GetMapping("/farmer")
    public List<Order> getFarmerOrders(@RequestParam Long farmerId) {
        return orderService.getOrdersByFarmer(farmerId);
    }

    // Confirm Order
    @PatchMapping("/{orderId}/confirm")
    public Order confirmOrder(@PathVariable Long orderId) {
        return orderService.confirmOrder(orderId);
    }

    // Cancel Order
    @PatchMapping("/{orderId}/cancel")
    public Order cancelOrder(@PathVariable Long orderId) {
        return orderService.cancelOrder(orderId);
    }
}