---
title: "STUART NELSON"
type: "pages"
layout: "simple-static"
date: 2025-06-19T12:36:28+02:00
---

https://github.com/stuartnelson3

**profile**

My goal is to create reliable, well monitored, auditable processes that simply, efficiently, and flexibly provide value to the business and its customers. If it fails, fail visibly and explicitly for the engineers, and gracefully with minimal impact to the customers.

**tools**

- languages (descending by experience): golang, ruby, node/js, rust, typescript
- os: linux (debian+friends)
- orchestration/containerization/provisioning: kubernetes, docker, chef
- observability: prometheus, alertmanager
- storage (as a user): kafka, postgres

**experience**

**SWAN BITCOIN – berlin, de** *(remote)*

**senior risk/platform engineer** *(2022 \- current)*

* integrated [have i been pwned](https://haveibeenpwned.com) service to monitor ongoing breaches
  * monitor api for new breaches
  * scan for and store new breaches involving individual users
  * make breaches visible from user's admin backend page for agents making account take-over (ATO) assessments
* developed system to calculate user funds allowed to leave swan platform
  * single unified concept "withdrawal energy"
  * control amount of money available to leave platform to protect swan from loss of funds via ach reversal
  * translates to both usd and btc currencies
  * allow users to convert freely between btc + usd on-platform
* created automated system for managing receiving, storing, uploading, and tracking customer documents (passport/license, ssn card, proof of address, proof of funds)
  * receive and store documents in s3
  * track individual user document upload requirements and status for swan's partner bitcoin custodians
  * automatically upload documents to custodians
  * allow swan agents to manually trigger uploads to custodians via admin backend
  * monitor and alert on per-custodian upload metrics
* re-designed customer onboarding
  * managed \+ implemented integration between swan and external identity verification vendor
  * securely store customers' personal information and id documents
  * transmit documents and customer information to open accounts at bitcoin custodians
* created withdrawals queue for managing btc withdrawals
  * asynchronously validate user, bitcoin wallet, and withdrawal information
  * a failed validation triggers a manual review by a human risk agent; they approve or block the withdrawal
  * all steps create an auditable event stream for each individual withdrawal
* converted synchronous handling of incoming 3rd party webhooks (bitcoin custodians, risk services vendors) to operating on auditable database-persisted representations of the webhooks
  * webhooks are parsed and relevant information is stored, along with raw webhook json
  * asynchronous jobs handle and store processing results
  * error handling differentiates between retryable and non-retryable processing failures
* lead bi-weekly conference talk \+ programming video club. example topics include:
  * programming principles (eg. OO patterns, SOLID, etc)
  * technical fundamentals (eg. kademlia, CRUSH, consistent hashing)
  * anything with john carmack or john romero

**ELASTIC – berlin, de** *(remote)*

**senior software engineer** *(2021 \- 2022\)*

* created kubernetes mutating webhook \+ helmchart for auto-instrumentation of customer deployments
* developed core observability products: apm-server, apm-agent-go, elastic-agent, and libbeat

**SOUNDCLOUD – berlin, de**

**anti-abuse team lead** *(2019 \- 2020\)*

* created async services and batch jobs that consume data from bigquery and kafka, calculated thresholds across moving time windows, and identified and blocked bots
* added "shadow mode" to all anti-abuse services to compare results from new rules sets to old that would not block users
* advocated for introducing anti-abuse protections to increase overall user experience and user quality at the cost of increased signup friction

**SOUNDCLOUD – berlin, de**

**senior production engineer** *(2018-2019)*

**production engineer** *(2014-2017)*

* created first bare kubernetes soundcloud cluster in aws
* introduced horizontal kubernetes pod and node autoscaling for on-prem and aws kubernetes clusters
* created machine image provisioning service using hashicorp packer
  * single "golden image" was created and used by both aws and bare-metal machines
* assisted teams in prometheus-based service instrumentation, alerting, and grafana dashboarding
* developed golang services to limit logged-in users to one active audio stream

**DIGITALOCEAN – berlin, de** *(remote)*

**senior software engineer** *(2017-2018)*

* worked on virtual machine monitoring and alerting product for end-users

**NEO INNOVATION – columbus, oh**

**software engineer** *(2013-2014)*

* consultant working on projects in ruby, golang, and javascript

**SPORTNGIN – minneapolis, mn**

**software engineer** *(2012-2013)*

* worked on monolithic rails app

**QUINCY APPAREL – new york city, ny**

**software engineer** *(2012)*

* created ruby/sinatra web app to extend functionality of shopify e-commerce site

**open source**

**ALERTMANAGER – [github.com/prometheus/alertmanager](http://github.com/prometheus/alertmanager)**

**maintainer** *(2017-2020)*

*conference talk:[PromCon 2018: Life of an Alert](https://youtu.be/PUdjca23Qa4)*

**education**

**ST. OLAF COLLEGE – northfield, mn**

bachelors of arts, chemistry; bachelors of arts, classics *(2006-2010)*

**personal**

* american citizen (birth)
* german citizen (naturalized)

