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
import java.util.stream.Collectors;

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
            .expirationTime(new Date(issueTime.toInstant().plus(30, ChronoUnit.MINUTES).toEpochMilli()))
            .claim("id", user.getId())
            .claim("authorities", authorities)
            .jwtID(UUID.randomUUID().toString())
            .build();

    Payload payload = new Payload(claimsSet.toJSONObject());

    //chu ki
    JWSObject jwsObject = new JWSObject(header, payload);
    try {
        jwsObject.sign(new MACSigner(secretKey));
    } catch (JOSEException e) {
        throw new RuntimeException(e);
    }

    return jwsObject.serialize();
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

    Payload payload = new Payload(claimsSet.toJSONObject());

    //chu ki
    JWSObject jwsObject = new JWSObject(header, payload);
    try {
        jwsObject.sign(new MACSigner(secretKey));
        }   catch (JOSEException e) {
                 throw new RuntimeException(e);
     }
            return jwsObject.serialize();

    }


}
