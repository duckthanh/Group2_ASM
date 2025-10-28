package com.x.group2_timtro.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DisableMfaRequest {
    private String code; // Mã OTP để xác nhận tắt 2FA
}

