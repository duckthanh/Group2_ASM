package com.x.group2_timtro.configuration;

import com.x.group2_timtro.service.UserDetailServiceCustomizer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtDecoderConfiguration jwtDecoderConfiguration;
    private final UserDetailServiceCustomizer userDetailService;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationConverter jwtAuthenticationConverter) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(authorize -> authorize
                        // Static files - public để xem ảnh (phải đặt đầu tiên)
                        .requestMatchers("/uploads/**").permitAll()
                        // Auth endpoints - public
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register", "/api/auth/create-admin","/api/auth/forgot-password","/api/auth/reset-password").permitAll()
                        // public access for top booking room
                        .requestMatchers(HttpMethod.GET, "/api/analytics/top-booked-rooms").permitAll()
                        .requestMatchers("/api/admin/revenue/**").permitAll()
                        // MFA endpoints - verify cần public (chưa có token), các endpoint khác cần authenticated
                        .requestMatchers(HttpMethod.POST, "/api/auth/mfa/verify").permitAll()
                        .requestMatchers("/api/auth/mfa/**").authenticated()
                        // User endpoints
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                        .requestMatchers("/api/users").authenticated()
                        .requestMatchers("/api/users/**").authenticated()
                        // Room endpoints - GET public, POST/PUT/DELETE authenticated
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rooms/test").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/rooms/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").authenticated()
                        // File upload
                        .requestMatchers(HttpMethod.POST, "/api/upload/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/files/**").permitAll()
                        // Booking endpoints - authenticated
                        .requestMatchers(HttpMethod.POST, "/api/bookings/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/bookings/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").authenticated()
                        // Tất cả request khác cần authenticated
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer((oauth2) -> oauth2
                        .jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(jwtDecoderConfiguration)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint((request, response, authException) -> {
                            // Chỉ trả về 401 cho các request cần authentication
                            if (request.getRequestURI().startsWith("/api/") && 
                                !request.getRequestURI().startsWith("/api/rooms") &&
                                !request.getRequestURI().startsWith("/api/auth/login") &&
                                !request.getRequestURI().startsWith("/api/auth/register") &&
                                !request.getRequestURI().startsWith("/api/auth/create-admin") &&
                                !request.getRequestURI().startsWith("/api/auth/mfa/verify") &&
                                !request.getRequestURI().startsWith("/api/users") &&
                                !request.getRequestURI().startsWith("/api/files")) {
                                response.setStatus(401);
                                response.getWriter().write("{\"error\":\"Unauthorized\"}");
                            }
                        })
                );

        return http.build();
    }



    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userDetailService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("authorities"); //scope user

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

}
