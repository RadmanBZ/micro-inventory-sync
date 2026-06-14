# 🚀 Micro-Inventory Sync Engine (AI-Powered SaaS)

A high-performance, mobile-first, and multi-tenant Micro-SaaS platform engineered specifically for modern e-commerce merchants and Instagram/OpenSooq sellers in the GCC region (Oman). 

This platform bridges the gap between physical stock management and social commerce, eliminating manual inventory tracking by leveraging cutting-edge AI to automate order extractions directly from customer chat streams.

---

## ✨ Key Features & Product Vision

* **🧠 AI Contextual Order Extractor (Current Core Focus):** Uses advanced Natural Language Processing via Google Gemini to scan incoming direct message chat logs, automatically identify product line-items, extract shipping addresses, and prepare smart draft invoices.
* **🔄 Instant Multi-Tenant Inventory Sync:** One-click confirmations for admins that automatically deduct central warehouse stock and dynamically prevent overselling.
* **📱 Premium Mobile-First PWA UX:** Crafted with a "Quiet Luxury" minimal light-theme design system tailored for rapid on-the-go workflow operations by business admins.
* **🏪 Localized Integration:** Architected to harmonize with regional workflows, Omani Rial (OMR) currency pricing models, and popular classified platforms like OpenSooq.

---

## 🛠️ Tech Stack & Industrial Architecture

The platform uses a robust, decoupled monorepo architecture engineered for low latency, secure data isolation, and high scalability.

### Backend Pipeline
* **Framework:** `FastAPI` (Asynchronous Python Web Framework)
* **ORM / Database:** `SQLModel` (SQLAlchemy + Pydantic) with dynamic SQLite/PostgreSQL support
* **AI Engine:** `Google GenAI SDK` (Gemini 2.5 Flash Platform)
* **Asynchronous Engine:** `aiosqlite` & `asyncpg`

### Frontend Application
* **Framework:** `Next.js` (React 19, App Router)
* **Styling:** `Tailwind CSS` (Premium Light Mode, iOS/Android Native-App Fluidity)
* **Icons:** `Lucide React`

---

## 📂 Repository Structure

```text
micro-inventory-sync/
├── backend/            # FastAPI Async Application & AI Services
│   ├── app/
│   │   ├── api/        # Scalable V1 API Routing & Endpoints
│   │   ├── core/       # Security, Pydantic Environments & Configurations
│   │   ├── models/     # Strict Multi-Tenant Schemas (Shop, Product, Order)
│   │   ├── services/   # Gemini AI Contextual Processors
│   │   └── main.py     # FastAPI App Entrypoint & Lifespan Triggers
│   └── requirements.txt
└── frontend/           # Next.js Responsive Web Application (PWA)
    ├── src/
    │   ├── app/        # Orders Hub, Inventory Grid, and Settings Routes
    │   ├── components/ # Premium UI Component Library
    │   └── lib/        # Dynamic Demo Mock Engines & Formatters