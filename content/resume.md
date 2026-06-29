---
type: "pages"
layout: "simple-static"
date: 2025-06-19T12:36:28+02:00
---

Senior software engineer. Build reliable, well-monitored, auditable systems that move real money. Work RFC-first on multi-quarter initiatives; ship force-multiplier work (shared packages, lint rules, internal skills, CI guards, dashboards) that compounds the team. Treat tech debt and dead code need to be addressed, not ignored. Performance is a feature.

**Skills:** TypeScript, Go, Ruby, Rust · PostgreSQL (Sequelize, tuning, autovacuum, indexes), Redis, Kafka · BullMQ, event-sourced workflows · Datadog (APM, dashboards, monitors-as-code), Prometheus, Alertmanager · AI-assisted engineering (agentic triage, invariant analysis, refactoring) · Kubernetes, Terraform, Chef · Linux (Debian)

---

**Swan Bitcoin — Senior Software Engineer** *Jul 2022 – Present*

Primary owner of money-movement correctness at a Bitcoin brokerage: ACH deposits, custodial BTC purchases, KYC/AML, withdrawals, fraud, security.

- Authored the parent RFC and built a cross-domain **invariant-checking framework** spanning every money-movement domain (reversals, balances, withdrawals, trades, bills, limit orders, deposits): surfaced and drove fixes for latent financial-correctness bugs in production. Automated triage attaches a domain hypothesis, recent-commit correlation, and relevant log signal to every firing alert.
- Designed and built the **ACH reversal remediation system** end-to-end: deficit calc, repossession sells, surplus detection, async custodian reconciliation. Iterated across three major phases over 2.5 years.
- Built the **event-sourced withdrawal processing system** end-to-end in a 4-month sprint: validation, Sift scoring, manual review queue, batched disbursement, selfie re-verification, SIM-swap detection. Subsequently redesigned the decision path as *decisions-as-data*: decomposed into signals/validations/policy, a pure policy engine over composable adder rules and an override lattice, a fast-pass predicate framework testing human and AI suggestions, and a shadow-comparison harness for zero-risk cutover.
- Established a repeatable **API query-performance program:** per-endpoint p99 attribution via custom Datadog spans, covering indexes, per-table autovacuum tuning, pool sizing, session-level timeouts, a FULL OUTER JOIN pre-scope that cut the admin billing query ~25–30×, SWR + tiered-staleness BTC price cache, and removal of full-keyspace Redis `SCAN`/`KEYS` from auth and settings hot paths. Cut p95 on the two highest-traffic account endpoints by ~45% and `GET /me/balance` p95 by ~77% (5.5s→1.3s), moving core-api Apdex from 0.88 to ~0.97.
- Built **GDPR/PII redaction** correctness and remediation: atomic single-`UPDATE` redaction, drift detection with throttled chunked SIGTERM-graceful backfill, legacy-tombstone handling, and hard-deletion of mobile device keys at account close.
- **Fraud & risk:** owned the Sift integration end-to-end: risk-based ACH unlock timing, dynamic instant-buy limits, blocked-entity management, real-time withdrawal decisions via webhooks. Refactored user→Sift coupling to an event bus. Co-authored the design to migrate risk decisions and review queues from Sift to Sardine.
- **KYC & identity:** primary maintainer of the Persona webhook system; led decomposition of a monolithic 1000+ line webhook handler into single-responsibility TypeScript modules. Built the full Prove phone-verification integration.
- **Custodian decoupling:** built the `CustodianClient` TS interface and shared test mock; added an ESLint import-boundary rule; deleted ~34,000 lines of dead code from previous custodians. Migrated 50+ JS modules to TypeScript and established the team's conversion patterns.
- Ongoing **god-file decomposition:** split 12+ massive files (1000–1700 lines each) into focused single-responsibility modules using a consistent validate/prepare/execute pattern.
- **"Stop the line" reliability:** machine-readable `errorCode` adoption across the API, deposit/withdrawal SLOs + Datadog metrics, CI guard against destructive migrations, feature-flag audit logging.
- **Security gates:** JA4 TLS fingerprint tarpitting driven by Datadog alerts, abuse-score onboarding gates, SIM-swap checks on high-value withdrawals, login observability hardening.
- **Vigil (second Swan product):** security ownership: multi-tenant `householdId` WHERE-clause assertions, DKIM/SPF on inbound-email webhooks, session revocation on LOCKDOWN, serialized audit-log appends, removal of a portal grant-bypass path.
- **Agentic engineering workflow:** find and integrate peer-reviewed literature into RFC drafts with agentic assistance; run agent-driven DB-performance validation against staging and prod traffic; built the Cygnet AI invariant-error-analysis strategy. Authored the Agentic Bug Pipeline and Agentic Knowledge Lifecycle RFCs. Built internal engineering skills: `extract-to-package`, `simple-made-easy`, `security-abuse-review`, `self-review`, `trace-pg-query-to-code`.
- Force-multiplier work: 6+ custom ESLint rules; `@swan-bitcoin/utils` and `@swan-bitcoin/constants` packages; Bug Brigade scoring rubric; RFC-to-tickets workflow.

---

**Elastic — Senior Software Engineer** *2021 – 2022*

Built Kubernetes mutating webhooks for the APM operator; worked on core observability products (APM server and agents).

---

**SoundCloud — Anti-Abuse Team Lead** *2019 – 2020*

Built async services that identify and block bots; introduced shadow-mode testing so detection rules could be validated against live traffic before enforcement.

---

**SoundCloud — Senior Production Engineer** *2018 – 2019*

Led infrastructure modernization. Established SoundCloud's first production Kubernetes clusters and introduced autoscaling.

---

**DigitalOcean — Senior Software Engineer** *2017 – 2018*

Contributed to VM monitoring and alerting products.

---

**SoundCloud — Production Engineer** *2014 – 2017*

Production operations and infrastructure engineering across the platform.

---

**Earlier**: Neo Innovation, SportNgin, Quincy Apparel.

---

**Open source:** Alertmanager maintainer (Prometheus ecosystem) 2017–2020 · PromCon 2018 speaker

**Education:** St. Olaf College: B.A., Chemistry and Classics (2010)

**Personal:** American citizen · German citizen
