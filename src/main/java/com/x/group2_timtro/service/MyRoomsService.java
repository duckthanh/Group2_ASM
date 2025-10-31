package com.x.group2_timtro.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.x.group2_timtro.dto.request.*;
import com.x.group2_timtro.dto.response.MyRoomDetailResponse;
import com.x.group2_timtro.dto.response.MyRoomResponse;
<<<<<<< HEAD
=======
import com.x.group2_timtro.dto.response.MyPostedRoomResponse;
>>>>>>> origin/phong28
import com.x.group2_timtro.entity.*;
import com.x.group2_timtro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyRoomsService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final IssueRepository issueRepository;
    private final DocumentRepository documentRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * Get all rooms for current user
     */
    public List<MyRoomResponse> getMyRooms(Long userId, String status, String keyword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            bookings = bookingRepository.searchByTenantAndKeyword(user, keyword);
        } else if (status != null && !status.trim().isEmpty()) {
            bookings = bookingRepository.findByTenantAndStatusOrderByCreatedAtDesc(user, status);
        } else {
            bookings = bookingRepository.findByTenantOrderByCreatedAtDesc(user);
        }

        return bookings.stream()
                .map(this::mapToMyRoomResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get detailed information for a specific booking
     */
    public MyRoomDetailResponse getMyRoomDetail(Long userId, String bookingId) {
        // Verify user exists
<<<<<<< HEAD
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
=======
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = null;
        
        // Try to find by bookingId first
        if (bookingId != null && !bookingId.isEmpty()) {
            // Handle temporary ID format (TEMP-123)
            if (bookingId.startsWith("TEMP-")) {
                try {
                    Long id = Long.parseLong(bookingId.substring(5));
                    booking = bookingRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Booking not found"));
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Invalid booking ID format");
                }
            } else {
                // Normal bookingId (BK-2025-XXXXX)
                booking = bookingRepository.findByBookingId(bookingId)
                        .orElseThrow(() -> new RuntimeException("Booking not found"));
            }
        }
        
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }

        // Check if user is admin - admin can view all bookings
        boolean isAdmin = "ADMIN".equals(user.getRole());
        
        // Allow access if user is either the tenant OR the landlord (room owner) OR admin
        boolean isTenant = userId.equals(booking.getTenant().getId());
        boolean isLandlord = userId.equals(booking.getRoom().getOwner().getId());
        
        if (!isTenant && !isLandlord && !isAdmin) {
>>>>>>> origin/phong28
            throw new RuntimeException("Unauthorized access to booking");
        }

        return mapToMyRoomDetailResponse(booking);
    }

    /**
     * Create a new booking (HOLD or DEPOSIT)
     */
    @Transactional
    public MyRoomResponse createBooking(Long userId, CreateBookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getIsAvailable()) {
            throw new RuntimeException("Room is not available");
        }

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setTenant(user);
        booking.setDuration(request.getDuration());
        booking.setDurationUnit(request.getDurationUnit());
        booking.setMoveInDate(request.getMoveInDate());
        booking.setNumberOfPeople(request.getNumberOfPeople());
        booking.setPhoneNumber(request.getPhoneNumber());
        booking.setNote(request.getNote());

        if ("HOLD".equals(request.getAction())) {
            booking.setStatus("HOLD");
            booking.setIsDeposit(false);
            // Hold expires in 48 hours
            booking.setHoldExpiresAt(LocalDateTime.now().plusHours(48));
        } else if ("DEPOSIT".equals(request.getAction())) {
            booking.setStatus("DEPOSITED");
            booking.setIsDeposit(true);
            booking.setDepositAmount(request.getDepositAmount());
            booking.setDepositPaid(false);
        }

        booking.setContractStatus("PENDING");
        booking = bookingRepository.save(booking);

        return mapToMyRoomResponse(booking);
    }

    /**
     * Make a payment for deposit or monthly rent
     */
    @Transactional
    public void makePayment(Long userId, String bookingId, PaymentRequest request) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
            throw new RuntimeException("Unauthorized access to booking");
        }

        // If it's a deposit payment
        if ("DEPOSITED".equals(booking.getStatus()) && !booking.getDepositPaid()) {
            booking.setDepositPaid(true);
            booking.setDepositReceiptUrl("receipt-" + System.currentTimeMillis() + ".pdf");
            bookingRepository.save(booking);
        } else {
            // Create a payment record for monthly rent
            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setAmount(request.getAmount());
            payment.setStatus("PAID");
            payment.setPaymentMethod(request.getMethod());
            payment.setPaidAt(LocalDateTime.now());
            payment.setReceiptUrl("receipt-" + System.currentTimeMillis() + ".pdf");
            payment.setNote(request.getNote());
            paymentRepository.save(payment);
        }
    }

    /**
     * Get payments for a booking
     */
    public List<MyRoomDetailResponse.PaymentInfo> getPayments(Long userId, String bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
            throw new RuntimeException("Unauthorized access to booking");
        }

        List<Payment> payments = paymentRepository.findByBookingOrderByCreatedAtDesc(booking);
        
        return payments.stream()
                .map(p -> MyRoomDetailResponse.PaymentInfo.builder()
                        .id(p.getId())
                        .month(p.getMonth())
                        .amount(p.getAmount())
                        .status(p.getStatus())
                        .receiptUrl(p.getReceiptUrl())
                        .paidAt(p.getPaidAt())
                        .dueDate(p.getDueDate())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Sign contract
     */
    @Transactional
    public void signContract(Long userId, String bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
            throw new RuntimeException("Unauthorized access to booking");
        }

        if (!"DEPOSITED".equals(booking.getStatus()) || !booking.getDepositPaid()) {
            throw new RuntimeException("Cannot sign contract. Please pay deposit first.");
        }

        booking.setContractStatus("SIGNED");
        booking.setContractPdfUrl("contract-" + bookingId + ".pdf");
        booking.setStatus("ACTIVE");
        booking.setLeaseStart(booking.getMoveInDate());
        
        // Calculate lease end date
        LocalDate leaseEnd = booking.getMoveInDate();
        if ("MONTH".equals(booking.getDurationUnit())) {
            leaseEnd = leaseEnd.plusMonths(booking.getDuration());
        } else if ("YEAR".equals(booking.getDurationUnit())) {
            leaseEnd = leaseEnd.plusYears(booking.getDuration());
        }
        booking.setLeaseEnd(leaseEnd);
        
        bookingRepository.save(booking);
    }

    /**
     * Cancel booking
     */
    @Transactional
    public void cancelBooking(Long userId, String bookingId, CancelBookingRequest request) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
            throw new RuntimeException("Unauthorized access to booking");
        }

        booking.setStatus("CANCELED");
        booking.setCanceledBy("USER");
        booking.setCancelReason(request.getReason());
        bookingRepository.save(booking);
    }

    /**
     * Renew lease
     */
    @Transactional
    public void renewLease(Long userId, String bookingId, RenewLeaseRequest request) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
            throw new RuntimeException("Unauthorized access to booking");
        }

        if (!"ACTIVE".equals(booking.getStatus())) {
            throw new RuntimeException("Can only renew active lease");
        }

        // Extend lease end date
        LocalDate newLeaseEnd = booking.getLeaseEnd().plusMonths(request.getMonths());
        booking.setLeaseEnd(newLeaseEnd);
        bookingRepository.save(booking);
    }

    /**
     * End lease / Hand over room
     */
    @Transactional
    public void endLease(Long userId, String bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
            throw new RuntimeException("Unauthorized access to booking");
        }

        booking.setStatus("ENDED");
        bookingRepository.save(booking);
    }

    /**
     * Create an issue
     */
    @Transactional
    public void createIssue(Long userId, String bookingId, IssueRequest request) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
            throw new RuntimeException("Unauthorized access to booking");
        }

        Issue issue = new Issue();
        issue.setBooking(booking);
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        
        try {
            issue.setPhotos(objectMapper.writeValueAsString(request.getPhotos()));
        } catch (Exception e) {
            issue.setPhotos("[]");
        }
        
        issue.setStatus("PENDING");
        issueRepository.save(issue);
    }

    /**
     * Upload document
     */
    @Transactional
    public void uploadDocument(Long userId, String bookingId, String documentType, String documentUrl, String fileName) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
            throw new RuntimeException("Unauthorized access to booking");
        }

        Document document = new Document();
        document.setBooking(booking);
        document.setDocumentType(documentType);
        document.setDocumentUrl(documentUrl);
        document.setFileName(fileName);
        document.setStatus("PENDING");
<<<<<<< HEAD
=======
        document.setUploadedBy("TENANT");
        documentRepository.save(document);
    }

    /**
     * Upload QR payment image (Landlord only)
     */
    @Transactional
    public void uploadPaymentQr(Long userId, String bookingId, UploadQrPaymentRequest request) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Room room = booking.getRoom();
        
        // Check if user is the landlord (room owner)
        if (!userId.equals(room.getOwner().getId())) {
            throw new RuntimeException("Only landlord can upload QR payment image");
        }

        // Update booking's payment QR image and description (specific to this booking)
        booking.setPaymentQrImageUrl(request.getImageUrl());
        booking.setPaymentDescription(request.getPaymentDescription());
        bookingRepository.save(booking);
    }

    /**
     * Upload payment proof (Tenant only)
     */
    @Transactional
    public void uploadPaymentProof(Long userId, String bookingId, UploadPaymentProofRequest request) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if user is the tenant
        if (!userId.equals(booking.getTenant().getId())) {
            throw new RuntimeException("Only tenant can upload payment proof");
        }

        // Create a document for payment proof
        Document document = new Document();
        document.setBooking(booking);
        document.setDocumentType("PAYMENT_PROOF");
        document.setDocumentUrl(request.getDocumentUrl());
        document.setFileName(request.getFileName());
        document.setNote(request.getNote());
        document.setStatus("PENDING");
        document.setUploadedBy("TENANT");
        documentRepository.save(document);
    }

    /**
     * Confirm payment (Landlord only)
     */
    @Transactional
    public void confirmPayment(Long userId, String bookingId, ConfirmPaymentRequest request) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Room room = booking.getRoom();
        
        // Check if user is the landlord
        if (!userId.equals(room.getOwner().getId())) {
            throw new RuntimeException("Only landlord can confirm payment");
        }

        // Find and approve the payment proof document
        Document document = documentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!document.getBooking().getId().equals(booking.getId())) {
            throw new RuntimeException("Document does not belong to this booking");
        }

        document.setStatus("APPROVED");
        if (request.getNote() != null) {
            document.setNote(request.getNote());
        }
>>>>>>> origin/phong28
        documentRepository.save(document);
    }

    // Helper methods to map entities to DTOs

    private MyRoomResponse mapToMyRoomResponse(Booking booking) {
        Room room = booking.getRoom();
        User landlord = room.getOwner();

        MyRoomResponse.DepositInfo depositInfo = null;
        if (booking.getDepositAmount() != null) {
            depositInfo = MyRoomResponse.DepositInfo.builder()
                    .amount(booking.getDepositAmount())
                    .paid(booking.getDepositPaid())
                    .receiptUrl(booking.getDepositReceiptUrl())
                    .build();
        }

        MyRoomResponse.ContractInfo contractInfo = null;
        if (booking.getContractStatus() != null) {
            contractInfo = MyRoomResponse.ContractInfo.builder()
                    .status(booking.getContractStatus())
                    .pdfUrl(booking.getContractPdfUrl())
                    .build();
        }

        MyRoomResponse.LeaseInfo leaseInfo = null;
        if (booking.getLeaseStart() != null && booking.getLeaseEnd() != null) {
            long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), booking.getLeaseEnd());
            leaseInfo = MyRoomResponse.LeaseInfo.builder()
                    .start(booking.getLeaseStart())
                    .end(booking.getLeaseEnd())
                    .daysRemaining((int) daysRemaining)
                    .build();
        }

        MyRoomResponse.LandlordInfo landlordInfo = MyRoomResponse.LandlordInfo.builder()
                .name(landlord.getName())
                .phone(landlord.getPhoneNumber())
                .email(landlord.getEmail())
                .build();

        return MyRoomResponse.builder()
                .id(booking.getId())
                .bookingId(booking.getBookingId())
                .roomId(room.getId())
                .roomTitle(room.getName())
                .addressShort(room.getLocation())
                .pricePerMonth(room.getPrice())
                .area(room.getArea())
                .capacity(room.getCapacity())
                .imageUrl(room.getImageUrl())
                .status(booking.getStatus())
                .holdExpiresAt(booking.getHoldExpiresAt())
                .deposit(depositInfo)
                .contract(contractInfo)
                .lease(leaseInfo)
                .landlord(landlordInfo)
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .cancelReason(booking.getCancelReason())
                .canceledBy(booking.getCanceledBy())
                .build();
    }

    private MyRoomDetailResponse mapToMyRoomDetailResponse(Booking booking) {
        Room room = booking.getRoom();
        User landlord = room.getOwner();

        // Room info
        MyRoomDetailResponse.RoomInfo roomInfo = MyRoomDetailResponse.RoomInfo.builder()
                .id(room.getId())
                .name(room.getName())
                .location(room.getLocation())
                .price(room.getPrice())
                .area(room.getArea())
                .capacity(room.getCapacity())
                .imageUrl(room.getImageUrl())
                .detail(room.getDetail())
<<<<<<< HEAD
=======
                .paymentQrImageUrl(booking.getPaymentQrImageUrl()) // From booking, not room
                .paymentDescription(booking.getPaymentDescription()) // From booking, not room
>>>>>>> origin/phong28
                .build();

        // Deposit info
        MyRoomDetailResponse.DepositInfo depositInfo = null;
        if (booking.getDepositAmount() != null) {
            depositInfo = MyRoomDetailResponse.DepositInfo.builder()
                    .amount(booking.getDepositAmount())
                    .paid(booking.getDepositPaid())
                    .receiptUrl(booking.getDepositReceiptUrl())
                    .build();
        }

        // Contract info
        MyRoomDetailResponse.ContractInfo contractInfo = null;
        if (booking.getContractStatus() != null) {
            contractInfo = MyRoomDetailResponse.ContractInfo.builder()
                    .status(booking.getContractStatus())
                    .pdfUrl(booking.getContractPdfUrl())
                    .build();
        }

        // Lease info
        MyRoomDetailResponse.LeaseInfo leaseInfo = null;
        if (booking.getLeaseStart() != null && booking.getLeaseEnd() != null) {
            long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), booking.getLeaseEnd());
            leaseInfo = MyRoomDetailResponse.LeaseInfo.builder()
                    .start(booking.getLeaseStart())
                    .end(booking.getLeaseEnd())
                    .daysRemaining((int) daysRemaining)
                    .build();
        }

        // Landlord info
        MyRoomDetailResponse.LandlordInfo landlordInfo = MyRoomDetailResponse.LandlordInfo.builder()
                .id(landlord.getId())
                .name(landlord.getName())
                .phone(landlord.getPhoneNumber())
                .email(landlord.getEmail())
                .build();

        // Payments
        List<Payment> payments = paymentRepository.findByBookingOrderByCreatedAtDesc(booking);
        List<MyRoomDetailResponse.PaymentInfo> paymentInfos = payments.stream()
                .map(p -> MyRoomDetailResponse.PaymentInfo.builder()
                        .id(p.getId())
                        .month(p.getMonth())
                        .amount(p.getAmount())
                        .status(p.getStatus())
                        .receiptUrl(p.getReceiptUrl())
                        .paidAt(p.getPaidAt())
                        .dueDate(p.getDueDate())
                        .build())
                .collect(Collectors.toList());

        // Documents
        List<Document> documents = documentRepository.findByBookingOrderByCreatedAtDesc(booking);
        List<MyRoomDetailResponse.DocumentInfo> documentInfos = documents.stream()
                .map(d -> MyRoomDetailResponse.DocumentInfo.builder()
                        .id(d.getId())
                        .documentType(d.getDocumentType())
                        .documentUrl(d.getDocumentUrl())
                        .fileName(d.getFileName())
                        .status(d.getStatus())
<<<<<<< HEAD
=======
                        .uploadedBy(d.getUploadedBy())
>>>>>>> origin/phong28
                        .createdAt(d.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Issues
        List<Issue> issues = issueRepository.findByBookingOrderByCreatedAtDesc(booking);
        List<MyRoomDetailResponse.IssueInfo> issueInfos = issues.stream()
                .map(i -> MyRoomDetailResponse.IssueInfo.builder()
                        .id(i.getId())
                        .title(i.getTitle())
                        .description(i.getDescription())
                        .status(i.getStatus())
                        .createdAt(i.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Timeline
        List<MyRoomDetailResponse.TimelineEvent> timeline = buildTimeline(booking);

        return MyRoomDetailResponse.builder()
                .id(booking.getId())
                .bookingId(booking.getBookingId())
                .room(roomInfo)
                .status(booking.getStatus())
                .holdExpiresAt(booking.getHoldExpiresAt())
                .duration(booking.getDuration())
                .durationUnit(booking.getDurationUnit())
                .moveInDate(booking.getMoveInDate())
                .numberOfPeople(booking.getNumberOfPeople())
                .phoneNumber(booking.getPhoneNumber())
                .note(booking.getNote())
                .deposit(depositInfo)
                .contract(contractInfo)
                .lease(leaseInfo)
                .landlord(landlordInfo)
                .payments(paymentInfos)
                .documents(documentInfos)
                .issues(issueInfos)
                .timeline(timeline)
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .cancelReason(booking.getCancelReason())
                .canceledBy(booking.getCanceledBy())
                .build();
    }

    private List<MyRoomDetailResponse.TimelineEvent> buildTimeline(Booking booking) {
        List<MyRoomDetailResponse.TimelineEvent> timeline = new ArrayList<>();
        
        // Created booking
        timeline.add(MyRoomDetailResponse.TimelineEvent.builder()
                .event("Tạo đặt chỗ")
                .description("Đã tạo yêu cầu " + ("HOLD".equals(booking.getStatus()) ? "giữ chỗ" : "đặt cọc"))
                .timestamp(booking.getCreatedAt())
                .status("COMPLETED")
                .build());

        // Deposit paid
        if (booking.getDepositPaid() != null && booking.getDepositPaid()) {
            timeline.add(MyRoomDetailResponse.TimelineEvent.builder()
                    .event("Đã đặt cọc")
                    .description("Đã thanh toán tiền cọc")
                    .timestamp(booking.getUpdatedAt())
                    .status("COMPLETED")
                    .build());
        }

        // Contract signed
        if ("SIGNED".equals(booking.getContractStatus())) {
            timeline.add(MyRoomDetailResponse.TimelineEvent.builder()
                    .event("Ký hợp đồng")
                    .description("Đã ký hợp đồng điện tử")
                    .timestamp(booking.getUpdatedAt())
                    .status("COMPLETED")
                    .build());
        }

        // Move in
        if ("ACTIVE".equals(booking.getStatus()) && booking.getLeaseStart() != null) {
            timeline.add(MyRoomDetailResponse.TimelineEvent.builder()
                    .event("Nhận phòng")
                    .description("Đã nhận phòng và bắt đầu thuê")
                    .timestamp(booking.getLeaseStart().atStartOfDay())
                    .status("COMPLETED")
                    .build());
        }

        // Lease end
        if (booking.getLeaseEnd() != null) {
            String status = LocalDate.now().isAfter(booking.getLeaseEnd()) ? "COMPLETED" : 
                           LocalDate.now().isEqual(booking.getLeaseEnd()) ? "CURRENT" : "PENDING";
            timeline.add(MyRoomDetailResponse.TimelineEvent.builder()
                    .event("Kết thúc hợp đồng")
                    .description("Ngày hết hạn hợp đồng")
                    .timestamp(booking.getLeaseEnd().atStartOfDay())
                    .status(status)
                    .build());
        }

        return timeline;
    }
<<<<<<< HEAD
=======

    /**
     * Get all posted rooms (rooms owned by current user)
     */
    public List<MyPostedRoomResponse> getMyPostedRooms(Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Room> rooms = roomRepository.findByOwner(owner);

        return rooms.stream()
                .map(room -> {
                    // Get all bookings for this room
                    List<Booking> bookings = bookingRepository.findByRoom(room);
                    
                    // Calculate statistics
                    int totalBookings = bookings.size();
                    int activeBookings = (int) bookings.stream()
                            .filter(b -> "ACTIVE".equals(b.getStatus()) || "CONFIRMED".equals(b.getStatus()))
                            .count();
                    int pendingBookings = (int) bookings.stream()
                            .filter(b -> "PENDING".equals(b.getStatus()))
                            .count();

                    return MyPostedRoomResponse.builder()
                            .id(room.getId())
                            .name(room.getName())
                            .imageUrl(room.getImageUrl())
                            .location(room.getLocation())
                            .price(room.getPrice())
                            .area(room.getArea())
                            .capacity(room.getCapacity())
                            .isAvailable(room.getIsAvailable())
                            .roomType(room.getRoomType())
                            .totalBookings(totalBookings)
                            .activeBookings(activeBookings)
                            .pendingBookings(pendingBookings)
                            .createdAt(room.getCreatedAt())
                            .updatedAt(room.getUpdatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
>>>>>>> origin/phong28
}

