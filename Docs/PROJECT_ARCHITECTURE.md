# Project Architecture

## Purpose

This document defines how Personal Brand OS is built.

It exists to keep both humans and AI agents building the project in a consistent way.

The objective is simple:

Build an operating system—not a collection of pages.

---

# Architecture Philosophy

PB.OS is composed of independent modules.

Each module solves one problem.

Together they create one connected operating system.

Every module should be able to:

- work independently
- communicate with other modules
- share data through Supabase
- reuse common UI components

The project should never become a giant monolith.

---

# Tech Stack

Frontend

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS

Backend

- Supabase
    - Database
    - Authentication
    - Storage
    - Realtime (future)

Deployment

- Vercel

Version Control

- Git
- GitHub

---

# Core Architecture

PB.OS has four layers.

## Layer 1 — UI

Everything the user sees.

Examples

- Sidebar
- Cards
- Tables
- Buttons
- Analytics widgets
- Charts

Rule

UI never talks directly to databases unless required.

---

## Layer 2 — Features

Business logic.

Examples

- Idea Vault
- Analytics
- Scheduler
- Inspiration Library

Each feature owns its own components and logic.

---

## Layer 3 — Integrations

Everything that connects PB.OS to external services.

Examples

- Supabase
- Instagram API
- X API
- YouTube API
- LinkedIn API
- Slack
- Notion

Every external connection belongs here.

---

## Layer 4 — Database

Persistent storage.

Examples

- ideas
- users
- inspirations
- analytics
- settings
- content

The database should be platform-agnostic.

Features should never depend on one specific social platform.

---

# Development Rules

## Rule 1

Build for one user.

Scale for many.

Never sacrifice simplicity today because of imaginary future problems.

---

## Rule 2

Every feature must solve a real problem.

No "cool" features.

No vanity features.

No unnecessary AI.

---

## Rule 3

Build vertically.

Finish one complete workflow before starting another.

Bad:

20 pages that do nothing.

Good:

One page that completely solves one problem.

---

## Rule 4

Reuse components.

If the same UI appears twice, it should probably become a reusable component.

---

## Rule 5

Every new feature must fit one of the product pillars:

- Capture
- Create
- Analyze
- Decide

If it doesn't fit, question why it exists.

---

# Folder Structure

```
app/
components/
lib/
Docs/
public/
```

Future additions

```
features/
hooks/
types/
services/
```

Only add folders when they become necessary.

---

# AI Agent Rules

Before writing code, always read:

1. README.md
2. PRODUCT.md
3. PRODUCT_IDENTITY.md
4. PROJECT_ARCHITECTURE.md
5. ROADMAP.md

Then inspect the existing code.

Never assume.

---

# AI Agents Should

- reuse components
- keep files small
- explain architectural decisions
- preserve existing design language
- prefer simple solutions

---

# AI Agents Must Not

- duplicate components
- create unnecessary abstractions
- rewrite working code
- introduce heavy libraries without reason
- change visual language

---

# Git Workflow

Every meaningful milestone follows the same flow.

Create feature branch

↓

Build

↓

Test locally

↓

Commit

↓

Push

↓

Pull Request

↓

Merge into main

Never develop directly on main.

---

# Golden Rule

PB.OS is an operating system.

Every commit should make the operating system more useful to its primary user.

Not more impressive.