# POTKO Restaurant Operations Preview

Standalone React + Vite frontend extracted from the restaurant POS interface and branded with the POTKO palette and supplied logo. The app is intended to preview manager, waiter, and kitchen workflows while the Podco backend is developed or integrated separately.

## Run locally

Requirements: Node.js 20.19+ or 22.12+, npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). `/` opens the dashboard. Use the sidebar to navigate; no account or server is needed. Other useful commands are `npm run build` and `npm run preview`.

## Preview mode and demo content

This build is intentionally frontend-only. It has no API base URL, auth server, database, backend package, Vite proxy, network fetch, or realtime socket. `lib/api.ts` provides local API-shaped responses and a seeded demo profile. Mutations return preview responses; they do not persist data or change the seeded fixtures. Printing, payment processing, live updates, and external integrations are preview-only.

Seed data is defined alongside the local adapter in `lib/api.ts`. It includes dashboard KPIs and 14-day charts, orders in pending/preparing/ready states, menu categories and products, kitchen stations and KOT tickets, customer profiles, staff roles/departments, table floors and statuses, delivery drivers/zones, reservations, and low-stock ingredients. The records deliberately use plausible POTKO Central Kitchen examples and INR values so lists, cards, badges, and empty/detail states can be reviewed.

## Frontend structure

- `main.tsx`, `App.tsx`: Vite entry and React Router setup.
- `components/layout/`: responsive operations shell, navigation, and POTKO logo usage.
- `app/`: migrated page modules and route groupings.
- `hooks/`: feature queries and mutations, kept close to the original domain structure.
- `lib/api.ts`: current local data adapter and demo fixture records. This is the seam to replace for backend connectivity.
- `packages/types/src/`: shared DTO and domain type definitions used by the UI.
- `public/potko-icon.jpeg`: supplied bowl/check icon used on the interface; the lockup is represented as editable text so the JPEG background is never placed behind the logo.

## Connecting the Podco backend later

Keep the pages and feature hooks calling the `api` adapter. Replace the implementation in `lib/api.ts` with an HTTP client that sends requests to the Podco API, and replace its fixtures with the returned DTOs. Configure the backend origin in one place (for example `VITE_API_BASE_URL`) and set CORS on the backend for the Vite origin. Do not put secrets in `VITE_*` variables; they are public browser values. Decide with the backend whether the deployment uses secure same-site cookies or bearer tokens, then implement the matching session strategy in the adapter and auth flow. This preview currently uses `DEMO_USER`; it does not authenticate.

When wiring real data:

1. Preserve each hook's query key and response shape, or update the corresponding hook and its consumers together.
2. Pass the active `branchId` on branch-scoped requests. It is currently `potko-demo-branch` from `hooks/use-branch.tsx`.
3. Return JSON with the fields consumed by the frontend. The DTOs in `packages/types/src/` and interfaces next to each hook are the source of truth; avoid inventing a second set of names.
4. Replace no-op `useRealtime`/sound/printing behavior with the appropriate Podco integrations only when those services are available.
5. Invalidate/refetch the same React Query keys after writes, or return updated records and update the cache. The existing hooks already encode most invalidation relationships.
6. Provide actual file URLs for uploads/exports and real error responses before enabling those UI actions.

### Data conventions

- IDs are opaque strings. Include the branch ID for branch-owned resources.
- Timestamps are ISO 8601 strings with timezone, such as `2026-11-11T13:30:00+05:30`; dates without time use `YYYY-MM-DD`.
- Monetary DTO fields are decimal strings (for example `"1460.00"`) to avoid floating-point loss. Dashboard chart aggregates are numeric values. Currency and timezone come from restaurant settings (`INR`, `Asia/Kolkata` in the preview).
- Statuses are uppercase enum values, such as order `PREPARING`, KOT `READY`, table `OCCUPIED`, and delivery `ASSIGNED`. Use the enums in `packages/types/src/`.
- Optional relationships should be `null`; collections should be arrays (empty when no rows exist). The current hooks generally expect direct arrays for list endpoints, not a `{ data: [...] }` envelope.

### Feature endpoint and payload map

The current hook paths show the contract the adapter expects. The Podco server can use different URLs, but map them in the adapter rather than scattering URL changes across components.

| UI area | Read paths used by hooks | Representative write payload |
| --- | --- | --- |
| Dashboard | `GET /dashboard/summary`, `/dashboard/trends`, `/dashboard/preferences` | preference object, e.g. `{ "trendDays": 14, "hidden": [] }` |
| Orders / POS | `GET /orders/manage?branchId=…&tab=pending`, `/orders?branchId=…`, `/orders/:id` | create order with `type`, optional `tableId`/`customerId`, `items: [{ menuItemId, quantity, modifiers?, kitchenNote? }]`; checkout with payment method and amount |
| Menu | `GET /menu/categories`, `/menu/stations`, `/menu/items` | category `{ name, sortOrder, isActive }`; item `{ name, categoryId, stationId, price, taxRatePercent, isVeg, isActive }` |
| Kitchen | `GET /kds/stations`, `/kds/tickets` | status update `{ status: "PREPARING" }`; priority update `{ isPriority: true }` |
| Tables | `GET /tables/floors` | floor `{ name }`; table includes `number`, `capacity`, `shape`, layout coordinates and status |
| Customers | `GET /customers`, `/customers/:id` | `{ name, phone, email, address, allergies, notes }` |
| Team | `GET /users`, `/users/roles`, `/users/departments` | staff create/update uses name, contact, role/department IDs and active state |
| Reservations | `GET /reservations?branchId=…&date=YYYY-MM-DD` | `{ customerName, phone, guestCount, reservedAt, durationMinutes, tableId, specialRequests }` |
| Delivery | `GET /delivery`, `/delivery/drivers`, `/delivery/zones` | assignment `{ driverId }`; status `{ status: "PICKED_UP" }`; zone `{ name, fee, minOrderAmount, etaMinutes, pincodes, isActive }` |
| Inventory | `GET /inventory/ingredients`, `/inventory/ingredients/low-stock` | ingredient fields include name, unit, current/min stock and cost per unit; stock changes should include quantity and reason |

Paths and full field definitions can be found by searching `api.get`, `api.post`, `api.patch`, and `api.put` in `hooks/`, then following the associated interface or DTO import. Core order/menu/customer/staff/table types live in `packages/types/src/`; view-specific response interfaces live next to their hooks.

### Example JSON records

List endpoints such as `/menu/items` return a JSON array directly:

```json
[
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
]
```

An order create body follows `CreateOrderDto` in `packages/types/src/orders.ts`. A representative shape is:

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

Treat the TypeScript DTO as authoritative if a backend endpoint requires additional fields, such as modifier IDs or payment metadata. Never calculate final totals only in the browser: the server should validate prices, discounts, taxes, stock, and permissions and return the authoritative order totals.

## Notes

This is a UI preview, not a production POS. Demo buttons may acknowledge an action without saving it. A backend integration will need real persistence, validation, error handling, access control, branch scoping, and deployment configuration. The original repository source is not modified by this extracted app.
