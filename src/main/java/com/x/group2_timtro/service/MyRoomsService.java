package com.x.group2_timtro.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.x.group2_timtro.dto.request.*;
import com.x.group2_timtro.dto.response.MyRoomDetailResponse;
import com.x.group2_timtro.dto.response.MyRoomResponse;
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
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTenant().getId() != userId) {
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
}

