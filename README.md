# nx-banking-module-boundaries-demo

> Companion repository for the article: **"Stop the Spaghetti: Enforcing Module Boundaries in an Nx Monorepo"**

This repository demonstrates how to enforce architectural module boundaries in an Nx monorepo using `@nx/enforce-module-boundaries` ESLint rule — applied to a realistic banking platform workspace.

---

## What This Repo Demonstrates

- ✅ A production-realistic Nx workspace structure for a banking platform
- ✅ Domain isolation using scope tags (`scope:payments`, `scope:loans`, `scope:accounts`, `scope:kyc`, `scope:shared`)
- ✅ Layer enforcement using type tags (`type:app`, `type:lib`, `type:shared`, `type:e2e`)
- ✅ Advanced ESLint constraint operators: wildcards (`*`), negation (`!`), and `notDependOnLibsWithTags`
- ✅ The Facade pattern applied at domain boundaries to create clean public APIs
- ✅ The `index.ts` barrel as a public API contract, with intentional omissions
- ✅ Intentional violation examples with error output (see `VIOLATIONS.md`)

---

## Prerequisites

- Node.js >= 18
- npm >= 9

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_HANDLE/nx-banking-module-boundaries-demo.git
cd nx-banking-module-boundaries-demo

# Install dependencies
npm install

# Run the lint rules — this is the heart of the demo
npm run lint

# Try breaking a rule (see VIOLATIONS.md for examples)
# Add this import to libs/payments/feature-transfer/src/lib/transfer.component.ts:
# import { LoansFacade } from '@banking/loans/data-access';
# Then run: npm run lint
# Watch the boundary rule fail immediately

# View the dependency graph
npm run graph

# Run all tests
npm run test
```

---

## Project Structure

```
nx-banking-module-boundaries-demo/
├── .eslintrc.json                    ← THE BOUNDARY RULES — start here
├── nx.json                           ← Nx workspace configuration
├── tsconfig.base.json                ← Path aliases for all libraries
│
├── apps/
│   ├── banking-portal/               ← Customer-facing Angular app
│   │   └── project.json              ← tags: scope:banking-portal, type:app
│   ├── banking-portal-e2e/           ← Cypress E2E tests
│   │   └── project.json              ← tags: scope:banking-portal, type:e2e
│   ├── admin-dashboard/              ← Internal ops app
│   │   └── project.json              ← tags: scope:admin, type:app
│   └── admin-dashboard-e2e/
│       └── project.json              ← tags: scope:admin, type:e2e
│
└── libs/
    ├── payments/                     ← Payments bounded context
    │   ├── feature-transfer/         ← tags: scope:payments, type:lib
    │   │   └── src/
    │   │       ├── index.ts          ← PUBLIC API (routes + component)
    │   │       └── lib/
    │   │           └── transfer.component.ts  ← Shows ✅ and ❌ imports
    │   ├── feature-transaction-history/  ← tags: scope:payments, type:lib
    │   └── data-access/              ← tags: scope:payments, type:lib
    │       └── src/
    │           ├── index.ts          ← Exports Facade + types ONLY
    │           └── lib/
    │               ├── payments.facade.ts     ← ✅ EXPORTED (public)
    │               ├── payments-api.service.ts← ❌ NOT EXPORTED (private)
    │               └── payments.models.ts
    │
    ├── loans/                        ← Loans bounded context
    │   ├── feature-apply/
    │   ├── feature-repayment/
    │   └── data-access/
    │
    ├── accounts/                     ← Accounts bounded context
    │   ├── feature-dashboard/
    │   ├── feature-settings/
    │   └── data-access/
    │
    ├── kyc/                          ← KYC bounded context (most restricted)
    │   ├── feature-onboarding/       ← Shows notDependOnLibsWithTags violations
    │   └── data-access/
    │
    └── shared/                       ← Cross-cutting, foundation layer
        ├── ui-design-system/         ← tags: scope:shared, type:shared
        ├── ui-forms/                 ← tags: scope:shared, type:shared
        ├── util-formatters/          ← tags: scope:shared, type:shared (with tests!)
        ├── util-validators/          ← tags: scope:shared, type:shared
        └── data-access-http/         ← tags: scope:shared, type:shared
```

---

## The Boundary Rules at a Glance

The root `.eslintrc.json` encodes these architectural decisions:

### Type Constraints

| Library Type | Can Depend On           | Cannot Depend On        |
|-------------|-------------------------|-------------------------|
| `type:app`  | `type:lib`, `type:shared` | `type:app`, `type:e2e` |
| `type:lib`  | `type:lib`, `type:shared` | `type:app`, `type:e2e` |
| `type:shared` | `type:shared` only     | Everything else          |
| `type:e2e`  | `type:shared` only      | Everything else          |

### Scope Constraints

| Domain Scope    | Can Depend On                    | Explicitly Blocked From        |
|----------------|----------------------------------|-------------------------------|
| `scope:payments` | `scope:payments`, `scope:shared` | `scope:loans`, `scope:kyc`   |
| `scope:loans`   | `scope:loans`, `scope:shared`   | `scope:payments`, `scope:kyc` |
| `scope:accounts`| `scope:accounts`, `scope:shared`| —                             |
| `scope:kyc`     | `scope:kyc`, `scope:shared`     | `scope:payments`, `scope:loans`, `scope:accounts` |
| `scope:shared`  | `scope:shared` only             | Everything else               |

### Global Safety Net

```json
{ "sourceTag": "*", "notDependOnLibsWithTags": ["type:e2e"] }
```

This single rule, using the `*` wildcard sourceTag, prevents every project in the
workspace from importing from an E2E project — regardless of any other rule.

---

## Key Files to Read

1. **`.eslintrc.json`** — The boundary rules. This is the architecture encoded as code.
2. **`VIOLATIONS.md`** — Six documented violation examples with ESLint error output and explanations.
3. **`libs/payments/data-access/src/index.ts`** — The Facade pattern + public API contract in action.
4. **`libs/payments/feature-transfer/src/lib/transfer.component.ts`** — Shows ✅ valid imports and ❌ commented-out violations with error messages.
5. **`libs/kyc/feature-onboarding/src/lib/kyc-onboarding.component.ts`** — The most boundary-restricted domain in the workspace.

---

## ESLint Operator Reference

This repo uses three advanced features of `@nx/enforce-module-boundaries`:

### Wildcard (`*`)
Matches any tag. Used in `sourceTag` to create workspace-wide rules.
```json
{ "sourceTag": "*", "notDependOnLibsWithTags": ["type:e2e"] }
```

### Negation (`!`)
Excludes a specific tag from an otherwise permissive rule.
```json
{ "sourceTag": "type:lib", "onlyDependOnLibsWithTags": ["type:lib", "type:shared", "!type:e2e"] }
```

### `notDependOnLibsWithTags`
A pure denylist, complementing the allowlist of `onlyDependOnLibsWithTags`. Can be used alone or combined for defense-in-depth.
```json
{
  "sourceTag": "scope:kyc",
  "onlyDependOnLibsWithTags": ["scope:kyc", "scope:shared"],
  "notDependOnLibsWithTags": ["scope:payments", "scope:loans", "scope:accounts"]
}
```

---

## Related Article

📖 [Stop the Spaghetti: Enforcing Module Boundaries in an Nx Monorepo](https://dev.to)

---

## License

MIT
