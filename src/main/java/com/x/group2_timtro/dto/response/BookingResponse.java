package com.x.group2_timtro.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class BookingResponse {
    private Long id;
    private Long roomId;
    private String roomName;
    private Long tenantId;
    private String tenantUsername;
    private Integer duration;
    private String durationUnit;
    private LocalDate moveInDate;
    private Integer numberOfPeople;
    private String phoneNumber;
    private String note;
    private String status;
    private Boolean isDeposit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

