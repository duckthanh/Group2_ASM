package com.x.group2_timtro.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnableMfaRequest {
    private String secret;
    private String code; // Mã 6 số để xác nhận
}

