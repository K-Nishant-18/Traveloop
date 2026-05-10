package com.traveloop.backend.controllers;

import com.traveloop.backend.models.User;
import com.traveloop.backend.payload.request.LoginRequest;
import com.traveloop.backend.payload.request.SignupRequest;
import com.traveloop.backend.payload.request.ForgotPasswordRequest;
import com.traveloop.backend.payload.request.VerifyOtpRequest;
import com.traveloop.backend.payload.request.ResetPasswordRequest;
import com.traveloop.backend.payload.response.JwtResponse;
import com.traveloop.backend.payload.response.MessageResponse;
import com.traveloop.backend.repositories.UserRepository;
import com.traveloop.backend.security.jwt.JwtUtils;
import com.traveloop.backend.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    private static class OtpDetails {
        String otp;
        java.time.LocalDateTime expiryTime;

        OtpDetails(String otp, java.time.LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    private static final java.util.concurrent.ConcurrentHashMap<String, OtpDetails> otpStorage = new java.util.concurrent.ConcurrentHashMap<>();

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setLocation(signUpRequest.getLocation());

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        java.util.Optional<User> userOpt = userRepository.findByEmail(forgotPasswordRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is not registered on Traveloop!"));
        }

        // Generate 6-digit random OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        otpStorage.put(forgotPasswordRequest.getEmail(), new OtpDetails(otp, java.time.LocalDateTime.now().plusMinutes(5)));

        // Output OTP to logs for local simulator
        System.out.println("\n========================================================");
        System.out.println("  [TRAVELOOP MAIL SENDER] Sending OTP Reset Verification");
        System.out.println("  To: " + forgotPasswordRequest.getEmail());
        System.out.println("  Your One-Time Password (OTP) is: " + otp);
        System.out.println("========================================================\n");

        return ResponseEntity.ok(new MessageResponse("OTP sent successfully! Please check your email (and server logs) to verify. Code is: " + otp));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest) {
        OtpDetails details = otpStorage.get(verifyOtpRequest.getEmail());
        if (details == null || !details.otp.equals(verifyOtpRequest.getOtp())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid OTP. Please check again."));
        }

        if (details.expiryTime.isBefore(java.time.LocalDateTime.now())) {
            otpStorage.remove(verifyOtpRequest.getEmail());
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: OTP has expired. Please request a new one."));
        }

        return ResponseEntity.ok(new MessageResponse("OTP verified successfully! Please enter your new password."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        OtpDetails details = otpStorage.get(resetPasswordRequest.getEmail());
        if (details == null || !details.otp.equals(resetPasswordRequest.getOtp())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Verification expired or invalid OTP."));
        }

        if (details.expiryTime.isBefore(java.time.LocalDateTime.now())) {
            otpStorage.remove(resetPasswordRequest.getEmail());
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Session expired. Please request a new OTP."));
        }

        java.util.Optional<User> userOpt = userRepository.findByEmail(resetPasswordRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found."));
        }

        User user = userOpt.get();
        user.setPassword(encoder.encode(resetPasswordRequest.getNewPassword()));
        userRepository.save(user);

        // Remove OTP from storage after successful use
        otpStorage.remove(resetPasswordRequest.getEmail());

        return ResponseEntity.ok(new MessageResponse("Success: Your password has been changed successfully! You can now sign in."));
    }
}
