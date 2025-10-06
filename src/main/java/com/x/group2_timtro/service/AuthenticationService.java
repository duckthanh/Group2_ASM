package com.x.group2_timtro.service;

import com.nimbusds.jwt.SignedJWT;
import com.x.group2_timtro.dto.request.LoginRequest;
import com.x.group2_timtro.dto.response.LoginResponse;
import com.x.group2_timtro.entity.Token;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.TokenRepository;
import com.x.group2_timtro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;

    public LoginResponse login(LoginRequest request) {

        UsernamePasswordAuthenticationToken authenticationRequest = new UsernamePasswordAuthenticationToken(request.email(), request.password());

        Authentication authentication = authenticationManager.authenticate(authenticationRequest);

        User user = (User) authentication.getPrincipal();

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);



        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void logout(String accessToken) throws ParseException {
    SignedJWT signedJWT = SignedJWT.parse(accessToken);
    String jwtID = signedJWT.getJWTClaimsSet().getJWTID();

    Token token = Token.builder()
        .tokenId(jwtID)
        .build();

    tokenRepository.save(token);
    }

}
