package com.x.group2_timtro.service;



import com.nimbusds.jwt.SignedJWT;
import com.x.group2_timtro.dto.request.LoginRequest;
import com.x.group2_timtro.dto.response.LoginResponse;
import com.x.group2_timtro.entity.Token;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.TokenRepository;
import com.x.group2_timtro.repository.UserRepository;
import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.text.ParseException;
import java.util.Optional;

import static dev.samstevens.totp.util.Utils.getDataUriForImage;
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public LoginResponse login(LoginRequest request) {

        UsernamePasswordAuthenticationToken authenticationRequest = new UsernamePasswordAuthenticationToken(request.email(), request.password());

        Authentication authenticate = authenticationManager.authenticate(authenticationRequest);

        User user = (User) authenticate.getPrincipal();

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return LoginResponse.builder()
                .id(user.getId())
                .username(user.getName())  // Use getName() to get actual username
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(user.getRole())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();

    }

    public void logout(String accessToken) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(accessToken);
        String jwtId = signedJWT.getJWTClaimsSet().getJWTID();

        Token token = Token.builder()
                .tokenId(jwtId)
                .build();

        tokenRepository.save(token);
    }

    //2FA
//    public SetupMFAResponse setupMfa

    public void forgotPassword(String email) {
        log.info("Forgot password request for {}", email);

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống."));

        // Generate short-lived reset token (15 minutes)
        String token = jwtService.generateResetToken(email);
        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        String subject = "Đặt lại mật khẩu - Timtro.com";
        String content = """
        Xin chào %s,

        Nhấp vào liên kết sau để đặt lại mật khẩu của bạn:
        %s

        Liên kết này sẽ hết hạn sau 15 phút.

        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
        """.formatted(user.getUsername(), resetLink);

        // Send via EmailService
        emailService.sendMail(email, subject, content);
        log.info("Reset link sent successfully to {}", email);
    }

    // Reset password: validate token and update password
    public void resetPassword(String token, String newPassword) {
        log.info("Resetting password using token...");

        String email = jwtService.validateAndExtractEmail(token);
        if (email == null) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));

        // ✅ Encrypt password properly
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        userRepository.save(user);

        log.info("✅ Password reset successful for {}", email);
    }
}