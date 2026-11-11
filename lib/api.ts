import { PERMISSIONS, type SessionUser } from "@nodedr-restaurant/types";

export class ApiError extends Error {
  status = 0;
  code?: string;
  issues?: unknown;
  constructor(message: string) { super(message); }
}

export const DEMO_USER: SessionUser = {
  id: "potko-demo-admin",
  restaurantId: "potko-demo-restaurant",
  name: "Alex Morgan",
  roleId: "potko-demo-manager",
  roleName: "Manager · Demo",
  permissions: PERMISSIONS.map(({ key }) => key),
};

const branch = { id: "potko-demo-branch", name: "POTKO · Central Kitchen" };
const restaurant = {
  id: "potko-demo-restaurant", name: "POTKO Kitchen", legalName: "POTKO Kitchen",
  logoUrl: null, currency: "INR", timezone: "Asia/Kolkata", upiVpa: null, upiPayeeName: null,
  loyaltyPointValue: "1", loyaltyEarnPerCurrency: 1, referralEnabled: false,
  referralSharerPoints: 0, referralReferredPoints: 0, referralMinPurchase: "0",
  onlineMinOrderAmount: "0", onlinePriceAdjustKind: "PERCENT", onlinePriceAdjustValue: "0",
  maxManualDiscountPercent: "20", requireDiscountReason: false,
};
const branchSettings = {
  id: branch.id, name: branch.name, address: "14 Market Street", phone: "+91 98765 43210",
  gstNumber: null, country: "IN", taxRegime: "GST", taxMode: "EXCLUSIVE", taxLabel: "GST",
  taxId: null, autoConfirmOrders: false, autoConfirmReservations: false, kioskToken: null,
  kioskDineInEnabled: true, kioskTakeawayEnabled: true, printerPaperWidthMm: 80,
  printerCodepage: "CP437", printerColumns: null, printerConnection: "NETWORK",
  printerHost: null, printerPort: 9100,
};
const summary = {
  todayRevenue: 28450, todayOrders: 86, channels: { online: 24, offline: 62 },
  tables: { available: 8, occupied: 12, reserved: 3, cleaning: 1, outOfService: 0 },
  kitchenQueue: { new: 3, accepted: 4, preparing: 6, ready: 2 },
  pendingPayments: { count: 2, balance: 1840 }, lowStock: 4, customers: 1284,
  employees: 18, unpaidPayrollRuns: 0,
  recentOrders: [
    { id: "demo-1042", orderNumber: "ORD-1042", type: "DINE_IN", totalAmount: "1460.00", billedAt: new Date().toISOString() },
    { id: "demo-1041", orderNumber: "ORD-1041", type: "TAKEAWAY", totalAmount: "780.00", billedAt: new Date(Date.now()-12*60000).toISOString() },
    { id: "demo-1040", orderNumber: "ORD-1040", type: "QR_ORDER", totalAmount: "2120.00", billedAt: new Date(Date.now()-26*60000).toISOString() },
  ],
};
const preferences = { topOrder: ["kpis","attention","charts"], cardOrder: ["tables","kitchen","recent","channels"], hidden: [], trendDays: 14 };
const trends = {
  revenue: Array.from({length:14},(_,i)=>({date:new Date(Date.now()-(13-i)*86400000).toISOString().slice(0,10),amount:12000+Math.round(9000+Math.sin(i*0.8)*6500)})),
  waste: Array.from({length:14},(_,i)=>({date:new Date(Date.now()-(13-i)*86400000).toISOString().slice(0,10),cost:450+Math.round(300+Math.sin(i*1.4)*180)})),
};

// Stable, representative records keep every major workspace populated in preview mode.
const demoCustomer = (id: string, name: string, phone: string, points: number) => ({
  id, name, phone, email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`, address: "14 Market Street, Bengaluru",
  birthday: null, anniversary: null, allergies: null, notes: "Prefers digital receipts", marketingOptOut: false,
  loyaltyPoints: points, walletBalance: "250.00", createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
});
const customers = [demoCustomer("cust-101", "Priya Sharma", "+91 98765 10001", 420), demoCustomer("cust-102", "Arjun Mehta", "+91 98765 10002", 180), demoCustomer("cust-103", "Maya Iyer", "+91 98765 10003", 760), demoCustomer("cust-104", "Kabir Rao", "+91 98765 10004", 95)];
const menuCategories = [
  { id: "cat-starters", name: "Starters", sortOrder: 1, isActive: true, showOnWebsite: true, _count: { items: 3 } },
  { id: "cat-mains", name: "Mains", sortOrder: 2, isActive: true, showOnWebsite: true, _count: { items: 4 } },
  { id: "cat-drinks", name: "Drinks", sortOrder: 3, isActive: true, showOnWebsite: true, _count: { items: 2 } },
];
const stations = [{ id: "station-hot", name: "Hot Kitchen" }, { id: "station-cold", name: "Cold Prep" }, { id: "station-bar", name: "Beverage Bar" }];
const menuItems = [
  { id: "item-1", categoryId: "cat-starters", stationId: "station-hot", name: "Crispy Corn", imageUrl: null, price: "280.00", halfPrice: null, taxRatePercent: "5.00", isVeg: true, isActive: true, isCombo: false, category: { id: "cat-starters", name: "Starters" }, station: stations[0], modifierGroups: [] },
  { id: "item-2", categoryId: "cat-starters", stationId: "station-hot", name: "Paneer Tikka", imageUrl: null, price: "360.00", halfPrice: null, taxRatePercent: "5.00", isVeg: true, isActive: true, isCombo: false, category: { id: "cat-starters", name: "Starters" }, station: stations[0], modifierGroups: [] },
  { id: "item-3", categoryId: "cat-mains", stationId: "station-hot", name: "Butter Chicken", imageUrl: null, price: "520.00", halfPrice: "290.00", taxRatePercent: "5.00", isVeg: false, isActive: true, isCombo: false, category: { id: "cat-mains", name: "Mains" }, station: stations[0], modifierGroups: [] },
  { id: "item-4", categoryId: "cat-mains", stationId: "station-hot", name: "Paneer Lababdar", imageUrl: null, price: "440.00", halfPrice: null, taxRatePercent: "5.00", isVeg: true, isActive: true, isCombo: false, category: { id: "cat-mains", name: "Mains" }, station: stations[0], modifierGroups: [] },
  { id: "item-5", categoryId: "cat-mains", stationId: "station-hot", name: "Jeera Rice", imageUrl: null, price: "190.00", halfPrice: null, taxRatePercent: "5.00", isVeg: true, isActive: true, isCombo: false, category: { id: "cat-mains", name: "Mains" }, station: stations[0], modifierGroups: [] },
  { id: "item-6", categoryId: "cat-drinks", stationId: "station-bar", name: "Mango Lassi", imageUrl: null, price: "160.00", halfPrice: null, taxRatePercent: "5.00", isVeg: true, isActive: true, isCombo: false, category: { id: "cat-drinks", name: "Drinks" }, station: stations[2], modifierGroups: [] },
];
const orderRows = [
  { id: "ord-1042", orderNumber: "ORD-1042", type: "DINE_IN", status: "PREPARING", channel: "STAFF" as const, acceptance: "NOT_REQUIRED" as const, guestName: null, deliveryAddress: null, totalAmount: "1460.00", createdAt: new Date(Date.now()-8*60000).toISOString(), table: { id: "table-3", name: "Window", number: 3 }, customer: customers[0], items: [{ id:"oi-1",nameSnapshot:"Paneer Tikka",quantity:2 },{id:"oi-2",nameSnapshot:"Mango Lassi",quantity:1}] },
  { id: "ord-1041", orderNumber: "ORD-1041", type: "TAKEAWAY", status: "PENDING", channel: "ONLINE" as const, acceptance: "PENDING" as const, guestName: "Arjun Mehta", deliveryAddress: null, totalAmount: "780.00", createdAt: new Date(Date.now()-12*60000).toISOString(), table: null, customer: customers[1], items: [{id:"oi-3",nameSnapshot:"Butter Chicken",quantity:1},{id:"oi-4",nameSnapshot:"Jeera Rice",quantity:1}] },
  { id: "ord-1040", orderNumber: "ORD-1040", type: "DELIVERY", status: "READY", channel: "ONLINE" as const, acceptance: "ACCEPTED" as const, guestName: "Maya Iyer", deliveryAddress: "22 Lake Road, Bengaluru", totalAmount: "2120.00", createdAt: new Date(Date.now()-26*60000).toISOString(), table: null, customer: customers[2], items: [{id:"oi-5",nameSnapshot:"Paneer Lababdar",quantity:2},{id:"oi-6",nameSnapshot:"Crispy Corn",quantity:1}] },
  { id: "ord-1039", orderNumber: "ORD-1039", type: "DINE_IN", status: "COMPLETED", channel: "STAFF" as const, acceptance: "NOT_REQUIRED" as const, guestName: null, deliveryAddress: null, totalAmount: "940.00", createdAt: new Date(Date.now()-75*60000).toISOString(), table: { id:"table-5", name:null, number:5 }, customer: customers[3], items: [{id:"oi-7",nameSnapshot:"Crispy Corn",quantity:1},{id:"oi-8",nameSnapshot:"Jeera Rice",quantity:2}] },
];
const floors = [{ id:"floor-main", name:"Main Floor", sortOrder:1, tables:Array.from({length:12},(_,i)=>({ id:`table-${i+1}`, floorId:"floor-main", number:String(i+1), name:i===2?"Window":null, capacity:i<4?4:2, status:(i===0||i===1||i===2||i===4||i===7||i===9?"OCCUPIED":i===5?"RESERVED":"AVAILABLE") as "OCCUPIED"|"RESERVED"|"AVAILABLE", statusSince:new Date(Date.now()-25*60000).toISOString(), posX:40+(i%4)*145, posY:40+Math.floor(i/4)*125, width:92,height:72,rotation:0,shape:i%3===0?"round" as const:"square" as const,qrToken:`POTKO-T${i+1}`,assignedWaiter:{id:"staff-2",name:"Sam Patel"} })) }];
const kotTickets = orderRows.slice(0,3).map((o,i)=>({ id:`kot-${i+1}`, orderId:o.id, stationId:"station-hot", ticketNumber:`KOT-${510+i}`, status:(i===0?"PREPARING":i===1?"NEW":"READY") as "PREPARING"|"NEW"|"READY", isPriority:i===1, printedCount:1,lastPrintError:null,createdAt:o.createdAt,station:stations[0],order:{orderNumber:o.orderNumber,type:o.type,channel:o.channel,notes:null,table:o.table?{number:String(o.table.number),name:o.table.name}:null,guestName:o.guestName,customer:o.customer?{name:o.customer.name,phone:o.customer.phone}:null},items:o.items.map((it,j)=>({id:`${o.id}-kot-${j}`,orderItem:{nameSnapshot:it.nameSnapshot,quantity:it.quantity,kitchenNote:null,modifiers:[]}})) }));
const team = [
  {id:"staff-1",name:"Alex Morgan",email:"alex@potko.example",phone:"+91 98765 43001",isActive:true,createdAt:new Date().toISOString(),roleId:"role-manager",role:{id:"role-manager",name:"MANAGER",label:"Manager"},branches:[{branch}],departmentId:"dept-ops",department:{id:"dept-ops",name:"Operations"},permissionOverrides:[]},
  {id:"staff-2",name:"Sam Patel",email:"sam@potko.example",phone:"+91 98765 43002",isActive:true,createdAt:new Date().toISOString(),roleId:"role-waiter",role:{id:"role-waiter",name:"WAITER",label:"Waiter"},branches:[{branch}],departmentId:"dept-service",department:{id:"dept-service",name:"Service"},permissionOverrides:[]},
  {id:"staff-3",name:"Nina Das",email:"nina@potko.example",phone:"+91 98765 43003",isActive:true,createdAt:new Date().toISOString(),roleId:"role-chef",role:{id:"role-chef",name:"CHEF",label:"Chef"},branches:[{branch}],departmentId:"dept-kitchen",department:{id:"dept-kitchen",name:"Kitchen"},permissionOverrides:[]},
  {id:"staff-4",name:"Rohan Sen",email:"rohan@potko.example",phone:"+91 98765 43004",isActive:false,createdAt:new Date().toISOString(),roleId:"role-cashier",role:{id:"role-cashier",name:"CASHIER",label:"Cashier"},branches:[{branch}],departmentId:"dept-ops",department:{id:"dept-ops",name:"Operations"},permissionOverrides:[]},
];
const inventory = [
  {id:"ing-1",name:"Paneer",sku:"DAI-001",unit:"kg",currentStock:"4.2",reorderLevel:"5.0",costPerUnit:"320.00",isActive:true},
  {id:"ing-2",name:"Chicken",sku:"MEAT-004",unit:"kg",currentStock:"12.5",reorderLevel:"8.0",costPerUnit:"280.00",isActive:true},
  {id:"ing-3",name:"Basmati Rice",sku:"DRY-002",unit:"kg",currentStock:"2.1",reorderLevel:"10.0",costPerUnit:"110.00",isActive:true},
];
const suppliers = [
  {id:"sup-1",name:"Fresh Fields Produce",contactName:"Neha Kulkarni",phone:"+91 98765 61001",email:"orders@freshfields.example",address:"Yeshwanthpur Market, Bengaluru",gstNumber:"29ABCDE1234F1Z5",notes:null,isActive:true},
  {id:"sup-2",name:"Green Valley Dairy",contactName:"Arun Kumar",phone:"+91 98765 61002",email:"sales@greenvalley.example",address:"Whitefield, Bengaluru",gstNumber:"29FGHIJ5678K1Z2",notes:null,isActive:true},
];
const purchaseOrders = [
  {id:"po-501",poNumber:"PO-2026-0501",status:"SENT",supplierId:"sup-1",supplier:{id:"sup-1",name:"Fresh Fields Produce"},expectedDate:new Date(Date.now()+2*86400000).toISOString(),notes:"Morning delivery",totalAmount:"3960.00",createdBy:{id:"staff-1",name:"Alex Morgan"},createdAt:new Date(Date.now()-86400000).toISOString(),items:[{id:"poi-1",ingredientId:"ing-3",ingredient:inventory[2],quantityOrdered:"30.00",unitCost:"110.00",quantityReceived:"0.00"}]},
];
const wasteLogs = [{id:"waste-201",ingredientId:"ing-1",ingredient:{id:"ing-1",name:"Paneer",unit:"kg"},quantity:"0.50",reason:"SPOILED",unitCostAtWaste:"320.00",notes:"Opened pack past freshness window",createdBy:{id:"staff-3",name:"Nina Das"},createdAt:new Date(Date.now()-4*3600000).toISOString()}];

function localGet(path: string): unknown {
  const route = path.split("?")[0];
  if (route === "/auth/me") return { user: DEMO_USER };
  if (route === "/branches") return [branch];
  if (route === "/dashboard/summary") return summary;
  if (route === "/dashboard/trends") return trends;
  if (route === "/dashboard/preferences") return preferences;
  if (route === "/settings/display" || route === "/settings") return { restaurant, branch: branchSettings };
  if (route === "/notifications") return { data: [], total: 0, unreadCount: 0, page: 1, pageSize: 20, totalPages: 0 };
  if (route === "/system/update/check") return { currentVersion: "Demo", latestVersion: "Demo", updateAvailable: false, checkedAt: new Date().toISOString() };
  if (route === "/attendance/me") return {id:"att-me",branchId:branch.id,userId:DEMO_USER.id,user:{id:DEMO_USER.id,name:DEMO_USER.name},clockInAt:new Date(new Date().setHours(9,0,0,0)).toISOString(),clockOutAt:null,note:"Manager opening shift"};
  if (route === "/attendance") return [
    {id:"att-1",branchId:branch.id,userId:"staff-1",user:{id:"staff-1",name:"Alex Morgan"},clockInAt:new Date(new Date().setHours(9,0,0,0)).toISOString(),clockOutAt:null,note:null},
    {id:"att-2",branchId:branch.id,userId:"staff-2",user:{id:"staff-2",name:"Sam Patel"},clockInAt:new Date(new Date().setHours(9,15,0,0)).toISOString(),clockOutAt:null,note:null},
    {id:"att-3",branchId:branch.id,userId:"staff-3",user:{id:"staff-3",name:"Nina Das"},clockInAt:new Date(new Date().setHours(8,30,0,0)).toISOString(),clockOutAt:null,note:"Kitchen prep"},
    {id:"att-4",branchId:branch.id,userId:"staff-4",user:{id:"staff-4",name:"Rohan Sen"},clockInAt:new Date(new Date().setHours(8,45,0,0)).toISOString(),clockOutAt:new Date(new Date().setHours(14,5,0,0)).toISOString(),note:null},
  ];
  if (route === "/hr/leave/mine") return [{id:"leave-1",userId:DEMO_USER.id,type:"ANNUAL",startDate:new Date(Date.now()+7*86400000).toISOString(),endDate:new Date(Date.now()+8*86400000).toISOString(),reason:"Family event",status:"PENDING",createdAt:new Date().toISOString()}];
  if (route === "/kds/stations") return [{ id: "demo-kitchen", name: "Main Kitchen" }];
  if (route === "/menu/categories") return menuCategories;
  if (route === "/menu/stations") return stations;
  if (route === "/menu/items") {
    const categoryId = new URLSearchParams(path.split("?")[1] ?? "").get("categoryId");
    return categoryId ? menuItems.filter((item) => item.categoryId === categoryId) : menuItems;
  }
  if (route === "/orders/manage") {
    const params = new URLSearchParams(path.split("?")[1] ?? "");
    const tab = params.get("tab");
    return orderRows.filter((o) => tab === "pending" ? o.acceptance === "PENDING" : tab === "history" ? o.status === "COMPLETED" : o.status !== "COMPLETED");
  }
  if (route === "/orders") return orderRows.filter((o) => o.status !== "COMPLETED").map((o) => ({ id:o.id, orderNumber:o.orderNumber, type:o.type, tableId:o.table?.id ?? null, subtotal:o.totalAmount, taxAmount:"0.00", discountAmount:"0.00", tipAmount:"0.00", loyaltyPointsRedeemed:0, loyaltyDiscountAmount:"0.00", totalAmount:o.totalAmount, status:o.status, customer:o.customer }));
  if (/^\/orders\/[^/]+$/.test(route)) {
    const o = orderRows.find((x) => x.id === route.split("/")[2]) ?? orderRows[0];
    return { ...o, tableId:o.table?.id ?? null, guestCount:o.table?2:null, deliveryPincode:"560001", deliveryLat:null, deliveryLng:null, deliveryPlace:null, notes:null, cancelReason:null, subtotal:o.totalAmount, taxAmount:"0.00", discountAmount:"0.00", tipAmount:"0.00", billedAt:null, table:o.table?{...o.table,number:String(o.table.number)}:null, items:o.items.map((it,i)=>({ ...it, menuItemId:`item-${i+1}`, unitPriceSnapshot:"520.00",lineTotal:"520.00",kitchenNote:null,modifiers:[]})), kots:[],cancelSource:null,discountType:null,discountValue:null,loyaltyPointsRedeemed:0,loyaltyDiscountAmount:"0.00",deliveryFee:"40.00",payments:[] };
  }
  if (route === "/tables/floors") return floors;
  if (route === "/customers") return customers;
  if (/^\/customers\/[^/]+$/.test(route)) {
    const c = customers.find((x) => x.id === route.split("/")[2]) ?? customers[0];
    return { ...c, addresses:[{id:"addr-1",label:"Home",line1:c.address ?? "14 Market Street",street:null,landmark:null,city:"Bengaluru",state:"Karnataka",pincode:"560001",instructions:null,isDefault:true}],orders:orderRows.filter((o)=>o.customer?.id===c.id).map((o)=>({id:o.id,orderNumber:o.orderNumber,totalAmount:o.totalAmount,billedAt:o.createdAt})),giftCards:[] };
  }
  if (route.startsWith("/customers/") && route.endsWith("/addresses")) return [];
  if (route === "/users") return team;
  if (route === "/users/roles") return [{id:"role-manager",name:"MANAGER",label:"Manager"},{id:"role-waiter",name:"WAITER",label:"Waiter"},{id:"role-chef",name:"CHEF",label:"Chef"},{id:"role-cashier",name:"CASHIER",label:"Cashier"}];
  if (route === "/users/departments") return [{id:"dept-ops",name:"Operations",_count:{users:2}},{id:"dept-service",name:"Service",_count:{users:1}},{id:"dept-kitchen",name:"Kitchen",_count:{users:1}}];
  if (route === "/kds/tickets") return kotTickets;
  if (route === "/inventory/ingredients" || route === "/inventory/ingredients/low-stock") return route.endsWith("low-stock") ? inventory.filter((x)=>Number(x.currentStock)<Number(x.reorderLevel)) : inventory;
  if (route === "/inventory/tracking-status") return {tracked:4,untracked:2,problems:[{menuItemId:"item-2",name:"Paneer Tikka",reason:"NO_RECIPE"},{menuItemId:"item-6",name:"Mango Lassi",reason:"NO_STOCK_ITEM"}]};
  if (route === "/inventory/suppliers") return suppliers;
  if (route === "/inventory/purchase-orders") return purchaseOrders;
  if (/^\/inventory\/purchase-orders\/[^/]+$/.test(route)) return {...purchaseOrders[0],goodsReceipts:[]};
  if (route === "/inventory/waste") return wasteLogs;
  if (route === "/inventory/goods-receipts") return [];
  if (route === "/inventory/transfers") return {branches:[{id:"potko-demo-branch-2",name:"POTKO · Riverside"}],history:[{id:"transfer-1",createdAt:new Date(Date.now()-6*86400000).toISOString(),fromBranchId:"potko-demo-branch-2",fromBranchName:"POTKO · Riverside",toBranchName:branch.name,ingredientName:"Chicken",unit:"kg",quantity:"3.00",unitCost:"280.00",note:"Weekend stock balance"}]};
  if (route === "/inventory/purchase-requests" || route === "/inventory/quotations" || route === "/inventory/supplier-invoices") return [];
  if (route.startsWith("/inventory/ingredients/") && route.endsWith("/movements")) return [{id:"move-1",type:"RECEIPT",quantity:"10.00",note:"Opening stock",createdBy:{id:"staff-1",name:"Alex Morgan"},createdAt:new Date(Date.now()-7*86400000).toISOString()}];
  if (route.startsWith("/inventory/ingredients/") && route.endsWith("/batches")) return [{id:"batch-1",batchNumber:"BATCH-2407",quantityReceived:"10.00",quantityRemaining:"4.20",unitCost:"320.00",expiryDate:new Date(Date.now()+14*86400000).toISOString(),receivedAt:new Date(Date.now()-3*86400000).toISOString()}];
  if (route.startsWith("/inventory/menu-items/") && route.endsWith("/recipe")) return {lines:[{id:"recipe-1",ingredientId:"ing-1",ingredientName:"Paneer",unit:"kg",quantity:0.18,costPerUnit:320,lineCost:57.6}],totalCost:57.6};
  if (route.startsWith("/inventory/menu-items/") && route.endsWith("/tracking")) return {id:route.split("/")[3],inventoryTracking:"RECIPE",stockIngredientId:null,stockQuantityPerSale:0,isCombo:false};
  if (route.startsWith("/inventory/suppliers/") && route.endsWith("/performance")) return {supplierId:"sup-1",supplierName:suppliers[0].name,totalPurchaseOrders:12,totalSpend:48200,onTimeDeliveryRate:91.7,avgLeadTimeDays:1.8};
  if (route === "/delivery") return orderRows.filter((o)=>o.type==="DELIVERY").map((o)=>({id:o.id,orderNumber:o.orderNumber,totalAmount:o.totalAmount,deliveryFee:"40.00",deliveryAddress:o.deliveryAddress,deliveryPincode:"560001",deliveryPhone:o.customer?.phone ?? null,deliveryLat:null,deliveryLng:null,deliveryPlace:null,deliveryFailedReason:null,deliveryStatus:"ASSIGNED",deliveryEtaAt:new Date(Date.now()+25*60000).toISOString(),deliveredAt:null,scheduledFor:null,guestName:o.guestName,notes:null,driver:{id:"driver-1",name:"Vikram Joshi"},deliveryZone:{id:"zone-central",name:"Central Bengaluru"}}));
  if (route === "/delivery/drivers") return [{id:"driver-1",name:"Vikram Joshi",phone:"+91 98765 50001",riderOnline:true,riderLat:12.9716,riderLng:77.5946,riderLocationAt:new Date().toISOString(),activeDeliveries:1},{id:"driver-2",name:"Asha Nair",phone:"+91 98765 50002",riderOnline:false,riderLat:null,riderLng:null,riderLocationAt:null,activeDeliveries:0}];
  if (route === "/delivery/zones") return [{id:"zone-central",name:"Central Bengaluru",fee:"40.00",minOrderAmount:"300.00",etaMinutes:35,pincodes:["560001","560002"],isActive:true}];
  if (route === "/reservations") return [{id:"res-301",customerName:"Priya Sharma",phone:customers[0].phone,email:customers[0].email,guestCount:4,reservedAt:new Date(Date.now()+90*60000).toISOString(),durationMinutes:90,tableId:"table-3",table:{id:"table-3",number:"3",name:"Window"},specialRequests:"Window seat if available",deposit:"500.00",status:"CONFIRMED",channel:"STAFF"},{id:"res-302",customerName:"Kabir Rao",phone:customers[3].phone,email:customers[3].email,guestCount:2,reservedAt:new Date(Date.now()+3*3600000).toISOString(),durationMinutes:90,tableId:null,table:null,specialRequests:null,deposit:null,status:"PENDING",channel:"ONLINE"}];
  if (route === "/accounting/expenses") return [{id:"exp-1",spentOn:new Date().toISOString(),category:"Produce",amount:"1850.00",note:"Daily market purchase",paidFromCash:true},{id:"exp-2",spentOn:new Date(Date.now()-86400000).toISOString(),category:"Utilities",amount:"920.00",note:"Kitchen gas refill",paidFromCash:false}];
  if (route === "/accounting/closing") return [{id:"close-1",businessDate:new Date(Date.now()-86400000).toISOString().slice(0,10),expectedCash:"12640.00",countedCash:"12640.00",variance:"0.00",note:"Till reconciled"}];
  if (route === "/accounting/closing/preview") { const p=new URLSearchParams(path.split("?")[1] ?? ""); const openingFloat=Number(p.get("openingFloat") ?? 0); return {businessDate:p.get("date") ?? new Date().toISOString().slice(0,10),openingFloat,cashSales:18420,cashExpenses:1850,expectedCash:openingFloat+16570}; }
  if (route === "/accounting/profit-loss") return {orders:86,grossCollected:28450,taxCollected:1354,refunds:0,netSales:27096,expenses:[{category:"Produce",amount:1850},{category:"Utilities",amount:920}],totalExpenses:2770,payrollCost:6200,netProfit:18126};
  if (route === "/accounting/gst") return {orders:86,rows:[{ratePercent:5,taxableValue:25700,tax:1285,total:26985},{ratePercent:18,taxableValue:383,tax:69,total:452}],totalTaxable:26083,totalTax:1354};
  if (route === "/accounting/branches") return [{branchId:branch.id,name:branch.name,orders:86,sales:28450,openOrders:3,lowStockItems:2,inventoryValue:42650}];
  if (route === "/reports") return [{key:"sales-daily",title:"Daily sales",group:"Sales"},{key:"item-performance",title:"Item performance",group:"Sales"},{key:"payments",title:"Payment summary",group:"Finance"}];
  if (route.startsWith("/reports/")) { const key=route.split("/")[2]; return {key,title:key==="item-performance"?"Item performance":key==="payments"?"Payment summary":"Daily sales",columns:["Date","Orders","Gross sales","Tax","Net sales"],rows:[[new Date().toISOString().slice(0,10),86,"₹28,450.00","₹1,354.00","₹27,096.00"],[new Date(Date.now()-86400000).toISOString().slice(0,10),79,"₹25,180.00","₹1,199.00","₹23,981.00"]]}; }
  if (route === "/report-schedules") return {emailConfigured:false,schedules:[{id:"schedule-1",reportKey:"sales-daily",frequency:"WEEKLY",format:"xlsx",recipients:["owner@potko.example"],isActive:true,lastSentAt:new Date(Date.now()-7*86400000).toISOString(),lastError:null}]};
  if (route === "/backups/status") return {configured:false,source:null,endpoint:null,bucket:null,region:null,accessKeyIdMasked:null,intervalDays:1,retainCount:7,lastBackup:null,nextScheduledAt:null};
  if (route === "/backups") return [];
  if (route === "/audit-logs") return {data:[{id:"log-1",userId:"staff-1",user:{id:"staff-1",name:"Alex Morgan"},action:"ORDER_CREATED",entity:"Order",entityId:"ord-1042",metadata:{orderNumber:"ORD-1042"},createdAt:new Date(Date.now()-8*60000).toISOString()},{id:"log-2",userId:"staff-2",user:{id:"staff-2",name:"Sam Patel"},action:"STOCK_ADJUSTED",entity:"Ingredient",entityId:"ing-1",metadata:{ingredient:"Paneer"},createdAt:new Date(Date.now()-40*60000).toISOString()}],total:2,page:1,pageSize:20,totalPages:1};
  if (route === "/audit-logs/entities") return ["Order","Ingredient","MenuItem","User"];
  if (route === "/operations/equipment") return [
    {id:"equip-1",name:"Commercial combi oven",location:"Hot Kitchen",serviceIntervalDays:90,lastServicedAt:new Date(Date.now()-72*86400000).toISOString(),nextDueAt:new Date(Date.now()+18*86400000).toISOString(),overdue:false,dueSoon:false},
    {id:"equip-2",name:"Walk-in refrigerator",location:"Cold Storage",serviceIntervalDays:30,lastServicedAt:new Date(Date.now()-34*86400000).toISOString(),nextDueAt:new Date(Date.now()-4*86400000).toISOString(),overdue:true,dueSoon:false},
    {id:"equip-3",name:"Espresso machine",location:"Beverage Bar",serviceIntervalDays:60,lastServicedAt:new Date(Date.now()-54*86400000).toISOString(),nextDueAt:new Date(Date.now()+6*86400000).toISOString(),overdue:false,dueSoon:true},
  ];
  if (route === "/operations/documents") return [
    {id:"doc-1",title:"Opening and closing checklist",category:"SOP",updatedAt:new Date(Date.now()-2*86400000).toISOString()},
    {id:"doc-2",title:"Butter chicken preparation guide",category:"RECIPE",updatedAt:new Date(Date.now()-5*86400000).toISOString()},
    {id:"doc-3",title:"Produce supplier agreement",category:"CONTRACT",updatedAt:new Date(Date.now()-18*86400000).toISOString()},
  ];
  if (/^\/operations\/documents\/[^/]+$/.test(route)) { const id=route.split("/")[3]; const d=id==="doc-2"?{title:"Butter chicken preparation guide",category:"RECIPE",updatedAt:new Date(Date.now()-5*86400000).toISOString()}:{title:"Opening and closing checklist",category:"SOP",updatedAt:new Date(Date.now()-2*86400000).toISOString()}; return {id,...d,body:"POTKO Central Kitchen\n\n1. Check station setup and food safety temperatures.\n2. Confirm ingredient prep and label open batches.\n3. Clean and sanitize work surfaces between tasks.\n4. Record equipment or stock issues for the manager.",files:[]}; }
  if (route === "/verifactu/records") return { items: [], total: 0 };
  if (route === "/verifactu/settings") return { enabled: false, environment: "TEST", status: "NOT_CONFIGURED" };
  if (route === "/verifactu/verify") return { ok: true, status: "DEMO" };
  if (route === "/payment-gateways/active") return null;
  if (route === "/payment-gateways/catalog") return { providers: [], countries: [] };
  if (route === "/sync/status") return { enabled: false, status: "DISCONNECTED", lastSyncAt: null, error: null };
  if (route === "/auth/2fa/status") return { enabled: false, recoveryCodesLeft: 0 };
  if (route === "/auth/setup-status") return { isSetup: true };
  if (route === "/dashboard/summary") return summary;
  return [];
}

async function localRequest<T>(path: string, body?: unknown): Promise<T> {
  if (path === "/auth/login" || path === "/auth/register") return { user: DEMO_USER } as T;
  if (path === "/auth/logout") return { ok: true } as T;
  if (path === "/orders/print/diagnostics") return { configured: false, connection: "DEMO", message: "Demo preview" } as T;
  if (path === "/system/update/apply") return { status: "DEMO", message: "Updates are disabled in preview mode." } as T;
  if (path.includes("/test")) return { ok: true, status: "DEMO", message: "Preview only" } as T;
  if (path.includes("/audience")) return { count: 0 } as T;
  if (path.includes("/preferences")) return (body ?? preferences) as T;
  return ({ ok: true, demo: true, ...(body && typeof body === "object" ? body : {}) }) as T;
}

export const api = {
  get: <T>(path: string) => Promise.resolve(localGet(path) as T),
  post: <T>(path: string, body?: unknown) => localRequest<T>(path, body),
  patch: <T>(path: string, body?: unknown) => localRequest<T>(path, body),
  put: <T>(path: string, body?: unknown) => localRequest<T>(path, body),
  delete: <T>(path: string, body?: unknown) => localRequest<T>(path),
  postForm: <T>(path: string, _form: FormData) => localRequest<T>(path),
  upload: <T>(path: string, _file: File) => localRequest<T>(path, { url: "/demo-image.png" }),
};
