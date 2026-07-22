# Vantaca Pay — Multi-Touch Conversion Sequence (Prototype)

Interactive prototype for the Vantaca Pay Sr. PM take-home practicum. It demonstrates
**Option B: a 3-email multi-touch sequence** designed to lift the 1-Click Check Payer
Conversion campaign's 11% conversion rate.

**Live demo:** https://emoller1016.github.io/MollerVantacaPayPracticum/

## What this is

A homeowner receives three escalating emails leading up to their assessment due date,
each with a one-click path into a no-login guest checkout:

- **Touch 1 — Day 20 out (Awareness):** benefit-led value prop that answers "why would I change?"
- **Touch 2 — Day 10 out (Social proof + trust):** "8 in 10 neighbors pay online," plus a security/privacy guarantee (this is the reminder touch that drove a 2.1x lift in the beta).
- **Touch 3 — Day 3 out (Urgency + loss aversion):** deadline framing with the fastest path highlighted.

Click any email, then click its CTA to walk through the guest checkout and a payment
confirmation.

## Why Option B

- **Attacks the biggest leak:** 66% of check payers never open the single beta email (1,650 of ~2,500 targeted) vs. ~250 lost across all of checkout.
- **Backed by the strongest signal in the data:** a reminder touch drove **2.1x** conversion.
- **Compounds the 24-hour effect:** clickers who acted within 24h completed at 73% vs. 52% overall; each new send creates a fresh window.
- **Reaches 100% of targeted payers**, unlike checkout-only fixes.

## Product decisions baked in

- **Security & privacy** messaging appears in every email and the checkout (bank-level encryption; details never shared or sold), addressing the 11% of beta tickets citing trust.
- **Card nudge:** every email and the checkout lead with **Visa, Mastercard, Discover, Amex, and Apple Pay** (higher take-rate) while still offering free ACH.
- **Fee transparency:** the 2.95% card convenience fee is disclosed wherever cards appear and updates live in checkout, so we don't recreate the "why am I being charged a fee?" tickets.

## Features to explore

- **PM rationale** toggle (top bar): overlays the data insight behind each design choice.
- **Desktop / Mobile** toggle: preview the experience in either frame.

## Run locally

Any static server works, e.g.:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Files

- `index.html` — app shell, icon defs, sequence rail
- `styles.css` — email-client styling, device frames, rationale layer
- `script.js` — email content, view routing, guest checkout + success

## Notes / assumptions

- Copy, statistics, association name, and payment marks are illustrative placeholders.
- The testing story (Pendo funnel tracking, LaunchDarkly gradual rollout, 7/30-day success metrics) is covered in the accompanying Loom, not built into the prototype.
