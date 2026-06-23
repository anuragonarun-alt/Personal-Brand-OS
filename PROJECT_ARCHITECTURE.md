# Project Architecture

## Purpose

This document defines the architecture, coding standards, and development rules for Personal Brand OS.

All AI agents working on this project must read this file before making changes.

---

# Tech Stack

Frontend:

* Next.js
* React
* TypeScript
* Tailwind CSS

Backend:

* Supabase

Hosting:

* Vercel

Version Control:

* GitHub

---

# Architecture Principles

## 1. Keep It Simple

Prefer simple solutions over complex solutions.

Do not introduce additional libraries unless necessary.

---

## 2. MVP First

Current objective:

Launch the MVP as quickly as possible.

Avoid:

* Premature optimization
* Unnecessary abstractions
* Over-engineering

---

## 3. Build Feature By Feature

Complete one feature before starting another.

Example:

Authentication
↓
Idea Vault
↓
Content Pipeline
↓
Analytics

Not:

Authentication + Analytics + AI + Calendar simultaneously.

---

# Folder Structure

```text
app/
components/
features/
lib/
types/
```

---

# app/

Purpose:

Routing and pages.

Examples:

```text
app/
├── page.tsx
├── dashboard/
├── ideas/
├── pipeline/
├── analytics/
```

Rules:

* Keep page files small
* Do not place large business logic here
* Use components and features

---

# components/

Purpose:

Reusable UI components.

Examples:

```text
components/
├── Sidebar.tsx
├── Header.tsx
├── Button.tsx
├── Card.tsx
```

Rules:

* Reusable across multiple pages
* UI only
* No business logic

---

# features/

Purpose:

Feature-specific code.

Examples:

```text
features/
├── ideas/
├── pipeline/
├── analytics/
```

Rules:

* Keep feature code together
* Avoid mixing features

---

# lib/

Purpose:

Shared utilities and integrations.

Examples:

```text
lib/
├── supabase.ts
├── helpers.ts
```

Rules:

* Shared logic only
* No UI

---

# types/

Purpose:

TypeScript types.

Examples:

```text
types/
├── idea.ts
├── analytics.ts
```

Rules:

* Store reusable types here

---

# Component Rules

Preferred:

Small reusable components.

Bad:

One component with 1000+ lines.

Good:

```text
Sidebar
Header
DashboardCard
AnalyticsCard
```

combined together.

---

# Naming Conventions

Components:

```text
Sidebar.tsx
Header.tsx
IdeaCard.tsx
```

Pages:

```text
page.tsx
```

Feature folders:

```text
ideas
pipeline
analytics
```

Use clear names.

Avoid abbreviations.

---

# AI Agent Rules

Before making changes:

1. Read PRODUCT.md
2. Read PROJECT_ARCHITECTURE.md
3. Read PROJECT_LOG.md
4. Read ROADMAP.md

Then inspect the existing codebase.

---

## AI Agents Must Not

* Create duplicate components
* Create duplicate pages
* Create duplicate folders
* Move files without reason
* Rewrite working code unnecessarily
* Add large amounts of code to app/page.tsx

---

## AI Agents Should

* Reuse existing components
* Follow existing patterns
* Keep files focused
* Explain significant architectural changes

---

# Git Workflow

After each completed milestone:

```bash
git add .
git commit -m "meaningful message"
git push
```

Examples:

```bash
git commit -m "feat: add sidebar"
git commit -m "feat: add authentication"
git commit -m "feat: add idea vault"
```

---

# Current MVP Scope

Allowed:

* Authentication
* Idea Vault
* Content Pipeline
* Analytics Dashboard

Not Allowed Yet:

* AI Writer
* AI Coach
* Competitor Tracking
* Team Features
* Mobile App

---

# Golden Rule

A working simple solution is better than a perfect unfinished solution.
