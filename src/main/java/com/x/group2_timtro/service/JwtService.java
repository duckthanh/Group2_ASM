package com.x.group2_timtro.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.x.group2_timtro.entity.User;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {

private String secretKey = "CGS/drH3KcTzGTKr2rs0ngj50XfRkhxAofbyqCWXhMQCHyuVGesvi/hKxpj0MDw16cfaCzk+mvND77sqbbjX3A==";

public String generateAccessToken(User user) {

    JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

    //.Payload
    Date issueTime = new Date();

    JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
            .subject(user.getEmail())
            .issueTime(issueTime)
            .expirationTime(new Date(issueTime.toInstant().plus(30, ChronoUnit.MINUTES).toEpochMilli()))
            .claim("id", user.getId())
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


}
