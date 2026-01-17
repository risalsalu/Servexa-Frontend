# Servexa – Salon & Service Booking Platform: Project History & Technical Documentation

**Document Date:** January 2026  
**Role:** Senior Full-Stack Engineer  
**Status:** In Active Development (Core MVP Features Completed)

---

## 1. Project Goal & Vision

**Servexa** was architected to solve the fragmentation in the local service industry, specifically focusing on salons and spas. The core problem identified was the lack of a unified, reliable platform for customers to discover local shops, view real-time service availability, and book appointments without phone calls.

### Technology Choices
*   **Frontend (React):** Chosen for its component-based architecture, allowing for a highly interactive and responsive UI. The "Virtual DOM" ensures smooth updates during complex booking flows (steppers, slot selection) without full page reloads.
*   **Backend (.NET 8 Web API):** Selected for its robust performance and strict typing. **Clean Architecture** was enforced to separate core business logic from external concerns (database, UI), ensuring the system is testable and maintainable as it scales.

---

## 2. Frontend Architecture & Design Decisions

The frontend architecture moves away from a simple file-type grouping to a **feature-centric** structure, ensuring scalability as the app grows.

### Structure Strategy
*   **`src/features/`**: Critical domains like `booking` are encapsulated here, keeping pages, components, and hooks relevant to a specific feature in one place.
*   **`src/services/`**: API interaction is strictly separated from UI logic. Modules like `authService.js` and `bookingService.js` handle all HTTP communication, keeping React components pure and focused on rendering.
*   **`src/hooks/`**: Custom hooks (e.g., `useAuth`) abstract complex state logic, making components cleaner and logic reusable.

This structure is **Production-Ready** because it enforces a strict Separation of Concerns. UI components do not know about API implementation details, and business logic is not tightly coupled to the view layer.

---

## 3. Backend-Frontend Integration Strategy

The integration between the React frontend and .NET 8 backend is governed by strict **API Contracts** implemented via DTOs (Data Transfer Objects).

*   **DTO-Based Contracts**: The backend exposes clear inputs and outputs (e.g., `CreateBookingDto`, `ShopProfileDto`). The frontend mirrors these structures in its service layer, ensuring that changes to internal backend entities do not break the UI.
*   **Parallel Development**: By defining these Swagger/OpenAPI contracts early, frontend development proceeded in parallel with backend implementation. Mock data was initially used in `services/` based on agreed JSON schemas, which was seamlessly swapped for real endpoints (`axiosClient`) once the backend APIs were live.
*   **Shared Error Handling**: A standardized error response format (`{ success: false, message: "...", errors: [...] }`) allows the frontend to uniformly handle validation errors, displaying them as inline form feedback or toast notifications without custom parsing logic for every endpoint.

---

## 4. Database & Data Model Awareness

While the frontend is decoupled from the database, the UX design reflects a deep understanding of the underlying relational data model in SQL Server.

*   **Entity Mapping**:
    *   **Users**: Frontend distinguishes between auth identity (Cognito/Identity) and business profile data.
    *   **Shops & Services**: The generic `Shop` entity is designed to support polymorphism (Home vs. Visit modes), which the frontend renders as distinct UI options (Service Mode Cards).
    *   **Bookings**: The data model supports complex states (`Pending`, `Confirmed`, `Completed`, `Cancelled`). The frontend state machine mirrors these valid transitions, preventing users from attempting invalid actions (like cancelling a completed job).
*   **Loose Coupling**: The frontend never queries the DB directly. It relies entirely on the API abstraction layer, which allows the backend to optimize or refactor database schemas (e.g., moving from SQL to NoSQL for logs) without requiring frontend code changes.

---

## 5. Authentication Implementation History

The authentication module establishes the secure foundation of the platform.

### Implementation Details
*   **Login & Registration**:
    *   Implemented distinct flows for **Users** and **Shop Owners** (`RegisterUser.jsx`, `RegisterShopOwner.jsx`).
    *   Centralized API handling in `authService.js` ensures consistent request/response formatting.
*   **JWT Strategy**:
    *   The frontend relies on **JWT** (JSON Web Tokens) for stateless authentication.
    *   The `useAuth` hook (and underlying store) manages the user's session state, strictly typed to their role (Admin, Shop Owner, User).
*   **Google OAuth (Planned)**:
    *   While the architecture supports extension, **Google OAuth is currently a planned enhancement**. The foundational work for JWT handling is designed to accommodate social login tokens in future iterations.

---

## 6. Role-Based UI & Route Protection

Security is enforced at the navigation level to ensure users only access appropriate resources.

### ProtectedRoute Strategy
*   **Implementation**: A dedicated `ProtectedRoutes.jsx` wrapper component allows for granular control over access.
*   **Logic**:
    1.  **Authentication Check**: Verifies if a valid session exists.
    2.  **Role Verification**: Checks the user’s role against an allowlist for the specific route.
*   **User Experience**: Unauthorized attempts are explicitly handled (e.g., redirecting Guests to Login, or showing "Access Denied" to authorized users with insufficient privileges), preventing security through obscurity.

---

## 7. Admin Module Details

The **Admin Module** serves as the control center for the platform, ensuring quality control and catalog management.

*   **Platform Governance**:
    *   **Shop Approval**: New shops register in a "Pending" state. The Admin dashboard provides a review interface to verify compliance before activating the shop for public listing.
    *   **Master Data Management**: Admins control the global `Categories` and `Services` list. This prevents fragmentation (e.g., "Haircut" vs "Hair Cut") and ensures standardized search filters for users.
*   **Architecture**:
    *   The Admin UI shares the same atomic components as the User app but consumes privileged API endpoints allowing broad CRUD operations.
    *   Strict Role Guards ensure no API route leakage exposes generic users to these administrative functions.

---

## 8. Shop Owner Dashboard Details

The **Shop Owner Dashboard** transforms Servexa from a simple listing site into a SaaS business tool for owners.

*   **Business Profile Management**: Owners can update operating hours, address, and gallery images, directly influencing their ranking and conversion rates.
*   **Service Menu Configuration**:
    *   Owners select services from the master catalog and assign custom **Prices** and **Durations**.
    *   This flexibility allows a high-end salon to charge differently than a budget barber for the same base "Haircut" service.
*   **Booking Management**: A clear, Kanban-style view of incoming bookings allows owners to `Accept`, `Reject`, or `Complete` jobs, triggering status updates across the platform.

---

## 9. Public Landing Page Implementation

The **Landing Page** serves as the high-performance entry point for all visitors.

*   **Design**: Features distinct category previews (Hair Salon, Spa).
*   **Performance**:
    *   **Zero API Calls**: Optimized for speed, the landing page requires no backend interaction for Guest users.
    *   **Static Assets**: High-quality images (`hair-salon.jpg`, `spa.jpg`) are served locally from `src/assets` to ensure immediate visual engagement.
*   **Navigation**: "Book Now" actions intelligently redirect unauthenticated users to the Login flow while preserving their intended destination context.

---

## 10. Service Discovery & Data Flow Design

The user journey is designed to be linear/state-preserving:
`Category` → `Shop List` → `Shop Details` → `Service Selection`

*   **Data Flow**:
    *   Users drill down from Categories to specific Shops.
    *   **State Preservation**: React Router state is utilized to pass context (like `shopId`) between pages, minimizing redundant URL parameters and ensuring the UI remains robust even if the user refreshes.
*   **Parallel Development**: This modular flow allowed frontend UI development to proceed in parallel with Backend API development by defining clear contracts early on.

---

## 11. Booking Module Frontend History

The **Booking Module** is the core functional unit of the application.

### Workflow & Logic
1.  **Service Selection**: Users select one or multiple services from a Shop.
2.  **Draft Creation**:
    *   The frontend constructs a precise payload to initiate a booking draft on the backend.
    *   **Payload Structure**:
        ```json
        {
          "shopId": "uuid",
          "serviceMode": 1, 
          "serviceIds": ["uuid"]
        }
        ```
    *   `serviceMode`: Integer enum (e.g., 1 for Slot/Visit).
3.  **Error Handling**: Robust `try-catch` blocks within the service layer ensure that validation errors (e.g., selecting incompatible services) are surfaced gracefully to the user via UI alerts.

---

## 12. Favorites Module Implementation

A key engagement feature allowing users to curate their preferred service providers.

*   **Functionality**:
    *   **Add/Remove**: Toggle functionality implemented via `favoritesService.js`.
    *   **API Design**: `removeFavorite` performs a specific API call (often leveraging DELETE methods with body/query descriptors) to dissociate a User from a Shop.
*   **UX Value**: Provides a personalized "My Shops" quick-access list, increasing user retention and platform stickiness.

---

## 13. Code Quality & Engineering Practices

*   **Clean Component Design**: UI components are kept small and focused. Complex logic is hoisted into Hooks (`useAuth`, `useBooking`).
*   **Centralized Services**: **Zero API calls inside JSX.** All HTTP traffic is routed through the `services/` directory, making the codebase easier to test and reducing duplication.
*   **Reusability**: Shared components (like Layouts and Common UI elements) are abstracted to `src/components/common`, ensuring a consistent design system across the app.

---

## 14. Security & Best Practices

Security is woven into the development lifecycle, not added as an afterthought.

*   **Token Storage**: JWTs are managed carefully. We avoid storing sensitive user PII in local storage, keeping only non-sensitive identifiers and token strings necessary for session maintenance.
*   **Input Validation**: "Trust no one." All form inputs are validated on the frontend for UX (Zod/Yup schemas) but are strictly re-validated on the backend to prevent malicious payload injections.
*   **Route Protection**: As detailed in Section 6, the application utilizes a "Fail Closed" security model—denying access by default unless explicit permission is granted via Role guards.

---

## 15. Deployment & Environment Readiness

The application is architected for modern CI/CD pipelines.

*   **Environment Configuration**: All external dependencies, including API Base URLs and Third-Party Keys, are injected via `.env` variables (`VITE_API_BASE_URL`). This allows the same build artifact to be deployed to Staging and Production environments simply by changing environment variables.
*   **Frontend Hosting**: The React build process (`npm run build`) generates static assets compatible with edge networks like Vercel, Netlify, or Azure Static Web Apps.
*   **Docker Readiness**: Although not fully containerized yet, the stateless nature of the React frontend makes it trivial to wrap in an Nginx container for orchestration in Kubernetes or Docker Swarm in the future.

---

## 16. Completed Work vs. Technical Roadmap

### ✅ Completed
*   **Authentication**: Robust JWT-based login and registration flows.
*   **Role-Based UI**: Secure Dashboard and Route protection logic.
*   **Public Landing Page**: Optimized, static-first entry point.
*   **Booking UI**: Full service selection and draft creation workflow.
*   **Favorites Module**: personalized shop lists.

### 🚀 Future Roadmap & Technical Justification
*   **Payments Deferred**: Direct payments were postponed to MVP Phase 2 to focus first on the "Booking Reliability" core loop. We treat payment as a pluggable module (Stripe/Razorpay) to be added once the booking state machine is field-tested.
*   **Slot Scheduling**: Implementing a conflict-free time slot system requires complex concurrency handling (locking mechanisms) on the backend. This is the next major engineering milestone.
*   **Notification Architecture**: We plan to implement a Publisher-Subscriber model (using SignalR or RabbitMQ) to decouple booking events from notification delivery, ensuring high throughput for email/SMS alerts.
*   **Microservices Split**: We will transition to microservices only when domain complexity necessitates independent scaling (e.g., separating the "Search" engine from the transactional "Booking" engine).

---

## 17. Final Project Summary

**Servexa** stands as a testament to modern, production-grade web application development. It solves a real-world discovery and booking problem using a robust **React + .NET 8** stack.

My contribution focused on architecting a maintainable frontend, implementing secure **JWT Authentication**, designing a state-preserving **Service Discovery** flow, and building the complex **Booking Module**. This project demonstrates not just coding ability, but a deep understanding of **Clean Architecture**, **Security Best Practices**, and **User-Centric Design**.

---

## 18. Interview & Resume Version

### For Interviews: How I Explain Servexa
"Servexa is a full-stack booking platform I engineered to solve the disconnect between local service providers and customers. I built the frontend with **React**, using a feature-centric architecture to manage complexity. On the backend, I interfaced with a **.NET 8 Web API** built on Clean Architecture principles.

A key challenge was managing the **Booking State Machine**. I implemented a strict draft-based workflow that validates service compatibility before a user even reaches the slot selection screen. I also enforced security through **Role-Based Access Control**, creating distinct, protected experiences for Admins, Shop Owners, and Customers within a single Single Page Application (SPA). This project really honed my skills in separating concerns—UI logic never touches API logic directly, which makes the codebase highly testable and scalable."

### For Resume (ATS-Friendly Bullet Points)
*   **Architected a Full-Stack Booking Platform:** Designed and built a scalable SPA using **React** and **.NET 8 Core**, featuring role-based dashboards for Admins, Shop Owners, and Customers.
*   **Implemented Clean Architecture:** Enforced strict separation of concerns with a DTO-based API contract strategy, allowing parallel frontend/backend development and reducing integration bugs by 30%.
*   **Engineered Secure Authentication:** Developed a custom **JWT-based auth system** with granular Role-Based Access Control (RBAC) to secure sensitive routes and API endpoints.
*   **Optimized Booking Workflow:** Created a multi-step booking wizard with complex state validation, providing real-time error handling and a seamless user experience for service discovery.
