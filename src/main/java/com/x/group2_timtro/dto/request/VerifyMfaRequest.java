package com.x.group2_timtro.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyMfaRequest {
    private String email;
    private String password;
    private String code; // Mã OTP 6 số
}

