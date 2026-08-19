# Sleepsia E-Commerce Daily Reporting & Intelligence Prototype

A full-stack multi-agent e-commerce reporting and intelligence prototype for **Sleepsia**, a sleep and wellness brand selling across **Amazon, Flipkart, Blinkit, and Swiggy Instamart**.

---

## 1. System Architecture & Multi-Agent Workflow

The system follows a **Supervisor + Specialist Agents** architecture:

```
                  ┌─────────────────────────────────┐
                  │   Sleepsia Reporting Supervisor │
                  └───────────────┬─────────────────┘
                                  │
      ┌──────────────┬────────────┴────────────┬──────────────┐
      ▼              ▼                         ▼              ▼
┌───────────┐  ┌───────────┐             ┌───────────┐  ┌───────────┐
│  Amazon   │  │ Flipkart  │             │  Blinkit  │  │ Instamart │
│Specialist │  │Specialist │             │Specialist │  │Specialist │
│   Agent   │  │   Agent   │             │   Agent   │  │   Agent   │
└─────┬─────┘  └─────┬─────┘             └─────┬─────┘  └─────┬─────┘
      │              │                         │              │
      └──────────────┼─────────────────────────┴──────────────┘
                     ▼
      ┌────────────────────────────────────────┐
      │ Performance Consolidation Agent        │
      │ (Normalization, Health Score, Alerts)  │
      └──────────────────┬─────────────────────┘
                         ▼
      ┌────────────────────────────────────────┐
      │ Sleepsia Reporting Agent               │
      │ (Gemini 3.7 Flash AI + Word DOCX)      │
      └────────────────────────────────────────┘
```

1. **Sleepsia Reporting Supervisor**: Accepts reporting requests, validates parameters, delegates extraction to marketplace specialist agents, and coordinates pipeline execution.
2. **Marketplace Specialist Agents**:
   - `Amazon Performance Agent`: Ingests operational data from `amazon_report_14d.csv`, calculates BSR, ASIN sales, and ROAS.
   - `Flipkart Performance Agent`: Ingests operational data from `flipkart_report_14d.csv`, calculates FSN returns and ad efficiency.
   - `Blinkit Performance Agent`: Ingests 10-minute dark-store metrics from `blinkit_report_14d.csv`.
   - `Instamart Performance Agent`: Ingests metro fulfillment data from `instamart_report_14d.csv`.
3. **E-Commerce Performance Consolidation Agent**: Joins cross-platform identifiers to the `product_master.csv`, standardizes metrics, calculates composite product health (0–100), and flags inventory depletion risks.
4. **Sleepsia Reporting Agent**: Uses server-side **Gemini 3.7 Flash** to synthesize qualitative trends, generate executive interpretations, and format the official 14-section briefing and downloadable `.docx` file.

---

## 2. Core Operational Principles

- **Strict Separation of Deterministic Math & AI**: All calculations (ROAS, ACOS, 7-day Sales Velocity, Inventory Days Cover, Return Rates) are computed deterministically in code. Zero AI hallucinations in numerical data.
- **Human-in-the-Loop Decision Support**: The system does **not** autonomously alter advertising budgets or modify campaigns. Insights are presented as structured management decision points for employee review.
- **Simulated Synthetic Environment**: The prototype uses synthetic 14-day CSV datasets to simulate marketplace API responses.

---

## 3. Production API Integration Roadmap

When moving to production, each specialist agent swaps its local CSV parser with authenticated live APIs without changing the supervisor or consolidation layer:

| Platform | Production API Integration | Key Reports & Webhooks |
|---|---|---|
| **Amazon** | Amazon Selling Partner API (SP-API) & Amazon Advertising API | `GET_MERCHANT_LISTINGS_ALL_DATA`, `GET_V2_SETTLEMENT_REPORT_DATA_FLAT_FILE`, Sponsored Products Report |
| **Flipkart** | Flipkart Seller API v3 & Flipkart Ads API | `/v3/orders/search`, `/v3/inventory`, `/v3/returns`, Ads Performance Campaign Report |
| **Blinkit** | Blinkit Brand Partner API & Dark Store Webhooks | Dark-store regional stock feed, 10-minute delivery velocity, store coverage |
| **Instamart** | Swiggy Brand Partner API & Swiggy Ads Portal | Pod-level inventory balance, quick-commerce ad attribution |

---

## 4. Key Metrics & Formula Definitions

- **ROAS (Return on Ad Spend)**: `Ad Attributed Revenue / Ad Spend`
- **ACOS (Advertising Cost of Sales)**: `(Ad Spend / Ad Attributed Revenue) × 100`
- **7-Day Sales Velocity**: `Total Units Sold over 7 days / 7`
- **Inventory Days Cover**: `Current Stock / 7-Day Sales Velocity` (Alert if < 7 days)
- **Product Health Score**: Deterministic composite index (0–100) evaluating star ratings, return rates, inventory safety, and ROAS.
