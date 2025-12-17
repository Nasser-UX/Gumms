# GUMMS — Government User Manual Management System (PoC)

**Stack:** Vite + React + TypeScript + Tailwind CSS + shadcn/ui

## Setup

Install dependencies:
```bash
yarn install
```

Run dev server:
```bash
yarn dev
```

Build for production:
```bash
yarn build
```

## Features (PoC)
- Bilingual UI (Arabic RTL + English LTR)
- Role-based navigation (Admin/Editor/Reviewer/Viewer)
- shadcn/ui components (Button, Card, Input, Badge, Dropdown, Separator)
- Main dashboard with KPI cards and quick actions

## Next Steps
- Add routing (react-router-dom)
- Create Services / Manuals / Review / Search pages
- Connect to backend API
- Implement auth + RBAC