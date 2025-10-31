package com.x.group2_timtro.dto.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MfaSetupResponse {
    private String secret;
    private String qrCodeDataUri;
}
