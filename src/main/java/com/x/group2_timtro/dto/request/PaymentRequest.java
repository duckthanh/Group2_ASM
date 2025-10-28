package com.x.group2_timtro.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Double amount;
    private String method; // "CASH", "BANK_TRANSFER", "MOMO", "VNPAY"
    private String note;
}

