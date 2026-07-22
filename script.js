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

// One consistent banner reused across all three emails. It promotes the Vantaca
// Home mobile app and shows icons for every accepted payment method, without
// pulling focus away from each email's stage-appropriate message.
const paymentBanner = `
  <div class="pbanner">
    <div class="pbanner__app">
      <span class="pbanner__phone"><svg class="icon"><use href="#i-phone"/></svg></span>
      <div class="pbanner__apptext">
        <strong>Pay in seconds with the Vantaca Home app</strong>
        <span>Pay and manage your assessment anytime, from anywhere.</span>
      </div>
      <div class="pbanner__stores">
        <span class="storebadge"><svg class="icon storebadge__glyph"><use href="#i-apple"/></svg><span class="storebadge__txt"><small>Download on the</small>App Store</span></span>
        <span class="storebadge"><svg class="icon storebadge__glyph"><use href="#i-play"/></svg><span class="storebadge__txt"><small>Get it on</small>Google Play</span></span>
      </div>
    </div>
    <div class="pbanner__methods">
      <span class="pbanner__mlabel">Accepted payment methods</span>
      <div class="pbanner__marks">${allCardMarks}${MARKS.ach}</div>
    </div>
  </div>
  ${note(
    "A single consistent banner (Vantaca Home app + all accepted method icons) runs in every email, so the payment logistics stay present but never overshadow each touch's core message."
  )}`;

const emailFooter = `
  <div class="eb-foot">
    Vantaca Pay on behalf of ${ASSOCIATION}. You're receiving this because your
    assessment is paid by check. Guest checkout &mdash; no portal login required.
    <br />Prefer to keep mailing checks? No action needed.
  </div>`;

/* ---------- Email content ------------------------------------------------- */
/* Three escalating touches whose TONE carries the message: awareness (calm,
   informative) -> reminder with social proof (warm, encouraging) -> urgency
   (supportive, time-aware). Encouraging throughout - never shaming, never
   pressuring. A single consistent banner handles the app + payment methods so
   the copy can stay focused on each stage's purpose.                         */

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
    subject: "There's now an easier way to pay your assessment",
    preview:
      "Whenever it's convenient for you, you can now pay online or in the Vantaca Home app.",
    railNote:
      "Awareness: calm and informative. Introduce the option early, no ask to rush - just plant the idea 20 days out.",
    body: `
      ${note(
        "Touch 1 earns the open and plants the idea. Tone is calm and purely informative - no deadline, no pressure - because 66% never opened the single beta email and the goal here is simple awareness."
      )}
      <div class="eb-hero">
        <p class="eb-hero__eyebrow">A little heads-up from Vantaca Pay</p>
        <h2 class="eb-hero__headline">Paying your assessment just got easier</h2>
        <p class="eb-hero__sub">
          Your next ${ASSOCIATION} assessment comes up in a few weeks. Whenever
          you're ready, you now have a simpler way to take care of it.
        </p>
      </div>

      <p class="eb-p">
        Hi there,
      </p>
      <p class="eb-p">
        We wanted to let you know about an option some homeowners have found handy:
        you can now pay your assessment <strong>online or right from your phone</strong>
        &mdash; no trip to the mailbox, and you get an instant receipt for your records.
      </p>
      <p class="eb-p">
        There's nothing you need to do today. We just wanted you to know it's there
        for whenever it's convenient.
      </p>

      ${paymentBanner}

      ${trustStrip}

      <p class="cta__sub">Takes about 2 minutes &middot; No login required</p>
      <button class="cta" data-cta>Take a look at the options</button>
      ${note(
        "The CTA is low-commitment (&lsquo;Take a look&rsquo;) to match an awareness touch, yet it routes into the same guest checkout so we can still measure early intent."
      )}

      ${emailFooter}
    `,
  },
  {
    id: "e2",
    day: "10 days out",
    dayShort: "Day -10",
    angle: "Reminder + social proof",
    date: "Thu, Jul 30",
    tag: "Touch 2 of 3",
    from: "Vantaca Pay",
    fromAddr: "pay@wildwoodridge-hoa.com",
    initials: "VP",
    subject: "A friendly reminder - paying online takes about 2 minutes",
    preview:
      "No rush at all. When you're ready, thousands of homeowners find it quick and easy.",
    railNote:
      "Reminder + social proof: warm and encouraging. Positive proof (&lsquo;homeowners love how easy it is&rsquo;) - never &lsquo;you're behind&rsquo;. This is the 2.1&times; reminder lever.",
    body: `
      ${note(
        "Touch 2 is the reminder that mattered most in the beta (a follow-up drove a 2.1&times; lift). Social proof is framed as encouragement - &lsquo;homeowners love how easy it is&rsquo; - not as pressure to keep up with neighbors."
      )}
      <div class="eb-hero eb-hero--proof">
        <p class="eb-hero__eyebrow">Just a friendly reminder</p>
        <h2 class="eb-hero__headline">When you're ready, it only takes about 2 minutes</h2>
        <p class="eb-hero__sub">
          Your ${ASSOCIATION} assessment is coming up in about 10 days. No rush &mdash;
          but if now's a good time, paying online is quick and easy.
        </p>
      </div>

      <p class="eb-p">
        Hi again,
      </p>
      <p class="eb-p">
        A gentle nudge in case it's helpful. Plenty of homeowners have told us they
        were glad they gave online payment a try &mdash; it's rated
        <strong>4.8 out of 5 for ease of use</strong>, and most are done in a couple
        of minutes.
      </p>

      <div class="eb-quote">
        &ldquo;Honestly easier than I expected &mdash; I paid from the app on my couch
        and had a receipt right away.&rdquo; &mdash; A ${ASSOCIATION} homeowner
      </div>

      <p class="eb-p">
        Whenever it works for you, we'll make it painless.
      </p>

      ${paymentBanner}

      ${trustStrip}
      ${note(
        "Security/privacy is stated in every touch; reinforcing it here reassures the 11% of beta tickets that cited trust concerns, without leaning on fear."
      )}

      <p class="cta__sub">About 2 minutes &middot; No login required</p>
      <button class="cta" data-cta>Pay when you're ready</button>

      ${emailFooter}
    `,
  },
  {
    id: "e3",
    day: "3 days out",
    dayShort: "Day -3",
    angle: "Urgency (supportive)",
    date: "Thu, Aug 6",
    tag: "Touch 3 of 3",
    from: "Vantaca Pay",
    fromAddr: "pay@wildwoodridge-hoa.com",
    initials: "VP",
    subject: "Your assessment is due soon - and it's quick to take care of",
    preview:
      "Just a few days left. A couple of minutes now and you're all set.",
    railNote:
      "Urgency, delivered supportively: time-aware but still warm and reassuring (&lsquo;you've got this, here's the quick way&rsquo;). Fresh 24h action window (73% vs. 52%).",
    body: `
      ${note(
        "Touch 3 adds urgency through timing, not fear. It acknowledges the deadline while staying warm and reassuring, and each new send opens a fresh 24-hour window (beta clickers who acted within 24h completed at 73% vs. 52%)."
      )}
      <div class="eb-hero eb-hero--urgent">
        <p class="eb-hero__eyebrow">A quick heads-up</p>
        <h2 class="eb-hero__headline">Your assessment is due in 3 days</h2>
        <p class="eb-hero__sub">
          No stress &mdash; if you have a couple of minutes, you can take care of it
          right now and cross it off your list.
        </p>
      </div>

      <div class="eb-countdown">
        <svg class="icon"><use href="#i-clock"/></svg>
        Due in 3 days &middot; About 2 minutes online or in the app
      </div>

      <p class="eb-p">
        Hi there,
      </p>
      <p class="eb-p">
        Your ${ASSOCIATION} assessment of ${money(
      ASSESSMENT
    )} is due Monday. Paying online now means it's <strong>done in a couple of
        minutes</strong>, you skip the mail, and you'll get an instant confirmation for
        your records.
      </p>
      <p class="eb-p">
        You've got this &mdash; we've made the last step easy.
      </p>

      ${paymentBanner}

      ${trustStrip}

      <p class="cta__sub">About 2 minutes &middot; Instant receipt</p>
      <button class="cta" data-cta>Pay now &mdash; it's quick</button>
      ${note(
        "The CTA is the most direct of the three (&lsquo;Pay now&rsquo;) to match the urgency stage, while the surrounding copy stays supportive rather than pressuring."
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
