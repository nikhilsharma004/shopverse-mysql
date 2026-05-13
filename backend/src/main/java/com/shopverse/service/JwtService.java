package com.shopverse.service;

import com.shopverse.model.AppUser;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private static final String SECRET = "shopverse-local-dev-secret-change-before-production";

    public String createToken(AppUser user) {
        String header = encode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        long expiresAt = Instant.now().plusSeconds(86400).getEpochSecond();
        String role = user.getRole() == null ? "CUSTOMER" : user.getRole();
        String payload = encode("{\"sub\":\"" + user.getEmail() + "\",\"name\":\"" + user.getFullName()
                + "\",\"role\":\"" + role + "\",\"exp\":" + expiresAt + "}");
        return header + "." + payload + "." + sign(header + "." + payload);
    }

    private String encode(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Could not create token", exception);
        }
    }
}
