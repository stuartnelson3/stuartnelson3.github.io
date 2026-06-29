---
type: "pages"
layout: "simple-static"
date: 2025-06-19T12:36:28+02:00
---

Senior software engineer. Build reliable, well-monitored, auditable systems that move real money. Work RFC-first on multi-quarter initiatives; ship force-multiplier work (shared packages, lint rules, internal skills, CI guards, dashboards) that compounds the team.

**Skills:** TypeScript, Go, Ruby, Rust · PostgreSQL (Sequelize, tuning, autovacuum, indexes), Redis, Kafka · BullMQ, event-sourced workflows · Datadog (APM, dashboards, monitors-as-code), Prometheus, Alertmanager · Kubernetes, Terraform, Chef · Linux (Debian)

---

**Swan Bitcoin — Senior Software Engineer** *Jul 2022 – Present*

Primary owner of money-movement correctness at a Bitcoin brokerage: ACH deposits, custodial BTC purchases, KYC/AML, withdrawals, fraud, security.

- Authored the parent RFC and built a cross-domain **invariant-checking framework** spanning every money-movement domain (reversals, balances, withdrawals, trades, bills, limit orders, deposits) — surfaced and drove fixes for latent financial-correctness bugs in production. Automated triage attaches a domain hypothesis, recent-commit correlation, and relevant log signal to every firing alert.
- Drove a **database performance push** that cut p95 latency on the two highest-traffic account endpoints by ~45% and `GET /me/balance` p95 by ~77% (5.5s→1.3s), moving core-api Apdex from 0.88 to ~0.97 over ~3 weeks. Approach: covering indexes + VACUUM, per-table autovacuum tuning, pool sizing, session-level timeouts, controller parallelization, stale-while-revalidate price cache.
- Designed and built the **ACH reversal remediation system** end-to-end — deficit calc, repossession sells, surplus detection, async custodian reconciliation — iterated across three major phases over 2.5 years.
- Built the **event-sourced withdrawal processing system** end-to-end in a 4-month sprint: validation, Sift scoring, manual review queue, batched disbursement, selfie re-verification, SIM-swap detection.
- Owned **Sift fraud integration** end-to-end; primary maintainer of the **Persona KYC** webhook system; built the **Prove phone-verification** integration.
- **Custodian decoupling:** built the `CustodianClient` TS interface and shared test mock; added an ESLint import-boundary rule; deleted ~34,000 lines of dead PrimeTrust/Fortress code. Migrated 50+ JS modules to TypeScript and established the team's conversion patterns.
- **Agentic engineering workflow:** direct research agents that surface prior art into RFC drafts; run agent-driven DB-performance validation against staging and prod traffic, with agents querying Datadog to compute latency deltas finer-grained than the dashboard. Authored the Agentic Bug Pipeline and Agentic Knowledge Lifecycle RFCs.
- Force-multiplier work: 6+ custom ESLint rules; `@swan-bitcoin/utils` and `@swan-bitcoin/constants` packages; CI guard for destructive migrations; Bug Brigade scoring rubric.
- **Vigil (second Swan product):** security ownership — multi-tenant `householdId` WHERE-clause assertions, DKIM/SPF on inbound-email webhooks, session revocation on LOCKDOWN, serialized audit-log appends, removal of a portal grant-bypass path.

**Elastic — Senior Software Engineer** *2021 – 2022*

Built Kubernetes mutating webhooks for the APM operator; worked on core observability products (APM server and agents).

**SoundCloud — Anti-Abuse Team Lead** *2019 – 2020*

Built async services that identify and block bots; introduced shadow-mode testing so detection rules could be validated against live traffic before enforcement.

**SoundCloud — Senior Production Engineer** *2018 – 2019*

Led infrastructure modernization. Established SoundCloud's first production Kubernetes clusters and introduced autoscaling.

**DigitalOcean — Senior Software Engineer** *2017 – 2018*

Contributed to VM monitoring and alerting products.

**SoundCloud — Production Engineer** *2014 – 2017*

Production operations and infrastructure engineering across the platform.

**Earlier**: Neo Innovation, SportNgin, Quincy Apparel.

---

**Open source:** Alertmanager maintainer (Prometheus ecosystem) 2017–2020 · PromCon 2018 speaker

**Education:** St. Olaf College — B.A., Chemistry and Classics (2010)

**Personal:** American citizen · German citizen
