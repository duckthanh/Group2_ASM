package com.x.group2_timtro.service;

import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class AuthenticationServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthenticationService authenticationService;

    private final Logger log = LoggerFactory.getLogger(AuthenticationServiceTest.class);

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void forgotPassword_ShouldSendResetEmail_WhenEmailExists() {
        String email = "user@example.com";
        String token = "mockedToken123";
        String expectedLink = "http://localhost:3000/reset-password?token=" + token;
        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setUsername("HungPham");
        when(userRepository.findByEmailIgnoreCase(email)).thenReturn(Optional.of(mockUser));
        when(jwtService.generateResetToken(email)).thenReturn(token);
        authenticationService.forgotPassword(email);
        verify(userRepository).findByEmailIgnoreCase(email);
        verify(jwtService).generateResetToken(email);
        verify(emailService).sendMail(eq(email), eq("Đặt lại mật khẩu - Timtro.com"), contains(expectedLink));
        verifyNoMoreInteractions(userRepository, jwtService, emailService);
    }

    @Test
    void forgotPassword_ShouldThrowException_WhenEmailNotFound() {
        String email = "notfound@example.com";
        when(userRepository.findByEmailIgnoreCase(email)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                authenticationService.forgotPassword(email)
        );
        assertEquals("Email không tồn tại trong hệ thống.", exception.getMessage());
        verify(userRepository).findByEmailIgnoreCase(email);
        verifyNoMoreInteractions(userRepository, jwtService, emailService);
    }
}
