package com.example.Tracker;

import com.example.Tracker.model.Users;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expirationMs}")
    private long expirationMs;

    // Generate JWT token
    public String generateToken(Users user) {
        return Jwts.builder()
                .setSubject(user.getEmail()) // Set email as subject
                .claim("userId", user.getId()) // Add userId claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    // Validate JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secret).build().parseClaimsJws(token);
            return true; // Valid token
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Invalid token
        }
    }

    // Extract email (subject) from token
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract userId from token
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    // Utility: Extract any claim from the token
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extract all claims from token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
