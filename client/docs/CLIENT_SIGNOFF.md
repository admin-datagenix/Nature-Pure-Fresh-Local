# NaturePure Fresh — Client sign-off tracker

Use this document to record stakeholder approval against the user stories below.

## 1. Customer journey wireframes

**Story:** As a client stakeholder, I want to see the customer journey as wireframes so that I can confirm the flow before visual design begins.

| Screen | Route | Mobile (<768px) | Desktop (≥1024px) | Wireframe / flow OK | Client sign-off |
|--------|--------|-----------------|-------------------|---------------------|-----------------|
| Home | `/` | ✓ responsive | ✓ responsive | ☐ | ☐ |
| Listing (shop) | `/shop`, `/shop/:category` | ✓ | ✓ | ☐ | ☐ |
| Product detail | `/product/:slug` | ✓ | ✓ | ☐ | ☐ |
| Cart | `/cart` | ✓ | ✓ | ☐ | ☐ |
| Checkout | `/checkout` | ✓ | ✓ | ☐ | ☐ |
| Account | `/account` | ✓ | ✓ | ☐ | ☐ |

**Notes:** Live app serves as interactive wireframe prototype. Sign-off date: _______________

---

## 2. Visual design (storefront)

**Story:** As a client stakeholder, I want to see the finished look of the store so that I can approve the brand treatment before build.

| Screen | Desktop design | Mobile design | Assets exported | Client sign-off |
|--------|----------------|---------------|-----------------|-----------------|
| Home | ☐ | ☐ | ☐ | ☐ |
| Shop / listing | ☐ | ☐ | ☐ | ☐ |
| Product detail | ☐ | ☐ | ☐ | ☐ |
| Cart | ☐ | ☐ | ☐ | ☐ |
| Checkout | ☐ | ☐ | ☐ | ☐ |
| Account | ☐ | ☐ | ☐ | ☐ |

Brand tokens: primary `#294633`, cream `#F7F5EF`, Nunito typography (see `client/src/index.css`).

---

## 3. Mobile OTP registration

**Story:** As a new customer, I want to register with my mobile number and an OTP so that I can create an account in seconds.

**Acceptance criteria (implemented in mock API + `/register`):**

| Criterion | Status |
|-----------|--------|
| Registration completes with **verified mobile** (`phone_verified: true`) | ✓ |
| **Duplicate mobile** blocked on OTP send and verify | ✓ |
| **Account created** and **session token** issued on success | ✓ |
| OTP expires in **5 minutes** (`OTP_EXPIRY_SECONDS`) | ✓ |

---

## 4. Login and account recovery

**Story:** As a returning customer, I want to log in and recover access so that I never lose my order history.

**Acceptance criteria (implemented in `/login`, `/forgot-password`, `mockApi.js`):**

| Criterion | Status |
|-----------|--------|
| Login by **password** (email) or **mobile OTP** | ✓ |
| Reset / login OTP **expires** in configured window (5 min) | ✓ |
| Failed attempts **rate-limited** (5 failures → 15 min lockout) | ✓ |

---

**Client name:** ____________________  
**Signature / approval:** ____________________  
**Date:** ____________________
