# Backend Technology & Architectural Discovery Inventory

## Executive Technology Summary
- **Primary Language**: JavaScript / TypeScript (Node.js ecosystem)
- **Framework**: Expo (v56) / React Native for Web & Firebase Cloud Backend Services
- **Runtime Environment**: Node.js 20+ / Browser DOM / Cloud Functions
- **Package Manager**: `npm` / `npx`
- **Architecture**: Decoupled Client-Server & Serverless (Firebase Authentication, Firestore DB, Cloud Functions)
- **API Protocol**: REST / HTTP APIs / Firebase Client SDKs

---

## Technical Stack Discovery Breakdown

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | Expo React Native Web | Cross-platform web & mobile app architecture |
| **Backend / BaaS** | Firebase Backend Suite | Auth, Firestore Database, Storage |
| **UI Components** | React Native Web / Custom CSS | Custom responsive visualizers for Trees & Graphs |
| **State / Storage** | `@react-native-async-storage` | Local storage & session persistence |
| **Routing** | `expo-router` | File-system based router (`src/app`) |

---

## Authentication & Authorization Architecture
- **Authentication Mechanisms**: Firebase Authentication (Email/Password, OAuth2 Tokens, Session Storage)
- **Authorization Models**: Role-Based Access Control (RBAC) enforced via Firestore Security Rules & Middleware checks.
- **Session Tokens**: JWT (JSON Web Tokens) handled via Firebase Client SDK and stored securely.

---

## API Inventory Summary

- **Public Endpoints**:
  - `POST /auth/login` (Firebase Auth endpoint)
  - `POST /auth/register` (User registration)
  - `GET /health` (System status)
- **Protected Endpoints**:
  - `GET /api/user/profile` (User metadata)
  - `POST /api/algorithms/history` (Save visualizer execution history)
  - `DELETE /api/user/account` (Account removal)
- **Admin/Internal Endpoints**:
  - `POST /api/admin/metrics` (Usage diagnostics)

---

## External Integrations & Services
- Firebase SDK (`firebase/app`, `firebase/auth`, `firebase/firestore`)
- Google Fonts & Asset CDN
