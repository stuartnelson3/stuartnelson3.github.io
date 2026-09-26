---
type: "pages"
layout: "simple-static"
date: 2026-09-26T12:00:00+02:00
---

Software engineer who owns correctness for systems that move money. Four years as primary owner of money movement at a Bitcoin brokerage. Before that, built SoundCloud's first production Kubernetes cluster in AWS, led its anti-abuse team, and maintained Prometheus Alertmanager. Turns loosely defined problems into RFCs, wins buy-in, and ships them. Performance is a feature.

**Backend:** TypeScript/Node.js, Go, Ruby, Rust · **Data:** PostgreSQL (query tuning, indexing, autovacuum), Redis, Kafka · **Frontend:** React (production), Retool, Elm, Angular · **Infra & observability:** Kubernetes, Terraform, Datadog, Prometheus, Alertmanager

---

**Swan Bitcoin: Senior Software Engineer (contract)** *2022 – 2026*

Primary owner of money-movement correctness at a Bitcoin brokerage: ACH deposits, custodial BTC purchases, KYC/AML, withdrawals, fraud, security.

- **Invariant-checking framework.** Reversal bugs were reaching production and being found by hand, some by the ops team. Identified the need for invariant checks against production data, wrote the RFC, presented it to engineering and product leadership, and built the framework alone: 50+ checks across every money-movement domain, run on a schedule with alerting managed in Terraform. The first production run found real violations from bugs that predated the checks, and the framework kept catching new ones as features interacted. Each alert arrives with automated triage: likely domain, correlated recent commits, and relevant logs.
- **Withdrawal system.** Turned a loosely defined brief from the CTO into a spec, then shipped the event-sourced withdrawal system with one other engineer in four months: validation, fraud scoring, manual review queue, batched disbursement, SIM-swap and selfie checks. Most manual reviews ended in approval, so later rebuilt the decision path as a pure, tested policy engine with a shadow-comparison cutover, and designed an AI-assisted triage framework, grounded in human-automation research, that shrinks the queue without letting AI make the decision.
- **Risk review system (in progress at contract end).** Conceived, designed and led a cross-functional project that grew out of the AI-triage work, part of the move from Sift to Sardine; the design was peer-reviewed by the team before the build started. The system keeps an append-only record of every fraud investigation, modeled on medical charting in hospitals: each alert and escalation becomes a link in an ordered chain carrying the user's risk history, risk signals, and the analyst's notes and decision. Goals: analysts see everything they need in one place and can hand a case off mid-investigation, compliance can see why each decision was made, and the chains become data for new automated rules. About half built when the contract ended.
- **KYC document storage.** Proposed, designed and built KYC document storage in S3 with automated delivery to custodians. Primary maintainer of the Persona identity-verification webhooks; built the Prove phone-verification integration.
- **API performance program.** Built per-endpoint p99 attribution, then fixed what it found: covering indexes, per-table autovacuum tuning, pool sizing, caching, and removal of Redis keyspace scans from hot paths. Cut p95 latency by ~45% on the two highest-traffic account endpoints and by ~77% on the account balance endpoint.
- **ACH reversal remediation.** Designed and built the system that recovers funds when ACH payments reverse after BTC was already bought, and hardened it across three phases over 2.5 years.
- **Fraud, risk & security.** Owned the Sift integration: risk-based ACH unlock timing, dynamic instant-buy limits, real-time withdrawal decisions. Added JA4 TLS fingerprint tarpitting, abuse-score onboarding gates, atomic GDPR redaction with drift detection, and security reviews for Vigil, a second Swan product.
- **Internal tools.** Built internal admin and ops tooling in Retool, plus the backend APIs behind it, used by the operations and compliance teams.
- **Codebase health & reliability.** Put every custodian behind a typed `CustodianClient` interface with a lint rule that enforces the boundary, which made it possible to delete ~34,000 lines of dead code from former custodians. Migrated 50+ modules to TypeScript and set the conversion patterns the team adopted. Broke up the largest files into focused modules, and added lint rules, a CI guard against destructive migrations, and deposit/withdrawal SLOs so fixed classes of problems stay fixed.
- **Team.** Presented engineering talks on invariant testing and AI-assisted triage. Interviewed engineering candidates. Ran a conference-talk discussion club for all four years with a steady core group. Wrote the Bug Brigade scoring rubric and the RFC-to-tickets workflow.

---

**Elastic: Senior Software Engineer** *2021 – 2022*

Built Kubernetes mutating webhooks for the APM operator; worked on core observability products (APM server and agents). Interviewed many engineering candidates.

---

**SoundCloud: Anti-Abuse Team Lead** *2019 – 2020*

Led a three-person team. Mentored three engineers: a junior engineer and a data scientist moving into data engineering on the team, and a junior engineer on another team. Interviewed engineering candidates. Built async services that identify and block bots; introduced shadow-mode testing so detection rules could be validated against live traffic before enforcement.

---

**SoundCloud: Senior Production Engineer** *2018 – 2019*

Led infrastructure modernization. Built SoundCloud's first production Kubernetes cluster in AWS, alongside the existing bare-metal infrastructure, and introduced autoscaling.

---

**DigitalOcean: Senior Software Engineer** *2017 – 2018*

Contributed to VM monitoring and alerting products.

---

**SoundCloud: Production Engineer** *2014 – 2017*

Production operations and infrastructure engineering across the platform.

---

**Earlier**: Neo Innovation, SportNgin, Quincy Apparel.

---

**Open source:** Alertmanager maintainer (Prometheus ecosystem) 2017–2020; rewrote the Alertmanager web UI in Elm · Wrote PromDash (Angular), Prometheus's first dashboarding frontend · PromCon 2018 speaker

**Education:** St. Olaf College: B.A., Chemistry and Classics (2010)

**Personal:** American citizen · German citizen
