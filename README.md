# 🎭 EventHub Playwright Framework

> End-to-end automation framework for the EventHub application — UI, API, and Hybrid testing with TypeScript and Playwright.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-Latest-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Pattern](https://img.shields.io/badge/Pattern-POM-7B68EE?style=flat-square)
![Testing](https://img.shields.io/badge/Testing-UI%20%7C%20API%20%7C%20Hybrid-F4A261?style=flat-square)

---

## 📊 Framework at a Glance

| Metric | Value |
|---|---|
| Test Layers | 3 (UI · API · Hybrid) |
| API Endpoints Covered | 5 |
| Page Objects | 6 |
| Hybrid Flows | 3 |
| UI Test Cases | 8+ |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.x |
| Test Runner | Playwright |
| Runtime | Node.js 18+ |
| Pattern | Page Object Model (POM) |
| Architecture | Component-based + Layered |

---

## ✨ Framework Features

### 🖥️ UI Automation
- Page Object Model implementation
- Reusable component architecture
- Playwright locator strategies
- Authentication handling
- Event workflows & booking workflows
- Search and filter validations

### 🔌 API Automation

The API framework is separated into clean layers:

```
api/
├── clients/          # HTTP client wrappers
├── services/         # Business logic & endpoint calls
└── models/
    ├── request/      # Request payload models
    └── response/     # Response shape models
```

**API coverage implemented:**

| Method | Endpoint | Status |
|---|---|---|
| POST | Login API | ✅ |
| POST | Create Event | ✅ |
| GET | Get Event by ID | ✅ |
| PUT | Update Event | ✅ |
| DELETE | Delete Event | ✅ |

**Response handling:** Success responses · Validation errors · Generic API errors — all handled via status-code-based logic inside the service layer.

### 🔀 Hybrid Testing

Hybrid tests combine API setup with UI validation for realistic, fast flows:

| Flow | Setup | Validation |
|---|---|---|
| Event visibility | Create event via API | Verify in UI |
| Update verification | Update event via API | Confirm updated details in UI |
| Search & filter | Create event via API | Search and filter in UI |
| Booking flow | Create event via API | Book using UI |

---

## 🗂️ Project Structure

```
EventHub_Playwright/
│
├── api/
│   ├── clients/
│   ├── models/
│   │   ├── request/
│   │   └── response/
│   └── services/
│
├── fixtures/
│   ├── ApiFixture.ts
│   └── baseFixture.ts
│
├── pages/
│   ├── components/
│   │   ├── EventBookingComponent.ts
│   │   └── EventFormComponent.ts
│   ├── BookingDetailPage.ts
│   ├── EventPage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── MyBookingPage.ts
│   └── RegisterPage.ts
│
├── test_data/
│
├── tests/
│   ├── api/
│   │   ├── Auth/
│   │   └── Event/
│   ├── hybrid/
│   │   └── eventHybrid.spec.ts
│   └── ui/
│       ├── Auth/
│       ├── Event/
│       └── Home/
│
├── utils/
│   ├── factories/
│   └── helpers/
│
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

## 🧱 Framework Layer Architecture

```
┌─────────────────────────────────────────────────┐
│         Tests  (ui / api / hybrid)              │  ← Test specs
├─────────────────────────────────────────────────┤
│         Fixtures  (baseFixture / ApiFixture)    │  ← Setup & injection
├─────────────────────────────────────────────────┤
│         Pages  (POM)  +  Components             │  ← UI abstraction
├─────────────────────────────────────────────────┤
│         API  (clients / services / models)      │  ← API abstraction
├─────────────────────────────────────────────────┤
│         Utils  (factories / helpers)            │  ← Data & cleanup
├─────────────────────────────────────────────────┤
│         Config  (playwright.config.ts)          │  ← Runtime config
└─────────────────────────────────────────────────┘
```

---

## 🔩 Fixture Architecture

### `baseFixture`
Contains:
- Page object instances
- Reusable UI components
- UI setup utilities
- Authentication setup

### `ApiFixture` *(extends baseFixture)*
Provides:
- Auth token handling
- Event service initialization
- API service reuse inside UI and hybrid tests

```ts
// ApiFixture extends base and injects API context
const test = baseFixture.extend<ApiFixtureType>({
  eventService: async ({ request, authToken }, use) => {
    await use(new EventService(request, authToken));
  }
});
```

---

## 📄 Page Object Design

### Pages

| Page | Responsibility |
|---|---|
| `LoginPage` | Login flow, auth handling |
| `HomePage` | Landing page, navigation |
| `EventPage` | Event interactions, CRUD flows |
| `BookingDetailPage` | Booking detail validations |
| `MyBookingPage` | User booking management |
| `RegisterPage` | User registration flow |

### Components

Reusable components live in `pages/components/`:

| Component | Purpose |
|---|---|
| `EventFormComponent` | Reusable event form interactions |
| `EventBookingComponent` | Booking flow component |

---

## 🏭 Dynamic Test Data

Factory-based payload generation is implemented for parallel-safe, isolated tests.

**Location:** `utils/factories/`

```ts
// Example: factory-generated event payload
export const createEventPayload = () => ({
  title: `Event_${Date.now()}`,
  date: generateFutureDate(),
  capacity: 100,
});
```

---

## 🧹 Cleanup Strategy

Reusable cleanup helpers in `utils/helpers/` ensure:
- Test-created events are removed post-run
- No leftover test data across runs
- Tests remain fully isolated

```ts
// Cleanup pattern used throughout the framework
test('event flow', async ({ eventService }) => {
  let eventId: string;
  try {
    eventId = await eventService.createEvent(payload);
    // ... test steps
  } finally {
    await eventService.deleteEvent(eventId);
  }
});
```

---

## ✅ Current Test Coverage

### UI Tests — Event Module

| Test Case | Status |
|---|---|
| Event search | ✅ |
| Event filtering | ✅ |
| Event creation | ✅ |
| Event booking | ✅ |
| Booking validations | ✅ |
| Ticket validations | ✅ |
| Refund validations | ✅ |
| Booking detail validations | ✅ |

### API Tests — Event APIs

| Test Case | Status |
|---|---|
| Create event | ✅ |
| Get event by ID | ✅ |
| Update event | ✅ |
| Delete event | ✅ |
| Validation error handling | ✅ |

### Hybrid Tests

| Test Case | Status |
|---|---|
| API-created event visibility in UI | ✅ |
| Search & filter for API-created events | ✅ |
| Booking API-created event using UI | ✅ |

---

## 🚀 Running Tests

```bash
# Run all tests
npx playwright test

# Run UI tests only
npx playwright test tests/ui

# Run API tests only
npx playwright test tests/api

# Run Hybrid tests only
npx playwright test tests/hybrid

# Run in headed mode
npx playwright test --headed

# Open HTML report
npx playwright show-report
```

---

## 💎 Design Principles

| Principle | Implementation |
|---|---|
| 🔁 Reusability | Fixtures, components, and helpers are shared across all test types |
| 🧱 Layered design | Clear separation: Tests → Fixtures → Pages → API → Utils |
| 🔒 Separation of concerns | Each layer owns a single responsibility |
| 🏭 Dynamic test data | Factory pattern prevents data collisions in parallel runs |
| ⚡ Parallel-safe execution | ThreadLocal-style fixture scoping |
| 🔌 API-driven setup | Pre-conditions set via API for speed and reliability |
| 👁️ UI-driven validation | End-user flows validated through the browser |
| 🧹 Cleanup strategy | `try/finally` guarantees test isolation |

---

## 🔮 Planned Improvements

- [ ] CI/CD integration (GitHub Actions)
- [ ] Reporting enhancements (Allure / HTML)
- [ ] Additional hybrid test flows
- [ ] Shared assertion utility library
- [ ] Environment-based execution (`qa` / `staging` / `prod`)
- [ ] Advanced tagging & filtering strategy
- [ ] Extended API coverage (bookings, users)

---

## 📌 Notes

This framework is focused on:
- **Scalability** — grows with the application
- **Maintainability** — clear structure, easy to onboard
- **Reusability** — shared fixtures, pages, and utilities
- **Real-world practices** — hybrid UI + API integrated automation

---

*Built with ❤️ using Playwright + TypeScript*
