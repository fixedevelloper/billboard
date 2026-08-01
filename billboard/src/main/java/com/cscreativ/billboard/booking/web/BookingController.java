package com.cscreativ.billboard.booking.web;

import com.cscreativ.billboard.booking.domain.Order;
import com.cscreativ.billboard.booking.domain.OrderRepository;
import com.cscreativ.billboard.booking.service.BookingService;
import com.cscreativ.billboard.user.UserFacade;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

/** Cart / checkout / delegation workflow. Placing, checking out and cancelling an order
 * is open to any authenticated user regardless of role; delegation stays annonceur-only
 * since it is specifically about handing off payment to a media buyer. */
@RestController
@RequestMapping("/api/bookings")
class BookingController {

    private final BookingService bookingService;
    private final OrderRepository orderRepository;
    private final UserFacade userFacade;

    BookingController(BookingService bookingService, OrderRepository orderRepository, UserFacade userFacade) {
        this.bookingService = bookingService;
        this.orderRepository = orderRepository;
        this.userFacade = userFacade;
    }

    @PostMapping
    ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest request, Authentication authentication) {
        UUID annonceurId = currentUserId(authentication);
        List<BookingService.CartLine> lines = request.items().stream()
                .map(i -> new BookingService.CartLine(i.billboardId(), i.startDate(), i.endDate()))
                .toList();

        Order order = bookingService.createOrder(annonceurId, request.currency(), lines);
        return ResponseEntity.ok(OrderResponse.from(order));
    }

    @PostMapping("/{id}/checkout")
    OrderResponse checkout(@PathVariable UUID id, Authentication authentication) {
        return OrderResponse.from(bookingService.checkout(id, currentUserId(authentication)));
    }

    @PostMapping("/{id}/delegate")
    @PreAuthorize("hasRole('ANNONCEUR')")
    OrderResponse delegate(
            @PathVariable UUID id, @RequestBody DelegateRequest request, Authentication authentication) {
        return OrderResponse.from(bookingService.delegate(id, currentUserId(authentication), request.mediaBuyerId()));
    }

    @PostMapping("/{id}/cancel")
    ResponseEntity<Void> cancel(@PathVariable UUID id, Authentication authentication) {
        bookingService.cancel(id, currentUserId(authentication));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    OrderResponse getOne(@PathVariable UUID id) {
        return orderRepository.findById(id)
                .map(OrderResponse::from)
                .orElseThrow(() -> new NoSuchElementException("Order not found: " + id));
    }

    @GetMapping("/mine")
    List<OrderResponse> mine(Authentication authentication) {
        return bookingService.findByAnnonceur(currentUserId(authentication)).stream().map(OrderResponse::from).toList();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    List<OrderResponse> all() {
        return orderRepository.findAll().stream().map(OrderResponse::from).toList();
    }

    @GetMapping("/delegated-to-me")
    @PreAuthorize("hasRole('MEDIA_BUYER')")
    List<OrderResponse> delegatedToMe(Authentication authentication) {
        return bookingService.findDelegatedTo(currentUserId(authentication)).stream().map(OrderResponse::from).toList();
    }

    private UUID currentUserId(Authentication authentication) {
        return userFacade.getByEmail(authentication.getName()).id();
    }

    record DelegateRequest(UUID mediaBuyerId) {
    }
}
