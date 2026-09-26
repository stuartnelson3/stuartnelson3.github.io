---
type: "pages"
layout: "simple-static"
date: 2026-09-26T12:00:00+02:00
---

Software engineer who owns correctness for systems that move money: four years at a Bitcoin brokerage, and before that, built SoundCloud's first production Kubernetes cluster in AWS, led its anti-abuse team, and maintained Prometheus Alertmanager. Turns loosely defined problems into RFCs, wins buy-in, and ships them.

**Backend:** TypeScript/Node.js, Go, Ruby, Rust · **Data:** PostgreSQL (query tuning, indexing, autovacuum), Redis, Kafka · **Frontend:** React (production), Retool, Elm, Angular · **Infra & observability:** Kubernetes, Terraform, Datadog, Prometheus, Alertmanager

---

**Swan Bitcoin: Senior Software Engineer (contract)** *2022 – 2026*

Primary owner of money-movement correctness at a Bitcoin brokerage: ACH deposits, custodial BTC purchases, KYC/AML, withdrawals, fraud, security.

- **Invariant-checking framework.** Proposed in an RFC, presented to engineering and product leadership, and built alone a framework of 50+ invariant checks run against production data across all of Swan: users, balances, transfers, deposits, trades, withdrawals and billing. It started with ACH reversals, where bugs were being found manually; the first run found violations from long-standing bugs, and it kept catching new ones as features interacted. Other engineers then began writing their own checks on the framework.
- **Withdrawal risk model.** Replaced per-deposit ACH lock dates, which broke down once users could sell BTC, with one rule for every USD and BTC withdrawal: withdrawal power equals total funds minus funds that can still reverse, adjusted for deposit age and user risk tier. Specced it from a loosely defined CTO brief, built it, and ran it in shadow against the old locks for three months before cutover. Because it tracks the BTC price, it protects Swan when the price falls and gives users room when it rises. Also built ACH reversal remediation, hardened over 2.5 years.
- **Withdrawal queue.** Made withdrawals reviewable; before, they went out as soon as a user asked. Conceived the queue, scoped it with a risk analyst, and specced and shipped it, event-sourced, with one other engineer in four months. Later rebuilt the decision path as a pure, tested policy engine, and designed AI-assisted triage, grounded in human-automation research, that shrinks the review queue while humans still make every decision.
- **Risk review system (in progress at contract end).** Conceived, designed and led a cross-functional project, part of the move from Sift to Sardine, to record every fraud investigation like a hospital chart: each alert, escalation and verification step joins an append-only chain with the user's risk history and the analyst's notes and decision. It gives analysts clean handoffs, compliance a record of every decision, and the team data for new automated rules. Design peer-reviewed by the team; about half built.
- **Team & process.** Introduced the RFC process at Swan, and later the workflow that turns an approved RFC into tickets. Presented engineering talks on invariant testing and AI-assisted triage. Ran a video club for all four years, watching and discussing conference talks with a steady core group. Interviewed engineering candidates. Wrote the Bug Brigade scoring rubric.
- **KYC document storage.** Proposed, designed and built KYC document storage in S3 with automated delivery to custodians. Primary maintainer of the Persona identity-verification webhooks; built the Prove phone-verification integration.
- **Performance & cost.** Built per-endpoint p99 attribution, then fixed what it found (indexes, autovacuum tuning, pool sizing, caching, Redis scans on hot paths), cutting p95 by ~45% on the two highest-traffic account endpoints and ~77% on the balance endpoint. Right-sized Aurora storage per region after a cost analysis, with a failover step in the disaster-recovery runbook.
- **Fraud, risk & security.** Owned the Sift integration: risk-based ACH unlock timing, dynamic instant-buy limits, real-time withdrawal decisions. Added JA4 TLS fingerprint tarpitting, abuse-score onboarding gates, atomic GDPR redaction with drift detection, and security reviews for Vigil, a second Swan product.
- **Internal tools.** Built internal admin and ops tooling in Retool, plus the backend APIs behind it, used by the operations and compliance teams.
- **Codebase health & reliability.** Put every custodian behind a typed `CustodianClient` interface enforced by a lint rule, which gave tests one shared mock and allowed deleting ~34,000 lines of dead code. Migrated 50+ modules to TypeScript and set the team's conversion patterns. Added lint rules, a CI guard against destructive migrations, and deposit/withdrawal SLOs so fixed problems stay fixed.

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
