package com.x.group2_timtro.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRoomRequest {
    private String name;
    private String imageUrl;
    private String detail;
    private Double price;
    private String location;
    private String contact;
    private Boolean isAvailable;
}

