package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.request.*;
import com.x.group2_timtro.dto.response.MyRoomDetailResponse;
import com.x.group2_timtro.dto.response.MyRoomResponse;
import com.x.group2_timtro.dto.response.MyPostedRoomResponse;
import com.x.group2_timtro.service.MyRoomsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/me/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MyRoomsController {

    private final MyRoomsService myRoomsService;

    /**
     * Get all rooms for current user
     * GET /api/me/rooms?status=HOLD&q=keyword
     */
    @GetMapping
    public ResponseEntity<?> getMyRooms(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q
    ) {
        try {
            List<MyRoomResponse> rooms = myRoomsService.getMyRooms(userId, status, q);
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Get detailed information for a specific booking
     * GET /api/me/rooms/{bookingId}
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getMyRoomDetail(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId
    ) {
        try {
            MyRoomDetailResponse detail = myRoomsService.getMyRoomDetail(userId, bookingId);
            return ResponseEntity.ok(detail);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Create a new booking (HOLD or DEPOSIT)
     * POST /api/me/rooms
     */
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody CreateBookingRequest request
    ) {
        try {
            MyRoomResponse booking = myRoomsService.createBooking(userId, request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Make a payment for deposit or monthly rent
     * POST /api/me/rooms/{bookingId}/payments
     */
    @PostMapping("/{bookingId}/payments")
    public ResponseEntity<?> makePayment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId,
            @RequestBody PaymentRequest request
    ) {
        try {
            myRoomsService.makePayment(userId, bookingId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Payment successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Get payments for a booking
     * GET /api/me/rooms/{bookingId}/payments
     */
    @GetMapping("/{bookingId}/payments")
    public ResponseEntity<?> getPayments(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId
    ) {
        try {
            List<MyRoomDetailResponse.PaymentInfo> payments = myRoomsService.getPayments(userId, bookingId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Sign contract
     * POST /api/me/rooms/{bookingId}/contract/sign
     */
    @PostMapping("/{bookingId}/contract/sign")
    public ResponseEntity<?> signContract(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId
    ) {
        try {
            myRoomsService.signContract(userId, bookingId);
            return ResponseEntity.ok(Map.of(
                    "message", "Contract signed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Cancel booking
     * POST /api/me/rooms/{bookingId}/cancel
     */
    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId,
            @RequestBody CancelBookingRequest request
    ) {
        try {
            myRoomsService.cancelBooking(userId, bookingId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Booking canceled successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Renew lease
     * POST /api/me/rooms/{bookingId}/renew
     */
    @PostMapping("/{bookingId}/renew")
    public ResponseEntity<?> renewLease(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId,
            @RequestBody RenewLeaseRequest request
    ) {
        try {
            myRoomsService.renewLease(userId, bookingId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Lease renewed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * End lease / Hand over room
     * POST /api/me/rooms/{bookingId}/handover
     */
    @PostMapping("/{bookingId}/handover")
    public ResponseEntity<?> endLease(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId
    ) {
        try {
            myRoomsService.endLease(userId, bookingId);
            return ResponseEntity.ok(Map.of(
                    "message", "Lease ended successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Create an issue
     * POST /api/me/rooms/{bookingId}/issues
     */
    @PostMapping("/{bookingId}/issues")
    public ResponseEntity<?> createIssue(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId,
            @RequestBody IssueRequest request
    ) {
        try {
            myRoomsService.createIssue(userId, bookingId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Issue reported successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Upload document
     * POST /api/me/rooms/{bookingId}/documents
     */
    @PostMapping("/{bookingId}/documents")
    public ResponseEntity<?> uploadDocument(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId,
            @RequestBody Map<String, String> request
    ) {
        try {
            String documentType = request.get("documentType");
            String documentUrl = request.get("documentUrl");
            String fileName = request.get("fileName");
            
            myRoomsService.uploadDocument(userId, bookingId, documentType, documentUrl, fileName);
            return ResponseEntity.ok(Map.of(
                    "message", "Document uploaded successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Upload QR payment image (Landlord only)
     * POST /api/me/rooms/{bookingId}/payment-qr
     */
    @PostMapping("/{bookingId}/payment-qr")
    public ResponseEntity<?> uploadPaymentQr(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId,
            @RequestBody UploadQrPaymentRequest request
    ) {
        try {
            myRoomsService.uploadPaymentQr(userId, bookingId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "QR payment image uploaded successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Upload payment proof (Tenant only)
     * POST /api/me/rooms/{bookingId}/payment-proof
     */
    @PostMapping("/{bookingId}/payment-proof")
    public ResponseEntity<?> uploadPaymentProof(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId,
            @RequestBody UploadPaymentProofRequest request
    ) {
        try {
            myRoomsService.uploadPaymentProof(userId, bookingId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Payment proof uploaded successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Confirm payment (Landlord only)
     * POST /api/me/rooms/{bookingId}/confirm-payment
     */
    @PostMapping("/{bookingId}/confirm-payment")
    public ResponseEntity<?> confirmPayment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String bookingId,
            @RequestBody ConfirmPaymentRequest request
    ) {
        try {
            myRoomsService.confirmPayment(userId, bookingId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Payment confirmed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Get posted rooms (rooms owned by current user)
     * GET /api/me/posted-rooms
     */
    @GetMapping("/posted")
    public ResponseEntity<?> getMyPostedRooms(
            @RequestHeader("X-User-Id") Long userId
    ) {
        try {
            List<MyPostedRoomResponse> rooms = myRoomsService.getMyPostedRooms(userId);
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}

