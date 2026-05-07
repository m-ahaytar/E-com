package com.ecommerce.payment;

import com.ecommerce.payment.controller.PaymentController;
import com.ecommerce.payment.dto.PaymentDTO;
import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.dto.PaymentUpdateRequest;
import com.ecommerce.payment.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
        PaymentDTO paymentDTO = new PaymentDTO(2L, 1L, "CASH", "PENDING", 50.00, LocalDateTime.now());

        when(paymentService.processPayment(any(PaymentRequest.class))).thenReturn(paymentDTO);

        mockMvc.perform(post("/payments/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderId\":1,\"method\":\"CASH\",\"amount\":50.00}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.method").value("CASH"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getAllPayments_Success() throws Exception {
        PaymentDTO p1 = new PaymentDTO(1L, 1L, "CARD", "COMPLETED", 100.00, LocalDateTime.now());
        PaymentDTO p2 = new PaymentDTO(2L, 2L, "CASH", "PENDING", 55.00, LocalDateTime.now());
        List<PaymentDTO> payments = List.of(p1, p2);

        when(paymentService.getAllPayments()).thenReturn(payments);

        mockMvc.perform(get("/payments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void getPaymentById_Success() throws Exception {
        PaymentDTO paymentDTO = new PaymentDTO(10L, 4L, "CARD", "COMPLETED", 80.00, LocalDateTime.now());
        when(paymentService.getPaymentById(10L)).thenReturn(Optional.of(paymentDTO));

        mockMvc.perform(get("/payments/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.orderId").value(4));
    }

    @Test
    void updatePayment_Success() throws Exception {
        PaymentDTO updated = new PaymentDTO(3L, 1L, "CARD", "COMPLETED", 120.00, LocalDateTime.now());
        when(paymentService.updatePayment(eq(3L), any(PaymentUpdateRequest.class))).thenReturn(Optional.of(updated));

        mockMvc.perform(put("/payments/3")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"method\":\"CARD\",\"status\":\"COMPLETED\",\"amount\":120.0}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.amount").value(120.0));
    }

    @Test
    void deletePayment_Success() throws Exception {
        when(paymentService.deletePayment(3L)).thenReturn(true);

        mockMvc.perform(delete("/payments/3"))
                .andExpect(status().isNoContent());
    }
}