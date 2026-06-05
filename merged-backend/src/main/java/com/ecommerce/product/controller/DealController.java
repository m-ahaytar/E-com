package com.ecommerce.product.controller;

import com.ecommerce.product.dto.DealCreateDTO;
import com.ecommerce.product.dto.DealDTO;
import com.ecommerce.product.service.DealService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deals")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @GetMapping
    public ResponseEntity<List<DealDTO>> getActiveDeals() {
        return ResponseEntity.ok(dealService.getActiveDeals());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DealDTO>> getAllDeals() {
        return ResponseEntity.ok(dealService.getAllDeals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DealDTO> getDeal(@PathVariable Long id) {
        return ResponseEntity.ok(dealService.getDeal(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<DealDTO> createDeal(@Valid @RequestBody DealCreateDTO dto) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(dealService.createDeal(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<DealDTO> updateDeal(@PathVariable Long id, @Valid @RequestBody DealCreateDTO dto) {
        return ResponseEntity.ok(dealService.updateDeal(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<Void> deleteDeal(@PathVariable Long id) {
        dealService.deleteDeal(id);
        return ResponseEntity.noContent().build();
    }
}
