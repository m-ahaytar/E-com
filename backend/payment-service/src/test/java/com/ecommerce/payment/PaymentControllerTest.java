package com.ecommerce.payment;

import com.ecommerce.payment.controller.PaymentController;
import com.ecommerce.payment.dto.PaymentDTO;
import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService paymentService;

    @Test
    void processPayment_Success() throws Exception {
        PaymentRequest request = new PaymentRequest(1L, "CARD", 100.00);
        PaymentDTO paymentDTO = new PaymentDTO(1L, 1L, "CARD", "COMPLETED", 100.00, LocalDateTime.now());

        when(paymentService.processPayment(any(PaymentRequest.class))).thenReturn(paymentDTO);

        mockMvc.perform(post("/payments/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderId\":1,\"method\":\"CARD\",\"amount\":100.00}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.method").value("CARD"))
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.amount").value(100.00));
    }

    @Test
    void getPaymentByOrderId_Success() throws Exception {
        PaymentDTO paymentDTO = new PaymentDTO(1L, 1L, "CARD", "COMPLETED", 100.00, LocalDateTime.now());

        when(paymentService.getPaymentByOrderId(1L)).thenReturn(Optional.of(paymentDTO));

        mockMvc.perform(get("/payments/order/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void getPaymentByOrderId_NotFound() throws Exception {
        when(paymentService.getPaymentByOrderId(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/payments/order/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void processPayment_NonCardMethod() throws Exception {
        PaymentRequest request = new PaymentRequest(1L, "CASH", 50.00);
        PaymentDTO paymentDTO = new PaymentDTO(2L, 1L, "CASH", "PENDING", 50.00, LocalDateTime.now());

        when(paymentService.processPayment(any(PaymentRequest.class))).thenReturn(paymentDTO);

        mockMvc.perform(post("/payments/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderId\":1,\"method\":\"CASH\",\"amount\":50.00}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.method").value("CASH"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }
}