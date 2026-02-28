# Boundary Violation Reference

This file documents exactly what happens when the module boundary rules
defined in `.eslintrc.json` are violated. Each example shows the illegal
import, the ESLint error it produces, and the architectural principle it protects.

Run `nx run-many --target=lint --all` to see boundary rules in action.

---

## VIOLATION 1: Cross-Domain Scope Boundary

**File:** `libs/payments/feature-transfer/src/lib/transfer.component.ts`

```typescript
// ❌ payments domain importing from loans domain
import { LoanEligibilityService } from '@banking/loans/data-access';
```

**ESLint Error:**
```
A project tagged with 'scope:payments' can only depend on libs tagged with
'scope:payments' or 'scope:shared'.
Found dependency on 'loans-data-access' which is tagged ['scope:loans', 'type:lib'].
```

**Why this rule exists:**
Payments and loans are separate bounded contexts. A payment transfer should never
need to know about loan eligibility — that coupling would mean the two domains
can no longer evolve independently. If you genuinely need cross-domain communication,
the solution is an orchestrating feature in a shared scope, not a direct import.

---

## VIOLATION 2: Feature Lib Importing from App

**File:** `libs/payments/feature-transfer/src/lib/transfer.component.ts`

```typescript
// ❌ lib importing from app
import { AppConfig } from '@banking/banking-portal';
```

**ESLint Error:**
```
A project tagged with 'type:lib' can only depend on libs tagged with
'type:lib' or 'type:shared'. It cannot depend on 'type:app'.
```

**Why this rule exists:**
Apps depend on libs — never the reverse. An app is a deployment artifact.
If a lib imports from an app, you have a circular dependency waiting to happen
and you've permanently coupled a reusable library to a specific application.
This is one of the most common layering violations in large codebases.

---

## VIOLATION 3: Any Project Importing from E2E

**File:** `libs/shared/util-formatters/src/lib/formatters.ts`

```typescript
// ❌ production code importing test scaffolding
import { MockApiInterceptor } from '@banking/banking-portal-e2e';
```

**ESLint Error:**
```
All projects are forbidden from depending on libs tagged with 'type:e2e'.
This constraint is enforced by the global '*' sourceTag rule.
```

**Why this rule exists:**
E2E projects are test infrastructure. They contain mock interceptors, test
fixtures, page objects, and Cypress helpers. If any of this leaks into production
libraries, you are shipping test code to production users. The global `*` rule
means this constraint cannot be accidentally overridden by any more specific rule.

---

## VIOLATION 4: Shared Lib Importing from a Domain Lib

**File:** `libs/shared/util-formatters/src/lib/formatters.ts`

```typescript
// ❌ shared lib importing from a domain-specific lib
import { PaymentStatus } from '@banking/payments/data-access';
```

**ESLint Error:**
```
A project tagged with 'type:shared' can only depend on libs tagged with
'type:shared'. It cannot depend on libs tagged with 'type:lib'.
```

**Why this rule exists:**
Shared libraries are the foundation layer. They are consumed by all domains.
If a shared lib imports from a domain lib, you've created a circular dependency:
`payments` -> `shared` -> `payments`. More subtly, you've also forced every
other domain that consumes this shared lib to transitively depend on payments,
even if they never use payments functionality.

---

## VIOLATION 5: KYC Domain Importing from Payments (Explicit Denylist)

**File:** `libs/kyc/feature-onboarding/src/lib/kyc-onboarding.component.ts`

```typescript
// ❌ kyc domain importing from payments domain
import { PaymentsFacade } from '@banking/payments/data-access';
```

**ESLint Error:**
```
A project tagged with 'scope:kyc' cannot depend on libs tagged with
'scope:payments'. (notDependOnLibsWithTags constraint)
```

**Why this rule exists:**
KYC (Know Your Customer) is a regulatory compliance domain. It handles identity
verification, anti-money-laundering checks, and sanctions screening. Regulatory
requirements demand strict data segregation between KYC verification data and
payment transaction data. This boundary is not just an architectural preference —
it reflects a real-world compliance obligation encoded as a denylist rule.

---

## VIOLATION 6: Transitive Dependency Bypass

**File:** `libs/payments/feature-transfer/src/lib/transfer.component.ts`

```typescript
// ❌ bypassing the public API by reaching into internals
import { PaymentsApiService } from '@banking/payments/data-access/src/lib/payments-api.service';
```

**ESLint Error:**
```
Imports of lazy-loaded libraries are forbidden. Use '@banking/payments/data-access' instead.
Nx enforces that imports go through the library's public index.ts entry point.
```

**Why this rule exists:**
`PaymentsApiService` is deliberately NOT exported from `libs/payments/data-access/src/index.ts`.
It is a private implementation detail. If you can reach it via a deep path import,
the encapsulation of the public API is meaningless. The `banTransitiveDependencies`
option in the ESLint config prevents this class of violation entirely.

---

## Summary: The Constraint Matrix

| Source → Target          | payments | loans | accounts | kyc  | shared | app  | e2e  |
|--------------------------|----------|-------|----------|------|--------|------|------|
| **type:app**             | ✅       | ✅    | ✅       | ✅   | ✅     | ❌   | ❌   |
| **type:lib (payments)**  | ✅       | ❌    | ⚠️*     | ❌   | ✅     | ❌   | ❌   |
| **type:lib (loans)**     | ❌       | ✅    | ⚠️*     | ❌   | ✅     | ❌   | ❌   |
| **type:lib (kyc)**       | ❌ †     | ❌ †  | ❌ †     | ✅   | ✅     | ❌   | ❌   |
| **type:shared**          | ❌       | ❌    | ❌       | ❌   | ✅     | ❌   | ❌   |
| **type:e2e**             | ❌       | ❌    | ❌       | ❌   | ✅     | ❌   | ❌   |

✅ Allowed  |  ❌ Blocked  |  ⚠️* Allowed by scope rule but verify intent  |  ❌ † Blocked by explicit `notDependOnLibsWithTags`

---

*For the companion blog article explaining all of this in depth, see the article linked in README.md.*
