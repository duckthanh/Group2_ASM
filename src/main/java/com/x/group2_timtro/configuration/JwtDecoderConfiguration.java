package com.x.group2_timtro.configuration;


import com.nimbusds.jwt.SignedJWT;
import com.x.group2_timtro.entity.Token;
import com.x.group2_timtro.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Date;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtDecoderConfiguration implements JwtDecoder {

    @Value("${jwt.secret-key}")
    private String secretKey;

    private final TokenRepository tokenRepository;
    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            log.debug("Decoding JWT token...");
            //trich xuat ttin tu token
            SignedJWT signedJWT = SignedJWT.parse(token);

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expirationTime.before(new Date()) ) {
                throw new JwtException("Token expired");
            }

            //check logout
            try {
                String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
                Optional<Token> tokenOptional = tokenRepository.findById(jwtId);
                if(tokenOptional.isPresent()) {
                    //neu ton tai log out
                    log.info("Token is logged out");
                    throw new JwtException("Token is logged out");
                }
            } catch (JwtException e) {
                throw e; // Re-throw JwtException
            } catch (Exception e) {
                // If tokens table doesn't exist, just skip this check
                log.warn("Could not check token repository (table may not exist yet): " + e.getMessage());
            }

            //decode, verify token
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HS512");
            if (nimbusJwtDecoder == null) {
                nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                        .macAlgorithm(MacAlgorithm.HS512)
                        .build();
            }
            return nimbusJwtDecoder.decode(token);

        } catch (ParseException e) {
            log.error("Error parsing JWT token", e);
            throw new JwtException("Invalid JWT token", e);
        } catch (JwtException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error decoding JWT", e);
            throw new JwtException("Error decoding JWT", e);
        }

    }
}
