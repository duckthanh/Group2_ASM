package com.x.group2_timtro.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmPaymentRequest {
    private Long documentId; // ID of the payment proof document to confirm
    private String note;     // Optional note from landlord
}

