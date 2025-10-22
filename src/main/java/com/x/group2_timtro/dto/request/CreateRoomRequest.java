package com.x.group2_timtro.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRoomRequest {
    private String name;
    private String imageUrl;
    private String detail;
    private Double price;
    private String location;
    private String contact;
}

