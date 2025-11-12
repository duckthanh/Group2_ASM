package com.x.group2_timtro.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.x.group2_timtro.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class JwtService {

    @Value("${jwt.secret-key}")
    private String secretKey;

public String generateAccessToken(User user) {

    JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

    //.Payload
    Date issueTime = new Date();

    List<String> authorities = user.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority).toList(); //ca 3 role user admin owner

    JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
            .subject(user.getEmail())
            .issueTime(issueTime)
            .expirationTime(new Date(issueTime.toInstant().plus(24, ChronoUnit.HOURS).toEpochMilli()))  // 24 hours instead of 30 minutes
            .claim("id", user.getId())
            .claim("authorities", authorities)
            .jwtID(UUID.randomUUID().toString())
            .build();

    return signToken(header, claimsSet);
}

public String generateRefreshToken(User user) {
    //Header
    JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

    //Payload
    Date issueTime = new Date();

    JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
            .subject(user.getEmail())
            .issueTime(issueTime)
            .expirationTime(new Date(issueTime.toInstant().plus(14, ChronoUnit.DAYS).toEpochMilli()))
            .claim("id", user.getId())
            .jwtID(UUID.randomUUID().toString())
            .build();

    return signToken(header, claimsSet);
}

    //reset token
    public String generateResetToken(String email) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            Date issueTime = new Date();

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(email)
                    .issueTime(issueTime)
                    .expirationTime(new Date(issueTime.toInstant().plus(15, ChronoUnit.MINUTES).toEpochMilli()))
                    .jwtID(UUID.randomUUID().toString())
                    .build();

            JWSObject jwsObject = new JWSObject(header, new Payload(claimsSet.toJSONObject()));
            jwsObject.sign(new MACSigner(secretKey));
            return jwsObject.serialize();

        } catch (JOSEException e) {
            throw new RuntimeException("Failed to generate reset token", e);
        }
    }

    // Verify and extract email from reset token
    public String validateAndExtractEmail(String token) {
        try {
            JWSObject jwsObject = JWSObject.parse(token);
            JWTClaimsSet claims = JWTClaimsSet.parse(jwsObject.getPayload().toJSONObject());

            Date exp = claims.getExpirationTime();
            if (exp.before(new Date())) {
                throw new RuntimeException("Token đã hết hạn.");
            }

            return claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn.");
        }
    }

    private String signToken(JWSHeader header, JWTClaimsSet claimsSet) {
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Cannot sign JWT token", e);
        }
    }

}
