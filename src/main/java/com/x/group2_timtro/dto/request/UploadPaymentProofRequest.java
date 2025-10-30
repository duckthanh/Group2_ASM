package com.x.group2_timtro.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadPaymentProofRequest {
    private String documentUrl; // URL of the payment proof document/image
    private String fileName;    // File name
    private String note;        // Optional note
}

