# UDAAN — Real-Time Airfare Intelligence for India

> **SIH26056 — Development of a Real-time Airfare Price Index for India through Automated Web Scraping of Airline and Online Travel Aggregator Portals for Augmentation of the Consumer Price Index (CPI)**

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://www.sih.gov.in/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-06b6d4.svg)](https://tailwindcss.com/)

---

## ✈️ Overview

**UDAAN** is an enterprise-grade government and statistical technology prototype designed to monitor, analyze, and compute high-frequency, real-time domestic airfare price movements across India.

By systematically aggregating fare observations from airline direct portals and Online Travel Aggregators (OTAs), UDAAN constructs a weighted **Airfare Price Index (APIx)** using passenger traffic distributions (DGCA benchmarks) to augment the transportation sub-index of the Consumer Price Index (CPI) maintained by the Ministry of Statistics and Programme Implementation (MoSPI).

---

## 🏛️ Key Features

- **Executive Airfare Price Index Dashboard**: Real-time headline index tracking, 24h delta, total observations, and data coverage indicators.
- **Representative Route Basket**: Granular monitoring of top domestic city pairs (DEL-BOM, BLR-DEL, BOM-GOI, etc.) weighted by DGCA passenger volumes.
- **Lead-Time Price Curves**: Multi-horizon advance purchase curve analysis ($T+1$, $T+7$, $T+15$, $T+30$, $T+45$) isolating yield management patterns.
- **Fare Component Breakdown**: Transparent unbundling of ticket prices into Base Fare, Government Taxes (GST), User Development Fees (UDF), and Carrier Surcharges.
- **Festival & Event Price Intelligence**: Anomaly detection and price surge tracking during major Indian cultural festivals (Diwali, Chhath Puja, Durga Puja, Eid).
- **Data Quality & Statistical Validation**: Automated IQR and Z-score outlier detection, MoSPI/DGCA benchmark cross-validation, and pipeline health telemetry.
- **Transparent Methodology Pipeline**: Interactive 10-stage MoSPI/DGCA statistical index calculation blueprint.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom aviation-grade dark mode palette
- **Data Visualization**: Recharts (dynamic area, line, and bar charts)
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Integration Layer**: Decoupled HTTP API client with resilient fallback handling, status polling, and contract-ready endpoints
- **Backend**: FastAPI APIx service in `../backend` (SQLite, no seeded fare quotes; ingest real observations via `/api/ingest/quotes`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd airfarex

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will launch at `http://localhost:5173/`. Start the API first:

```bash
cd ../backend
python -m venv .venv
# Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Environment Configuration

Copy `.env.example` to `.env` to configure the backend API target:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=15000
VITE_API_DEBUG=false
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 👥 Team Techies

Developed for **Smart India Hackathon 2026** — Problem Statement **SIH26056**.
