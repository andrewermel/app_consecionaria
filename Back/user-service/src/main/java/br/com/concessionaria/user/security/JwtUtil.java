package br.com.concessionaria.user.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET = "segredo_super_secreto_seguro_32_bytes_min";
    private final long EXPIRATION = 86400000;
    private final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public String generateToken(String username, String role, String name, String document) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("perfil", role)
                .claim("nome", name)
                .claim("cpf", document)
                .claim("login", username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.getSubject();
    }

    public String getRoleFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        Claims claims = getClaims(token);
        return claims.getExpiration().after(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(KEY).build().parseClaimsJws(token).getBody();
    }
}
