package com.x.group2_timtro.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateViewingScheduleRequest {
    private LocalDate viewingDate;
    private LocalTime viewingTime;
    private String visitorName;
    private String visitorPhone;
    private String notes;
}

