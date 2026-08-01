package com.cscreativ.billboard.notification.service;

import java.math.BigDecimal;
import java.util.UUID;

/** Small, dependency-free HTML builders for transactional emails. */
final class EmailTemplates {

    private EmailTemplates() {
    }

    static String welcome(String companyName) {
        return wrap(
                "Bienvenue sur AdSpace Market",
                """
                <p>Bonjour %s,</p>
                <p>Votre compte AdSpace Market a bien été créé. Vous pouvez dès à présent explorer les panneaux
                disponibles et composer votre première campagne.</p>
                """.formatted(escape(companyName)));
    }

    static String orderCreated(String payerCompanyName, UUID orderId, BigDecimal totalAmount, String currency) {
        return wrap(
                "Votre commande a été créée",
                """
                <p>Bonjour %s,</p>
                <p>Votre commande <strong>%s</strong> a été créée pour un montant de <strong>%s %s</strong>.</p>
                <p>Vous pouvez la valider et procéder au paiement depuis votre espace AdSpace Market.</p>
                """.formatted(escape(payerCompanyName), orderId, totalAmount, escape(currency)));
    }

    static String orderDelegated(String mediaBuyerCompanyName, String annonceurCompanyName, UUID orderId) {
        return wrap(
                "Une commande vous a été déléguée",
                """
                <p>Bonjour %s,</p>
                <p><strong>%s</strong> vous a délégué le paiement de sa commande <strong>%s</strong>.</p>
                <p>Connectez-vous à votre espace AdSpace Market pour procéder au règlement.</p>
                """.formatted(escape(mediaBuyerCompanyName), escape(annonceurCompanyName), orderId));
    }

    static String orderPaid(String payerCompanyName, UUID orderId, BigDecimal amount, String currency) {
        return wrap(
                "Paiement confirmé",
                """
                <p>Bonjour %s,</p>
                <p>Le paiement de <strong>%s %s</strong> pour la commande <strong>%s</strong> a bien été reçu.</p>
                <p>Votre campagne est en cours de préparation avec les régisseurs concernés.</p>
                """.formatted(escape(payerCompanyName), amount, escape(currency), orderId));
    }

    static String orderExpired(String payerCompanyName, UUID orderId, long expirationMinutes) {
        return wrap(
                "Votre commande a expiré",
                """
                <p>Bonjour %s,</p>
                <p>Votre commande <strong>%s</strong> n'a pas été réglée dans les %d minutes suivant sa création
                et a donc été automatiquement annulée. Les panneaux réservés ont été remis à disposition.</p>
                <p>Vous pouvez recomposer votre campagne à tout moment depuis votre espace AdSpace Market.</p>
                """.formatted(escape(payerCompanyName), orderId, expirationMinutes));
    }

    private static String wrap(String title, String bodyHtml) {
        return """
                <!doctype html>
                <html>
                  <body style="font-family: Arial, Helvetica, sans-serif; color: #18181b; margin: 0; padding: 24px; background: #fafafa;">
                    <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e4e4e7;">
                      <p style="font-size: 14px; font-weight: 600; color: #2563eb; margin: 0 0 16px;">AdSpace Market</p>
                      <h1 style="font-size: 18px; margin: 0 0 16px;">%s</h1>
                      %s
                      <p style="margin-top: 24px; font-size: 12px; color: #71717a;">
                        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                      </p>
                    </div>
                  </body>
                </html>
                """.formatted(escape(title), bodyHtml);
    }

    private static String escape(String value) {
        return value == null
                ? ""
                : value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
