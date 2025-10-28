package com.x.group2_timtro.service;


import com.nimbusds.jwt.SignedJWT;
import com.x.group2_timtro.dto.request.LoginRequest;
import com.x.group2_timtro.dto.response.LoginResponse;
import com.x.group2_timtro.dto.response.MfaSetupResponse;
import com.x.group2_timtro.entity.Token;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.TokenRepository;
import com.x.group2_timtro.repository.UserRepository;
import com.x.group2_timtro.service.JwtService;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;


import java.text.ParseException;

import static dev.samstevens.totp.util.Utils.getDataUriForImage;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {

        UsernamePasswordAuthenticationToken authenticationRequest = new UsernamePasswordAuthenticationToken(request.email(), request.password());

        Authentication authenticate = authenticationManager.authenticate(authenticationRequest);

        User user = (User) authenticate.getPrincipal();

        // Kiểm tra nếu user đã bật 2FA
        if (user.isMfaEnabled()) {
            // Trả về response với mfaRequired = true, không có token
            return LoginResponse.builder()
                    .id(user.getId())
                    .username(user.getName())
                    .role(user.getRole())
                    .mfaRequired(true)
                    .build();
        }

        // Nếu không có 2FA, trả về token như bình thường
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return LoginResponse.builder()
                .id(user.getId())
                .username(user.getName())  // Use getName() to get actual username
                .role(user.getRole())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .mfaRequired(false)
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
    public MfaSetupResponse generateMfaSetup(String email, String issuer) {

        SecretGenerator secretGenerator = new DefaultSecretGenerator();
        String secret = secretGenerator.generate();

       //generate QR
        QrData data = new QrData.Builder()
                .label(email)
                .secret(secret)
                .issuer(issuer)
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        QrGenerator generator = new ZxingPngQrGenerator();
        byte[] imageData;
        try {
            imageData = generator.generate(data);
        } catch (QrGenerationException e) {
            throw new RuntimeException("Lỗi khi tạo mã QR", e);
        }

        String mimeType = generator.getImageMimeType(); // mimeType = "image/png"
        String dataUri = getDataUriForImage(imageData, mimeType); // dataUri = data:image/png;base64,...

        return MfaSetupResponse.builder()
                .secret(secret)
                .qrCodeDataUri(dataUri)
                .build();
    }
    public boolean verifyMfaCode(String secret, String code) {

        // --- Bắt đầu phần code từ tài liệu ---

        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);

        // secret = secret key của người dùng
        // code = mã 6 số người dùng nhập
        boolean successful = verifier.isValidCode(secret, code);

        // --- Kết thúc phần code từ tài liệu ---

        return successful;
    }

    // Xác thực 2FA và trả về token
    public LoginResponse verifyMfaAndLogin(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        if (!user.isMfaEnabled()) {
            throw new RuntimeException("User chưa bật 2FA");
        }

        // Xác thực mã OTP
        boolean isValid = verifyMfaCode(user.getMfaSecret(), code);
        if (!isValid) {
            throw new RuntimeException("Mã OTP không đúng");
        }

        // Tạo token
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return LoginResponse.builder()
                .id(user.getId())
                .username(user.getName())
                .role(user.getRole())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .mfaRequired(false)
                .build();
    }

    // Bật 2FA cho user
    public void enableMfa(User user, String secret, String code) {
        // Xác thực mã OTP trước khi bật
        boolean isValid = verifyMfaCode(secret, code);
        if (!isValid) {
            throw new RuntimeException("Mã OTP không đúng. Không thể bật 2FA");
        }

        // Lưu secret và bật 2FA
        user.setMfaSecret(secret);
        user.setMfaEnabled(true);
        userRepository.save(user);
    }

    // Tắt 2FA cho user
    public void disableMfa(User user, String code) {
        if (!user.isMfaEnabled()) {
            throw new RuntimeException("2FA chưa được bật");
        }

        // Xác thực mã OTP trước khi tắt
        boolean isValid = verifyMfaCode(user.getMfaSecret(), code);
        if (!isValid) {
            throw new RuntimeException("Mã OTP không đúng. Không thể tắt 2FA");
        }

        // Xóa secret và tắt 2FA
        user.setMfaSecret(null);
        user.setMfaEnabled(false);
        userRepository.save(user);
    }
}


