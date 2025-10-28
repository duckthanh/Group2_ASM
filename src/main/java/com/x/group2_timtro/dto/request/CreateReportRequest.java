package com.x.group2_timtro.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateReportRequest {
    private String reason; // "spam", "wrong_price", "fake_images", "other"
    private String description;
}

