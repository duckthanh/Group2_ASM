package com.x.group2_timtro.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateBookingRequest {
    private Long roomId;
    private Integer duration;
    private String durationUnit; // "MONTH" hoặc "YEAR"
    private LocalDate moveInDate;
    private Integer numberOfPeople;
    private String phoneNumber;
    private String note;
    private Boolean isDeposit; // true = đặt cọc, false = thuê ngay
}

