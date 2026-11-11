# POTKO Restaurant Operations Preview

Standalone React + Vite frontend extracted from the restaurant POS interface and rebranded with the POTKO design system. This repository is a frontend preview and integration reference for connecting the UI to the Podco backend later.

## Run locally

Requirements: Node.js 20.19+ or 22.12+, npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. The root route opens the dashboard. Use the sidebar to navigate. No login, backend, database, or environment configuration is needed for preview mode.

Other commands:

```bash
npm run typecheck
npm run build
npm run preview
```

## Current preview behavior

This build has no network API client, API base URL, auth server, database connection, Vite proxy, or realtime socket. `lib/api.ts` is a local adapter with demo responses. Writes resolve as preview responses and do not persist or mutate fixtures. Printing, payments, exports, notifications, emails, device integrations, and live updates are not production-connected.

The fixtures include dashboard trends, orders, menu items, kitchen tickets, tables, customers, staff, inventory/procurement, deliveries, reservations, attendance, operations equipment/documents, accounting, and reports. These examples are for rendering the interface; they are not operational restaurant records.

## Where the frontend expects data

| Location | Purpose |
| --- | --- |
| `lib/api.ts` | Preview adapter and seed data. Replace this adapter when connecting the backend. |
| `hooks/` | React Query read/write calls, request paths, and cache invalidation. |
| `packages/types/src/` | Shared Zod schemas and DTOs for requests and domain values. |
| Feature page/component files | View-specific response interfaces and fields actually rendered by a page. |
| `router.tsx` | React Router route table generated from the migrated page files. |

For an interface, first inspect the hook that loads the page, then its type in that hook or in `packages/types/src/`. The names and nullability in those types are the frontend contract. Avoid sending fields based only on what happens to appear in one demo card.

## Backend connection overview

The backend can use its existing route names. Map the frontend's current request paths to Podco paths inside one adapter so components remain independent of URL and authentication details.

1. Implement HTTP methods in `lib/api.ts` (`get`, `post`, `patch`, `put`, `delete`, `postForm`, and `upload`). The present implementation is deliberately local only.
2. Set the server origin in a future `.env.local`, for example `VITE_API_BASE_URL=https://api.example.com`. Vite environment variables are public in the browser. Never put database passwords, private API secrets, or signing keys in a `VITE_*` value.
3. Configure backend CORS for the frontend origin. Choose one auth strategy with the backend: secure same-site cookies (`credentials: "include"`) or bearer tokens from a proper session flow. The preview uses `DEMO_USER`; it does not authenticate users.
4. Keep branch scoping consistent. Most restaurant data reads/writes use `branchId`; the preview branch is `potko-demo-branch`. In production, derive branch access from the signed-in user's permissions and validate it on the server. Do not trust an arbitrary branch ID from the browser.
5. Return the response shapes described below. Most list hooks expect a direct array. If the API wraps results as `{ data: [...] }`, unwrap in the adapter or update the relevant hook and component.
6. Preserve React Query keys and invalidation already implemented in the hooks. After a write, either return the updated object or invalidate the appropriate query so the page refreshes.
7. Validate totals, permission checks, stock, tax, and state transitions on the server. Browser totals are for display and preview only.

### Recommended adapter behavior

The API adapter should:

- Join the configured API origin and the path passed by a hook.
- Serialize JSON request bodies and parse JSON responses (handle `204 No Content`).
- Send the selected cookie/token strategy consistently.
- Convert non-2xx responses to `ApiError`, preserving `message`, optional `code`, and optional validation `issues`.
- Keep `postForm` multipart boundaries managed by the browser; do not manually set the multipart `Content-Type` header.
- Return actual file URLs/bytes for uploads and exports only when the backend supports them.
- Avoid returning successful dummy values for real server failures. A real error should reach React Query and the page's error UI.

The existing API types are conceptually:

```ts
api.get<T>(path): Promise<T>
api.post<T>(path, body?): Promise<T>
api.patch<T>(path, body?): Promise<T>
api.put<T>(path, body?): Promise<T>
api.delete<T>(path): Promise<T>
api.postForm<T>(path, form): Promise<T>
api.upload<T>(path, file): Promise<T>
```

### Response and value conventions

- IDs are opaque strings; do not assume they are numeric.
- Timestamps use ISO 8601 with timezone, e.g. `2026-11-11T13:30:00+05:30`. Date-only query values use `YYYY-MM-DD`.
- Money values in entity DTOs are decimal strings, e.g. `"1460.00"`. Aggregate dashboard/report chart values are numbers. Keep currency from restaurant settings (`INR` in demo).
- Enum values are uppercase, e.g. `DINE_IN`, `PREPARING`, `OCCUPIED`, `ASSIGNED`, `PENDING`. Use the Zod enums in `packages/types/src/` as the definitive values.
- Optional one-to-one relations should be `null`; list properties should be arrays, including when empty. Do not omit fields that a view expects to read.
- List endpoints currently return arrays directly except where noted (dashboard summaries, reports, audit pages, gateway catalog, and a few feature-specific aggregate responses).
- The UI uses `branchId` query parameters for branch-owned data. Some user/security endpoints are intentionally global and omit it.
- URL query values may include `from`, `to`, `date`, `tab`, `channel`, `type`, `status`, `search`, `history`, `page`, `pageSize`, or a feature-specific filter. Preserve query values when mapping routes.

## Page-by-page endpoint reference

These are the current frontend paths from the feature hooks. The Podco backend may expose different paths; map them in the adapter. Query parameters are shown where the frontend sends them.

| Area / page | Reads and response shape | Writes and request body |
| --- | --- | --- |
| Session / setup | `GET /auth/me` → `{ user }`; `GET /auth/setup-status` → `{ isSetup }`; `GET /branches` → branch array | `POST /auth/login`, `/auth/register` (DTOs in `packages/types/src/auth.ts`); `POST /auth/logout` |
| Dashboard | `GET /dashboard/summary?branchId=…` → KPI object; `GET /dashboard/trends?branchId=…&days=…` → trend series; `GET /dashboard/preferences` → preference object | `PUT /dashboard/preferences` with dashboard layout/order/hidden-card preferences |
| Orders / POS | `GET /orders/manage?branchId=…&tab=…` (optional `channel`, `type`) → managed-order array; `GET /orders?branchId=…` (optional `tableId`) → open-order array; `GET /orders/:id?branchId=…` → order detail | `POST /orders?branchId=…` create; `POST /orders/:id/items` add lines; `PATCH /orders/:id` edit header; `PATCH /orders/:id/items/:itemId` update quantity; `POST /orders/:id/items/:itemId/remove`; `POST /orders/:id/bill-preview`; `POST /orders/:id/checkout`; accept/reject/cancel/merge/refund/delete-bulk endpoints are in `hooks/use-orders.ts` |
| Payment support | `GET /payment-gateways/active`, `/catalog?country=…`, `/countries`, `/connections`, `/payments`, `/refunds-to-review`; `GET /orders/:id/gateway-payments?branchId=…` | Provider mode/enable/test operations and gateway payment/refund operations are in `hooks/use-payment-gateways.ts`. A real payment provider must validate the callback and payment state server-side. |
| Menu | `GET /menu/categories?branchId=…`, `/menu/stations?branchId=…`, `/menu/items?branchId=…` (optional `categoryId`) → arrays | Category and item create/update; image upload; bulk pricing; combo components. DTOs are in `packages/types/src/menu.ts` and `packages/types/src/combos.ts`; paths are in `hooks/use-menu.ts` and `hooks/use-combos.ts`. |
| Kitchen display | `GET /kds/stations`, `/kds/tickets` (optional `stationId`), `/kds/incoming`, `/kds/progress`, `/kds/performance` → arrays | Move KOT status forward, toggle priority, reject ticket/order, accept/reject incoming online order, and reprint actions. Status/request DTOs are in `packages/types/src/orders.ts`. |
| Tables | `GET /tables/floors?branchId=…` → floors containing tables; `GET /tables/requests?branchId=…` → table request array | Create/rename floor; create single/bulk tables; update table status/layout; generate a QR token; resolve table requests. See `hooks/use-tables.ts`. |
| Reservations / waitlist | `GET /reservations?branchId=…&date=YYYY-MM-DD` → reservation array; `GET /waitlist?branchId=…` → waitlist array | Reservation create/status update; waitlist create/seat. DTOs in `packages/types/src/reservations.ts` and `hooks/use-waitlist.ts`. |
| Customers / rewards | `GET /customers?branchId=…` (optional `search`) → customer array; `GET /customers/:id` → customer detail; `/customers/:id/addresses` → address array; `/customers/:id/rewards` → reward summary | Create/update customer; add/update address; customer schema in `packages/types/src/customers.ts`. |
| Inventory | `GET /inventory/ingredients`, `/ingredients/low-stock`, `/tracking-status`, `/suppliers`, `/purchase-orders`, `/waste`, `/goods-receipts`, `/purchase-requests`, `/quotations`, `/supplier-invoices`, `/transfers` (all branch-scoped) | Ingredient create/update/adjust; supplier create/update; PO create/status; GRN receive; waste log; purchase request and quotation create/status; invoice create/payment; recipe and stock tracking updates; transfer. DTOs in `packages/types/src/inventory.ts`, hooks in `hooks/use-inventory.ts`. |
| Team and roles | `GET /users`, `/users/roles`, `/users/departments`, `/roles` → arrays | Create/update/disable users, departments, role permission sets, and user permission overrides. DTOs in `packages/types/src/staff.ts`, `roles.ts`, and `permissions.ts`. |
| Attendance and HR | `GET /attendance/me` → record or `null`; `GET /attendance?branchId=…&date=…` → attendance array; `/hr/shifts`, `/hr/leave`, `/hr/leave/mine`, `/hr/pay`, `/hr/payroll`, `/hr/performance` → arrays; payroll detail/slip paths → objects | Clock in/out; create/delete shifts; request/approve/reject leave; set pay rate; create/finalize/pay/delete payroll run; adjust payroll line. See `hooks/use-attendance.ts`, `hooks/use-hr.ts`, and `packages/types/src/hr.ts`. |
| Delivery and rider | `GET /delivery?branchId=…&history=…`, `/delivery/drivers`, `/delivery/zones` → arrays; `/rider/me` → rider profile; `/rider/deliveries` → `{ active, done }` | Assign driver; advance delivery status; manage zones; rider duty/location/status operations. See `hooks/use-delivery.ts` and `hooks/use-rider.ts`. |
| Operations | `GET /operations/equipment`, `/operations/documents` → arrays; `/operations/documents/:id` → document detail | Create/retire equipment, log service, create/update/delete document, upload document files. Feature types are in `hooks/use-marketing.ts` and `components/operations/`. |
| Marketing | `GET /marketing/coupons`, `/promotions`, `/campaigns` → arrays; `/campaigns/:id/audience` → `{ count }` | Create/activate/deactivate/delete coupons/promotions/campaigns; send campaign. See `hooks/use-marketing.ts`. |
| Reports | `GET /reports` → `[{ key, title, group }]`; `GET /reports/:key?branchId=…&from=…&to=…` → `{ key, title, columns, rows }`; `GET /report-schedules?branchId=…` → `{ emailConfigured, schedules }` | Create/pause/resume/delete/send report schedule. Export links are currently preview placeholders and need real file endpoints. |
| Accounting | `GET /accounting/expenses`, `/closing`, `/closing/preview`, `/profit-loss`, `/gst`, `/branches`; balance sheet/budget/bank paths are in `components/accounting/finance-tabs.tsx` | Add/delete expense; close day; budgets and bank import/matching actions are in finance tabs. Response interfaces are in `hooks/use-accounting.ts` and `components/accounting/finance-tabs.tsx`. |
| Settings and integrations | `GET /settings`, `/settings/display`; exact auxiliary routes below. | Settings updates, backup/restore, key create/rotate, webhook create/toggle/test, integration enable/test, sync settings/run, 2FA setup/enable/disable, update apply, Verifactu settings/certificate/send. Enable only when the backend services exist. |
| Public order / kiosk | Public menu uses `GET /public/menu/:qrToken` and `/status`; kiosk/order pages use the public token routes in `app/order/[qrToken]/page.tsx` and `lib/kiosk-api.ts` | Public table request/order actions use the QR token. Enforce token scope, throttling, item availability, and server-side order pricing. |
| Imports / downloads / printing | Imports use `/imports/:kind/:step`; downloads use `/downloads/stats`; print diagnostics/jobs are under `/orders/print/*` | Multipart import and image/file uploads; print job/test/drawer operations. These are preview-only currently. |

For the exact request path and query string, search for `api.get`, `api.post`, `api.patch`, `api.put`, or `api.delete` in the listed hook/component. Feature-specific filters should be passed through unchanged.

### Additional admin and service routes

| Feature | Reads | Writes |
| --- | --- | --- |
| Notifications | `GET /notifications?pageSize=20` → `{ data, total, unreadCount, page, pageSize, totalPages }` | `PATCH /notifications/:id/read`; `PATCH /notifications/read-all` |
| Audit trail | `GET /audit-logs?entity=…&action=…&userId=…&from=…&to=…&page=…&pageSize=…` → `{ data, total, page, pageSize, totalPages }`; `GET /audit-logs/entities` → string array | Writes are created by backend actions; this UI only reads them. Include actor and entity snapshots as expected by `hooks/use-audit-log.ts`. |
| Backup | `GET /backups/status` → backup configuration/status object; `GET /backups` → backup array | `POST /backups/config`; `DELETE /backups/config`; `POST /backups` to start; `POST /backups/:id/restore` with restore confirmation DTO |
| Staff API keys | `GET /staff-api-keys` → key metadata array | `POST /staff-api-keys` with `CreateStaffApiKeyDto`; never return the secret again after creation |
| Integration API keys | `GET /integration-api-keys` → key metadata array | `POST /integration-api-keys`; `POST /integration-api-keys/:id/rotate`; expose the new secret once only |
| Webhooks | `GET /webhooks` → webhook array; `GET /webhooks/events` → event-name array; `GET /webhooks/:id/deliveries` → delivery history | `POST /webhooks`; `PATCH /webhooks/:id/active` with `{ isActive }`; `POST /webhooks/:id/test` |
| Integration hub | `GET /integration-hub` → provider array; `GET /integration-hub/:provider/logs` → log array | `POST /integration-hub/:provider/test`; `POST /integration-hub/:provider/enabled` with `{ enabled }` |
| Sync | `GET /sync/status` → sync status | `POST /sync/test` with connection settings; `PUT /sync/settings`; `POST /sync/run`; `POST /sync/disable` |
| Two-factor auth | `GET /auth/2fa/status` → `{ enabled, recoveryCodesLeft }` | `POST /auth/2fa/setup`; `/enable` with `{ code }`; `/disable` with `{ password, code }`; `/reset/:userId` for manager reset |
| Updates | `GET /system/update/check` → current/latest version and availability | `POST /system/update/apply` (disabled in preview) |
| Fiscal reporting | `GET /verifactu/settings?branchId=…`; `GET /verifactu/records?branchId=…&take=50` → `{ items, total }` | `PUT /verifactu/settings`; `POST /verifactu/certificate` (multipart); `POST /verifactu/send`; `GET /verifactu/verify` |
| Print | `GET /orders/print/diagnostics?branchId=…` → diagnostics object | `POST /orders/print/test`, `/jobs`, `/kot`, `/drawer` (preview-only until a print service is connected) |
| Import / downloads | `GET /downloads/stats` → download stats array | `POST /imports/:kind/:step` as multipart form data; upload endpoints return a URL/metadata object |

## Data shapes and examples

### Dashboard summary

The dashboard expects a summary object (not a list):

```json
{
  "todayRevenue": 28450,
  "todayOrders": 86,
  "channels": { "online": 24, "offline": 62 },
  "tables": { "available": 8, "occupied": 12, "reserved": 3, "cleaning": 1, "outOfService": 0 },
  "kitchenQueue": { "new": 3, "accepted": 4, "preparing": 6, "ready": 2 },
  "pendingPayments": { "count": 2, "balance": 1840 },
  "lowStock": 4,
  "customers": 1284,
  "employees": 18,
  "unpaidPayrollRuns": 0,
  "recentOrders": []
}
```

Trend response has two date series; each date is `YYYY-MM-DD` and chart values are numeric:

```json
{
  "revenue": [{ "date": "2026-11-11", "amount": 28450 }],
  "waste": [{ "date": "2026-11-11", "cost": 690 }]
}
```

### Menu read record and menu write body

GET item records include nested category, station, and modifier groups so the UI can render labels and choices. Example read record:

```json
{
  "id": "item-3",
  "categoryId": "cat-mains",
  "stationId": "station-hot",
  "name": "Butter Chicken",
  "imageUrl": null,
  "price": "520.00",
  "halfPrice": "290.00",
  "taxRatePercent": "5.00",
  "isVeg": false,
  "isActive": true,
  "isCombo": false,
  "category": { "id": "cat-mains", "name": "Mains" },
  "station": { "id": "station-hot", "name": "Hot Kitchen" },
  "modifierGroups": []
}
```

The `MenuItemDto` write fields are defined in `packages/types/src/menu.ts`: `categoryId`, optional `stationId`, `name`, optional `sku`/`description`/`imageUrl`, numeric `price`, optional `halfPrice`, `taxRatePercent`, optional `costPrice`/`prepTimeMinutes`/`calories`, diet/allergen/spice flags, availability times, `isActive`, and `modifierGroupIds`. `price` sent in a create/update DTO is numeric; returned entity prices are decimal strings.

### Create order and checkout

The order create schema is in `packages/types/src/orders.ts`. The DTO includes `type`, `items`, and optional table/customer/guest/delivery/notes fields. An item has menu item ID, integer quantity, optional selected modifier IDs, and kitchen note (check the exact schema before sending):

```json
{
  "type": "DINE_IN",
  "tableId": "table-3",
  "customerId": "cust-101",
  "guestCount": 2,
  "notes": "No onion",
  "items": [
    { "menuItemId": "item-3", "quantity": 1, "kitchenNote": "Mild" },
    { "menuItemId": "item-5", "quantity": 1 }
  ]
}
```

Checkout posts to `/orders/:id/checkout?branchId=…`. Its body supports discount/tip/loyalty/coupon fields, `customerId`, optional gift card code, `payments` (`method`, numeric `amount`, optional numeric cash `tendered`, optional `reference`), optional `allowPartial`, and optional idempotency `requestId`. Response returns the order totals and settlement (`amountDue`, `amountPaid`, `balanceDue`, `changeDue`, `fullyPaid`). The server must calculate authoritative prices, taxes, discounts, and change; never trust client totals.

### Customer

`CustomerDto` fields in `packages/types/src/customers.ts` are optional: `name`, `phone`, `email`, `address`, `birthday`, `anniversary`, `allergies`, `notes`, and `marketingOptOut`. A customer read record additionally includes `id`, loyalty points, wallet balance, and `createdAt`. The detail record adds `addresses`, order history, and gift cards. Address rows use `line1` plus optional street/landmark/city/state/pincode/instructions and `isDefault`.

### Inventory

Ingredient reads return `id`, `name`, `sku` (nullable), `unit`, `reorderLevel`, `currentStock`, `costPerUnit`, and `isActive`. Units are `KG`, `G`, `L`, `ML`, `PIECE`, `DOZEN`, `PACK`, or `BOX`. `IngredientDto` writes `name`, optional `sku`, `unit`, numeric `reorderLevel`, and optional `isActive`; server-managed current stock and cost are not create fields in that schema. Stock adjustment body is `{ "quantity": -0.5, "note": "Spoiled product" }`; negative removes stock, positive adds it. Recipe writes use `{ "lines": [{ "ingredientId": "ing-1", "quantity": 0.18 }] }`.

### Attendance

Attendance records contain `id`, `branchId`, `userId`, nested `user: { id, name }`, `clockInAt`, nullable `clockOutAt`, and nullable `note`. `GET /attendance/me` returns one record or `null`; date-filtered attendance returns an array. Clock in posts `{ "branchId": "…" }`; clock out posts an empty JSON body. In production, bind the acting user from the authenticated session rather than accepting a user ID from the browser.

### Tables, KDS, delivery

- Floor reads return `{ id, name, sortOrder, tables }`; table records have `floorId`, `number`, nullable `name`, `capacity`, uppercase `status`, layout (`posX`, `posY`, `width`, `height`, `rotation`, `shape`), nullable QR token, and nullable assigned waiter.
- KOT reads contain ticket/order/station metadata and ticket `items`; each item includes an `orderItem` snapshot (`nameSnapshot`, `quantity`, `kitchenNote`, `modifiers`). A KOT status write is `{ "status": "PREPARING" }` and should only allow legal forward transitions.
- Delivery rows include order number/amount, address and contact snapshot, delivery status/ETA, driver, and delivery zone. Assign a driver with `{ "driverId": "driver-1" }`; status update body is `{ "status": "PICKED_UP" }`.

### Reports

Report catalog records are `{ key, title, group }`. A report result is `{ key, title, columns: string[], rows: (string | number | null)[][] }`. Every row must align with the column count. Report schedules use `{ emailConfigured, schedules }`; a schedule has `reportKey`, `frequency` (`DAILY`/`WEEKLY`/`MONTHLY`), `format`, `recipients`, `isActive`, and nullable `lastSentAt`/`lastError`.

## Status values and DTO authority

The domain schemas under `packages/types/src/` include the allowed enums, validation limits, defaults, and optional fields. Start with `orders.ts`, `menu.ts`, `tables.ts`, `reservations.ts`, `inventory.ts`, `customers.ts`, `staff.ts`, `roles.ts`, `hr.ts`, `accounting.ts`, and `integrations.ts`. The hook interfaces describe the response records; the Zod DTO schemas describe write bodies. Keep these separate: read entities often add IDs, nested relations, computed totals, and status fields that should not be sent back on create.

Common status examples include:

- Orders: `PENDING`, `ACCEPTED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED` (use order lifecycle enums for the exact workflow).
- KOT: `NEW`, `ACCEPTED`, `PREPARING`, `READY`, `SERVED`, plus the explicit rejection flow.
- Tables: `AVAILABLE`, `OCCUPIED`, `RESERVED`, `CLEANING`, `OUT_OF_SERVICE`.
- Purchase order: `DRAFT`, `SENT`, `PARTIALLY_RECEIVED`, `RECEIVED`, `CANCELLED`.
- Attendance/leave/payroll/delivery and integration enums are defined in their feature type files; do not rely on display labels as enum values.

## Troubleshooting integration

| Symptom | Check |
| --- | --- |
| List is blank | The hook expects a JSON array, not a paginated object or `{ data: [...] }`, unless that hook explicitly declares an envelope. Check branch ID and filters. |
| Page reports a runtime error | Compare every property read in the page with the returned JSON. Object endpoints must return their object shape even when there are no records (`{ problems: [], schedules: [] }`), not `[]` or `null`. |
| Mutation appears to do nothing | Preview mode never persists. In backend mode, confirm the write endpoint returns success and that its hook invalidates/refetches the corresponding React Query key. |
| Browser blocks API request | Configure backend CORS and matching cookie settings for the Vite origin; inspect the browser network/console response. |
| Monetary display is wrong | Keep API money fields as decimal strings and configure the restaurant currency/timezone; avoid converting cents to floats in UI code. |

## Notes

This is a UI preview, not a production POS. Connecting a backend requires real persistence, authentication, server-side authorization, validation, idempotent payment handling, branch isolation, service integrations, and deployment configuration. The original upstream repository is not modified by this extracted app.
