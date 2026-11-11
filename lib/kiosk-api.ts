import type { KioskServiceType } from "@nodedr-restaurant/types";
export interface KioskModifier { id: string; name: string; priceAdjustment: string; isDefault: boolean }
export interface KioskModifierGroup { id: string; name: string; minSelect: number; maxSelect: number; isRequired: boolean; modifiers: KioskModifier[] }
export interface KioskMenuItem { id: string; name: string; description: string | null; imageUrl: string | null; price: string; taxRatePercent: string; isVeg: boolean; modifierGroups: { modifierGroup: KioskModifierGroup }[] }
export interface KioskMenuCategory { id: string; name: string; items: KioskMenuItem[] }
export interface KioskMenu { restaurantName: string; branchName: string; logoUrl: string | null; currency: string; country: string; taxMode: "INCLUSIVE" | "EXCLUSIVE"; taxLabel: string; services: { dineIn: boolean; takeaway: boolean }; categories: KioskMenuCategory[] }
export interface KioskOrderResult { orderNumber: string; createdAt: string; currency: string; items: { name: string; quantity: number; lineTotal: string }[]; subtotal: string; taxAmount: string; totalAmount: string; paid: false }
export type KioskErrorKind = "network" | "server" | "rate" | "notFound" | "unavailable" | "rejected";
export class KioskApiError extends Error { constructor(public kind: KioskErrorKind, message: string, public unavailableItemIds: string[] = []) { super(message); } }

const kioskMenu: KioskMenu = {
  restaurantName: "POTKO Kitchen", branchName: "Central Kitchen", logoUrl: null, currency: "INR", country: "IN", taxMode: "INCLUSIVE", taxLabel: "GST", services: { dineIn: true, takeaway: true },
  categories: [{ id: "demo-popular", name: "Popular", items: [
    { id: "demo-paneer", name: "Paneer Tikka Bowl", description: "Smoky paneer, greens and mint yogurt", imageUrl: null, price: "320.00", taxRatePercent: "5", isVeg: true, modifierGroups: [] },
    { id: "demo-dosa", name: "Masala Dosa", description: "Crisp rice crepe with potato masala", imageUrl: null, price: "240.00", taxRatePercent: "5", isVeg: true, modifierGroups: [] },
  ] }],
};

export const kioskApi = {
  menu: async (_token: string) => kioskMenu,
  order: async (_token: string, body: { requestId: string; serviceType: KioskServiceType; items: { menuItemId: string; quantity: number; modifierIds: string[] }[] }): Promise<KioskOrderResult> => ({
    orderNumber: "DEMO-001", createdAt: new Date().toISOString(), currency: "INR", items: body.items.map((item) => ({ name: kioskMenu.categories[0].items.find((row) => row.id === item.menuItemId)?.name ?? "Demo item", quantity: item.quantity, lineTotal: "320.00" })), subtotal: "320.00", taxAmount: "16.00", totalAmount: "336.00", paid: false,
  }),
};
