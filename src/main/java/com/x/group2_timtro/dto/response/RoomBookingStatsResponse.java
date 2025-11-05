package com.x.group2_timtro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomBookingStatsResponse {
    private Long id;
    private String name;
    private String imageUrl;
    private String location;
    private Double price;
    private Long totalBookings;
    
}
