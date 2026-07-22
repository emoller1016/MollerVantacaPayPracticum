"use strict";

/* =========================================================================
   Vantaca Pay - Multi-Touch Conversion Sequence (Option B) prototype
   Static, no-build. Renders an inbox -> email -> guest checkout -> success
   flow with three escalating emails, a PM-rationale annotation layer, and a
   desktop/mobile frame toggle.
   ========================================================================= */

const ASSESSMENT = 350; // avg quarterly assessment ($)
const CARD_FEE_PCT = 0.0295; // 2.95% convenience fee
const CARD_FEE = +(ASSESSMENT * CARD_FEE_PCT).toFixed(2); // $10.33
const ASSOCIATION = "Wildwood Ridge HOA";

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/* ---------- Reusable snippets --------------------------------------------- */

// Payment network marks. Stylized, trademark-safe representations.
const MARKS = {
  visa: `<span class="mark mark--visa">VISA</span>`,
  mc: `<span class="mark mark--mc" title="Mastercard"><i></i><i></i></span>`,
  amex: `<span class="mark mark--amex">AMEX</span>`,
  disc: `<span class="mark mark--disc"><b>DISC</b>VER</span>`,
  apple: `<span class="mark mark--apple">&#63743;&nbsp;Pay</span>`,
  ach: `<span class="mark mark--ach">BANK</span>`,
};

const cardMarks = MARKS.visa + MARKS.mc + MARKS.amex + MARKS.disc;
const allCardMarks = cardMarks + MARKS.apple;

const note = (html) => `<div class="note">${html}</div>`;

// Trust/security strip reused in every email + checkout.
const trustStrip = `
  <div class="trust">
    <svg class="icon trust__icon"><use href="#i-shield"/></svg>
    <p class="trust__txt">
      <strong>Secure &amp; private.</strong> Payments are protected with
      bank-level encryption. Your card and bank details are never stored on your
      device and never shared or sold.
    </p>
  </div>`;

// Payment-methods block used inside emails. Cards + Apple Pay come first and are
// visually emphasized; ACH is offered but secondary. The 2.95% card fee is
// always disclosed up front so we don't recreate the "why am I being charged?"
// support tickets.
const payMethodsBlock = `
  <div class="pay">
    <div class="pay__head">Pay your way &mdash; in about 2 minutes</div>
    <div class="pay__row pay__row--primary">
      <div class="pay__marks">${allCardMarks}</div>
      <div>
        <div class="pay__label">Card &amp; Apple Pay</div>
        <div class="pay__meta">Fastest &mdash; no account or routing number needed. 2.95% fee.</div>
      </div>
      <span class="pay__badge pay__badge--fast">Fastest</span>
    </div>
    <div class="pay__row">
      <div class="pay__marks">${MARKS.ach}</div>
      <div>
        <div class="pay__label">Bank transfer (ACH)</div>
        <div class="pay__meta">No fee. Needs your routing &amp; account number.</div>
      </div>
      <span class="pay__badge pay__badge--free">No fee</span>
    </div>
  </div>
  ${note(
    "All emails advertise the full method set (Visa, Mastercard, Amex, Discover, Apple Pay, ACH). Cards &amp; Apple Pay are listed first and tagged &lsquo;Fastest&rsquo; to nudge the higher take-rate path, while the 2.95% fee stays visible to protect trust (19% of beta tickets were fee-surprise complaints)."
  )}`;

const emailFooter = `
  <div class="eb-foot">
    Vantaca Pay on behalf of ${ASSOCIATION}. You're receiving this because your
    assessment is paid by check. Guest checkout &mdash; no portal login required.
    <br />Prefer to keep mailing checks? No action needed.
  </div>`;

/* ---------- Email content ------------------------------------------------- */
/* Three escalating touches: awareness -> social proof+trust -> urgency.
   Every email carries: secure/private messaging, the full payment-method set
   with cards/Apple Pay prioritized, and the 2.95% fee disclosed.            */

const EMAILS = [
  {
    id: "e1",
    day: "20 days out",
    dayShort: "Day -20",
    angle: "Awareness",
    date: "Mon, Jul 20",
    tag: "Touch 1 of 3",
    from: "Vantaca Pay",
    fromAddr: "pay@wildwoodridge-hoa.com",
    initials: "VP",
    subject: "A faster, safer way to pay your assessment",
    preview:
      "Pay by card, Apple Pay, or bank transfer - set up online in about 2 minutes.",
    railNote:
      "Leads with value + choice to answer the 14% of tickets asking &lsquo;why would I change?&rsquo;",
    body: `
      ${note(
        "Touch 1 fixes the biggest leak first: 66% never opened the single beta email. A soft, benefit-led opener earns the open and plants the value prop 20 days ahead of the due date."
      )}
      <div class="eb-hero">
        <p class="eb-hero__eyebrow">Vantaca Pay</p>
        <h2 class="eb-hero__headline">Skip the checkbook. Pay online in about 2 minutes.</h2>
        <p class="eb-hero__sub">
          Your next ${ASSOCIATION} assessment of ${money(
      ASSESSMENT
    )} is coming up. You can now pay online with the method that's easiest for you.
        </p>
      </div>

      <p class="eb-p">
        Hi there,
      </p>
      <p class="eb-p">
        Paying by check means printing, stamping, and mailing &mdash; and hoping it
        arrives on time. Paying online with Vantaca Pay is <strong>faster, trackable,
        and you get an instant receipt.</strong> No portal account to create.
      </p>

      ${payMethodsBlock}

      ${trustStrip}

      <p class="cta__sub">Takes about 2 minutes &middot; No login required</p>
      <button class="cta" data-cta>See your payment options</button>
      ${note(
        "CTA is exploratory (&lsquo;See your payment options&rsquo;), not high-commitment, because this touch is about awareness. It routes to the same guest checkout so we can measure intent even 20 days out."
      )}

      ${emailFooter}
    `,
  },
  {
    id: "e2",
    day: "10 days out",
    dayShort: "Day -10",
    angle: "Social proof + trust",
    date: "Thu, Jul 30",
    tag: "Touch 2 of 3",
    from: "Vantaca Pay",
    fromAddr: "pay@wildwoodridge-hoa.com",
    initials: "VP",
    subject: "Most of your neighbors already pay online",
    preview:
      "8 in 10 households at Wildwood Ridge pay digitally. Bank-level security - your info is never shared.",
    railNote:
      "Reminder touch = the beta's strongest lever (a 48h reminder drove 2.1&times; conversion). Adds social proof + a security guarantee.",
    body: `
      ${note(
        "Touch 2 is the reminder that mattered most in the beta: a follow-up nudge produced a 2.1&times; conversion lift. We pair it with social proof and a direct answer to the 11% who don't trust entering details online."
      )}
      <div class="eb-hero eb-hero--proof">
        <p class="eb-hero__eyebrow">Join your neighbors</p>
        <p class="eb-hero__big">8 in 10</p>
        <p class="eb-hero__sub">
          households at ${ASSOCIATION} already pay their assessment online. Setting
          up takes about 2 minutes.
        </p>
      </div>

      <div class="eb-proof">
        <div class="eb-proof__num">4.8&#9733;</div>
        <div class="eb-proof__txt">
          Homeowners rate the online payment experience 4.8 out of 5 for ease of use.
        </div>
      </div>

      <p class="eb-p">
        Still paying by check? You're in the minority now &mdash; and switching is
        easier than mailing one more envelope.
      </p>

      <div class="eb-quote">
        &ldquo;I set up Apple Pay in under a minute and got a receipt instantly. Wish
        I'd done it sooner.&rdquo; &mdash; Homeowner, ${ASSOCIATION}
      </div>

      ${trustStrip}
      ${note(
        "Security/privacy is stated in every touch, but it's the emotional centerpiece here where trust objections would otherwise block conversion."
      )}

      ${payMethodsBlock}

      <p class="cta__sub">Have your card or Apple Pay ready &middot; No login required</p>
      <button class="cta" data-cta>Set up my payment</button>

      ${emailFooter}
    `,
  },
  {
    id: "e3",
    day: "3 days out",
    dayShort: "Day -3",
    angle: "Urgency + loss aversion",
    date: "Thu, Aug 6",
    tag: "Touch 3 of 3",
    from: "Vantaca Pay",
    fromAddr: "pay@wildwoodridge-hoa.com",
    initials: "VP",
    subject: `Your ${money(ASSESSMENT)} assessment is due in 3 days`,
    preview:
      "Don't risk a late fee in the mail. Pay in about 2 minutes with Apple Pay or card.",
    railNote:
      "Final urgency touch creates a fresh 24h window (24h clickers completed at 73% vs. 52%). Fastest path = card/Apple Pay.",
    body: `
      ${note(
        "Touch 3 converts the still-undecided with a deadline. Each new send creates a fresh 24-hour action window &mdash; and beta clickers who acted within 24h completed at 73% vs. 52% overall."
      )}
      <div class="eb-hero eb-hero--urgent">
        <p class="eb-hero__eyebrow">Action needed</p>
        <h2 class="eb-hero__headline">Your assessment is due in 3 days</h2>
        <p class="eb-hero__sub">
          ${money(
            ASSESSMENT
          )} to ${ASSOCIATION} &mdash; due Monday. Skip the trip to the mailbox.
        </p>
      </div>

      <div class="eb-countdown">
        <svg class="icon"><use href="#i-clock"/></svg>
        3 days left &middot; A mailed check may not arrive in time
      </div>

      <p class="eb-p">
        The fastest way to pay right now is <strong>Apple Pay or card</strong> &mdash;
        no routing or account number to look up. You'll be done in about 2 minutes and
        get an instant confirmation.
      </p>

      ${payMethodsBlock}

      ${trustStrip}

      <p class="cta__sub">Fastest with Apple Pay &middot; Instant receipt</p>
      <button class="cta" data-cta>Pay now in 2 minutes</button>
      ${note(
        "The urgency CTA is the most direct (&lsquo;Pay now&rsquo;) and foregrounds Apple Pay/card as the fastest route, doubling as friction relief for the 31% who abandon at bank routing/account entry."
      )}

      ${emailFooter}
    `,
  },
];

/* ---------- App state ----------------------------------------------------- */

const state = {
  view: "inbox", // inbox | email | checkout | success
  emailIndex: 0,
  read: new Set(),
  method: "card", // card | apple | ach  (card path pre-selected to nudge)
  entryEmail: 0, // which email launched checkout (for receipt)
};

const screen = document.getElementById("screen");
const railList = document.getElementById("rail-list");
const viewport = document.getElementById("viewport");

/* ---------- Rendering ----------------------------------------------------- */

function renderRail() {
  railList.innerHTML = EMAILS.map(
    (e, i) => `
    <li>
      <button class="railcard ${
        state.view === "email" && state.emailIndex === i ? "is-active" : ""
      }" data-open-email="${i}">
        <span class="railcard__node">${i + 1}</span>
        <span class="railcard__day">${e.dayShort} &middot; ${e.day}</span>
        <span class="railcard__angle">${e.angle}</span>
        <span class="railcard__subject">${e.subject}</span>
        <span class="rail__inline-note">${e.railNote}</span>
      </button>
    </li>`
  ).join("");
}

function renderInbox() {
  screen.innerHTML = `
    <div class="view">
      <div class="inbox__bar">
        <h2 class="inbox__title">Inbox</h2>
        <span class="inbox__count">${EMAILS.length} messages &middot; ${ASSOCIATION}</span>
      </div>
      <p class="inbox__hint">The 3-touch sequence as the homeowner receives it. Open any message to read it and click through to pay.</p>
      ${EMAILS.map(
        (e, i) => `
        <button class="mail ${
          state.read.has(i) ? "is-read" : ""
        }" data-open-email="${i}">
          <span class="mail__avatar">${e.initials}</span>
          <span class="mail__main">
            <span class="mail__from"><span class="mail__unread"></span>${e.from}</span>
            <span class="mail__subject">${e.subject}</span>
            <span class="mail__preview">${e.preview}</span>
            <span class="mail__tag">${e.tag} &middot; ${e.day}</span>
          </span>
          <span class="mail__meta">${e.date}</span>
        </button>`
      ).join("")}
    </div>`;
}

function renderEmail() {
  const e = EMAILS[state.emailIndex];
  const hasPrev = state.emailIndex > 0;
  const hasNext = state.emailIndex < EMAILS.length - 1;
  screen.innerHTML = `
    <div class="view">
      <div class="email__chrome">
        <button class="backbtn" data-back><svg class="icon"><use href="#i-chevron"/></svg> Inbox</button>
        <div class="email__pager">
          <button class="pagerbtn pagerbtn--prev" data-step="-1" ${
            hasPrev ? "" : "disabled"
          } aria-label="Previous email"><svg class="icon"><use href="#i-chevron"/></svg></button>
          <span>${e.dayShort} &middot; ${state.emailIndex + 1} of ${
    EMAILS.length
  }</span>
          <button class="pagerbtn" data-step="1" ${
            hasNext ? "" : "disabled"
          } aria-label="Next email"><svg class="icon"><use href="#i-chevron"/></svg></button>
        </div>
      </div>
      <div class="email__scroll">
        <div class="email__head">
          <h2 class="email__subject">${e.subject}</h2>
          <div class="email__sender">
            <span class="mail__avatar">${e.initials}</span>
            <div>
              <div class="email__sender-name">${e.from}</div>
              <div class="email__sender-addr">${e.fromAddr}</div>
            </div>
          </div>
        </div>
        <div class="email__body">${e.body}</div>
      </div>
    </div>`;
  screen.querySelector(".email__scroll").scrollTop = 0;
}

function feeLines() {
  const isCard = state.method === "card" || state.method === "apple";
  if (isCard) {
    return `
      <div class="fee">
        <div class="fee__row"><span>Assessment</span><span>${money(
          ASSESSMENT
        )}</span></div>
        <div class="fee__row"><span>Card convenience fee (2.95%)</span><span>${money(
          CARD_FEE
        )}</span></div>
        <div class="fee__row fee__row--total"><span>Total today</span><span>${money(
          ASSESSMENT + CARD_FEE
        )}</span></div>
        <p class="fee__note">The 2.95% convenience fee applies to card &amp; Apple Pay. Prefer $0 in fees? Bank transfer (ACH) is free.</p>
      </div>`;
  }
  return `
    <div class="fee">
      <div class="fee__row"><span>Assessment</span><span>${money(
        ASSESSMENT
      )}</span></div>
      <div class="fee__row"><span>Bank transfer fee</span><span>${money(0)}</span></div>
      <div class="fee__row fee__row--total"><span>Total today</span><span>${money(
        ASSESSMENT
      )}</span></div>
      <p class="fee__note">No fee with bank transfer. You'll need your routing &amp; account number.</p>
    </div>`;
}

function methodCard({ id, name, marks, desc, badge, badgeClass }) {
  return `
    <button class="method ${
      state.method === id ? "is-selected" : ""
    }" data-method="${id}">
      <span class="method__radio"></span>
      <span class="method__main">
        <span class="method__name">${name} ${
    badge ? `<span class="method__badge ${badgeClass}">${badge}</span>` : ""
  }</span>
        <span class="method__desc">${desc}</span>
        <span class="method__marks">${marks}</span>
      </span>
    </button>`;
}

function renderCheckout() {
  screen.innerHTML = `
    <div class="view co">
      <div class="co__head">
        <span class="co__brand">Vantaca Pay</span>
        <span class="co__secure"><svg class="icon"><use href="#i-lock"/></svg> Secure checkout</span>
      </div>
      <div class="co__body">
        <div class="co__summary">
          <div>
            <div class="co__summary-label">Assessment due &middot; ${ASSOCIATION}</div>
            <div class="co__summary-assoc">Guest checkout &mdash; no login</div>
          </div>
          <div class="co__summary-amt">${money(ASSESSMENT)}</div>
        </div>

        ${note(
          "Guest checkout with the amount and association pre-filled removes setup friction. Card &amp; Apple Pay are ordered first and pre-selected to steer toward the higher take-rate methods."
        )}

        <h3 class="co__section-title">Choose how to pay</h3>
        ${methodCard({
          id: "apple",
          name: "Apple Pay",
          marks: MARKS.apple,
          desc: "Fastest &mdash; pay with Face ID. No numbers to type.",
          badge: "Fastest",
          badgeClass: "badge--fast",
        })}
        ${methodCard({
          id: "card",
          name: "Credit or debit card",
          marks: cardMarks,
          desc: "Visa, Mastercard, Amex, Discover. No routing number needed.",
          badge: "Recommended",
          badgeClass: "badge--rec",
        })}
        ${methodCard({
          id: "ach",
          name: "Bank transfer (ACH)",
          marks: MARKS.ach,
          desc: "Free, but needs your routing &amp; account number.",
          badge: "No fee",
          badgeClass: "badge--free",
        })}

        <div id="fee-slot">${feeLines()}</div>
        ${note(
          "The fee is disclosed the moment a method is chosen and updates live &mdash; transparency that pre-empts the 19% fee-surprise tickets while still framing ACH as the $0 alternative rather than hiding cards."
        )}

        <button class="co__pay" data-pay>Pay ${payButtonLabel()}</button>
        <div class="co__legal">
          <svg class="icon"><use href="#i-lock"/></svg>
          Encrypted &amp; private. Your details are never shared or sold.
        </div>
      </div>
    </div>`;
}

function payButtonLabel() {
  const isCard = state.method === "card" || state.method === "apple";
  return money(isCard ? ASSESSMENT + CARD_FEE : ASSESSMENT);
}

function refreshCheckoutDynamic() {
  const slot = document.getElementById("fee-slot");
  if (slot) slot.innerHTML = feeLines();
  const payBtn = screen.querySelector("[data-pay]");
  if (payBtn) payBtn.textContent = `Pay ${payButtonLabel()}`;
  screen.querySelectorAll("[data-method]").forEach((btn) => {
    btn.classList.toggle("is-selected", btn.dataset.method === state.method);
  });
}

function renderSuccess() {
  const isCard = state.method === "card" || state.method === "apple";
  const methodName =
    state.method === "apple"
      ? "Apple Pay"
      : state.method === "card"
      ? "Card"
      : "Bank transfer (ACH)";
  const total = isCard ? ASSESSMENT + CARD_FEE : ASSESSMENT;
  const conf = "VP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  screen.innerHTML = `
    <div class="view done">
      <div class="done__badge"><svg class="icon"><use href="#i-check"/></svg></div>
      <h2 class="done__title">Payment complete</h2>
      <p class="done__sub">
        You're all set &mdash; no more checks to mail. A receipt is on its way to your email.
      </p>
      <div class="done__receipt">
        <div class="done__receipt-row"><span>Association</span><span>${ASSOCIATION}</span></div>
        <div class="done__receipt-row"><span>Method</span><span>${methodName}</span></div>
        <div class="done__receipt-row"><span>Amount</span><span>${money(
          total
        )}</span></div>
        <div class="done__receipt-row"><span>Confirmation</span><span>${conf}</span></div>
      </div>
      ${note(
        "Confirmation state reinforces the switch (&lsquo;no more checks to mail&rsquo;). In the real build this is where we'd offer one-tap enrollment into autopay to lift the 29% recurring rate."
      )}
      <div class="done__actions">
        <button class="btn-ghost" data-restart>Restart the flow</button>
        <button class="btn-ghost" data-back>Back to inbox</button>
      </div>
    </div>`;
}

/* ---------- View router --------------------------------------------------- */

function render() {
  if (state.view === "inbox") renderInbox();
  else if (state.view === "email") renderEmail();
  else if (state.view === "checkout") renderCheckout();
  else if (state.view === "success") renderSuccess();
  renderRail();
}

function openEmail(i) {
  state.emailIndex = i;
  state.read.add(i);
  state.view = "email";
  render();
}

function goInbox() {
  state.view = "inbox";
  render();
}

function startCheckout() {
  state.entryEmail = state.emailIndex;
  state.method = "card"; // nudge: card path pre-selected
  state.view = "checkout";
  render();
}

/* ---------- Event delegation ---------------------------------------------- */

document.addEventListener("click", (ev) => {
  const openBtn = ev.target.closest("[data-open-email]");
  if (openBtn) {
    openEmail(Number(openBtn.dataset.openEmail));
    return;
  }
  if (ev.target.closest("[data-back]")) {
    goInbox();
    return;
  }
  if (ev.target.closest("[data-cta]")) {
    startCheckout();
    return;
  }
  const stepBtn = ev.target.closest("[data-step]");
  if (stepBtn) {
    const next = state.emailIndex + Number(stepBtn.dataset.step);
    if (next >= 0 && next < EMAILS.length) openEmail(next);
    return;
  }
  const methodBtn = ev.target.closest("[data-method]");
  if (methodBtn) {
    state.method = methodBtn.dataset.method;
    refreshCheckoutDynamic();
    return;
  }
  if (ev.target.closest("[data-pay]")) {
    state.view = "success";
    render();
    return;
  }
  if (ev.target.closest("[data-restart]")) {
    state.read.clear();
    state.emailIndex = 0;
    state.view = "inbox";
    render();
    return;
  }
});

/* ---------- Top-bar controls ---------------------------------------------- */

const rationaleToggle = document.getElementById("rationale-toggle");
rationaleToggle.addEventListener("click", () => {
  const on = document.body.classList.toggle("show-rationale");
  rationaleToggle.setAttribute("aria-pressed", String(on));
});

document.querySelectorAll(".seg__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".seg__btn")
      .forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    viewport.dataset.device = btn.dataset.device;
  });
});

/* ---------- Init ---------------------------------------------------------- */

render();
