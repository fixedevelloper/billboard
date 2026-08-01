package com.cscreativ.billboard.proofofperformance.web;

import com.cscreativ.billboard.proofofperformance.domain.ProofOfPerformance;
import com.cscreativ.billboard.proofofperformance.service.POPService;
import com.cscreativ.billboard.user.UserFacade;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/** Basic mobile P.O.P module: field agents upload a geolocated, timestamped photo per deployed billboard. */
@RestController
@RequestMapping("/api/pop")
class POPController {

    private final POPService popService;
    private final UserFacade userFacade;

    POPController(POPService popService, UserFacade userFacade) {
        this.popService = popService;
        this.userFacade = userFacade;
    }

    @PostMapping
    @PreAuthorize("hasRole('REGISSEUR')")
    POPResponse capture(@RequestBody CaptureRequest request, Authentication authentication) {
        UUID capturedBy = userFacade.getByEmail(authentication.getName()).id();
        var proof = popService.capture(
                request.orderId(), request.billboardId(), capturedBy, request.photoUrl(),
                request.latitude(), request.longitude());
        return POPResponse.from(proof);
    }

    @GetMapping("/order/{orderId}")
    List<POPFacadeResponse> byOrder(@PathVariable UUID orderId) {
        return popService.findByOrderId(orderId).stream().map(POPFacadeResponse::from).toList();
    }

    @GetMapping("/billboard/{billboardId}")
    List<POPFacadeResponse> byBillboard(@PathVariable UUID billboardId) {
        return popService.findByBillboardId(billboardId).stream().map(POPFacadeResponse::from).toList();
    }

    record CaptureRequest(
            @NotNull UUID orderId, @NotNull UUID billboardId, @NotBlank String photoUrl,
            double latitude, double longitude) {
    }

    record POPResponse(UUID id, UUID orderId, UUID billboardId, String photoUrl, double latitude, double longitude) {
        static POPResponse from(ProofOfPerformance p) {
            return new POPResponse(p.getId(), p.getOrderId(), p.getBillboardId(), p.getPhotoUrl(), p.getLatitude(), p.getLongitude());
        }
    }

    record POPFacadeResponse(UUID id, UUID orderId, UUID billboardId, UUID capturedBy, String photoUrl,
                              double latitude, double longitude, java.time.Instant capturedAt) {
        static POPFacadeResponse from(com.cscreativ.billboard.proofofperformance.POPFacade.ProofSummary s) {
            return new POPFacadeResponse(
                    s.id(), s.orderId(), s.billboardId(), s.capturedBy(), s.photoUrl(),
                    s.location().latitude(), s.location().longitude(), s.capturedAt());
        }
    }
}
