package com.x.group2_timtro.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {
    private Long roomId;
    private String action; // "HOLD" or "DEPOSIT" (for My Rooms feature)
    private Integer duration; // Thời hạn thuê
    private String durationUnit; // "MONTH" or "YEAR"
    private LocalDate moveInDate; // Ngày dọn vào
    private Integer numberOfPeople; // Số người
    private String phoneNumber; // Số điện thoại
    private String note; // Ghi chú
    private Double depositAmount; // Số tiền cọc (nếu action = DEPOSIT)
    private Boolean isDeposit; // For backward compatibility with old BookingService
}
