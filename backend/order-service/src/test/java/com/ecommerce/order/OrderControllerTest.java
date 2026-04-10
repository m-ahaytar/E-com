package com.ecommerce.order;

import com.ecommerce.order.controller.OrderController;
import com.ecommerce.order.dto.CreateOrderDTO;
import com.ecommerce.order.dto.OrderDTO;
import com.ecommerce.order.dto.OrderItemDTO;
import com.ecommerce.order.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Test
    void createOrder_Success() throws Exception {
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setProductName("Test Product");
        itemDTO.setQuantity(2);
        itemDTO.setPrice(10.99);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);
        orderDTO.setUserId(1L);
        orderDTO.setStatus("PENDING");
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setItems(Collections.singletonList(itemDTO));

        when(orderService.createOrder(any(CreateOrderDTO.class))).thenReturn(orderDTO);

        mockMvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":1,\"items\":[{\"productId\":1,\"productName\":\"Test Product\",\"quantity\":2,\"price\":10.99}]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getOrdersByUserId_Success() throws Exception {
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setProductName("Test Product");
        itemDTO.setQuantity(2);
        itemDTO.setPrice(10.99);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);
        orderDTO.setUserId(1L);
        orderDTO.setStatus("PENDING");
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setItems(Collections.singletonList(itemDTO));

        List<OrderDTO> orders = Collections.singletonList(orderDTO);

        when(orderService.getOrdersByUserId(1L)).thenReturn(orders);

        mockMvc.perform(get("/orders/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void getOrderById_Success() throws Exception {
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setProductName("Test Product");
        itemDTO.setQuantity(2);
        itemDTO.setPrice(10.99);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);
        orderDTO.setUserId(1L);
        orderDTO.setStatus("COMPLETED");
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setItems(Collections.singletonList(itemDTO));

        when(orderService.getOrderById(1L)).thenReturn(orderDTO);

        mockMvc.perform(get("/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void getOrderById_NotFound() throws Exception {
        when(orderService.getOrderById(999L)).thenReturn(null);

        mockMvc.perform(get("/orders/999"))
                .andExpect(status().isNotFound());
    }
}