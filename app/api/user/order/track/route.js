// /app/api/user/order/track/route.js

import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Order from "@/models/Orders";

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

// fetch tracking details from Shiprocket
async function fetchTracking(order, token, isReturn = false) {
  // const id = isReturn ? order.returnInfo?.shipmentId : order.shipmentId;

  // const res = await fetch(`${SHIPROCKET_BASE}/courier/track/shipment/${id}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  // if (!res.ok) {
  //   console.error("Failed to fetch tracking details:", res.statusText);
  //   throw new Error("Failed to fetch tracking details");
  // }

  // const data = await res.json();

  const data = JSON.parse(`{
  "tracking_data": {
    "track_status": 1,
    "shipment_status": 10,
    "shipment_track": [
      {
        "return_awb_code": "RET1490FPL",
        "courier_name": "Trials",
        "pickup_date": "2025-09-08",
        "delivered_date": "2025-09-10",
        "current_status": "RTO DELIVERED",
        "edd": null
      }
    ],
    "shipment_track_activities": [
      {
        "date": "2025-09-10 16:05:00",
        "status": "10",
        "activity": "Return shipment delivered at seller warehouse",
        "location": "Delhi Warehouse"
      }
    ],
    "track_url": "https://shiprocket.co/tracking/RET1490FPL",
    "etd": null
  }
}
`);

  return data;
  // return JSON.parse(data);
}

function normalizeShipmentStatus(code) {
  if (!code || code.length == 0) return "unknown";
  const SHIPROCKET_STATUS_MAP = {
    // ------------------- Delivered -------------------
    1: "delivered", // Delivered to customer
    7: "delivered", // Delivered to customer

    // ------------------- RTO Delivered -------------------
    10: "rto_delivered", // RTO Delivered
    14: "rto_delivered", // RTO Acknowledged
    48: "rto_delivered", // Reached Warehouse (Return Delivered to Seller)
    78: "rto_delivered", // Reached Back at Seller City

    // ------------------- RTO Initiated -------------------
    9: "rto_initiated", // RTO Initiated

    // ------------------- RTO In Transit -------------------
    40: "rto_in_transit", // RTO_NDR
    41: "rto_in_transit", // RTO_OFD
    46: "rto_in_transit", // RTO In Intransit

    // ------------------- STILL AT SELLER (NOT PICKED) → confirmed -------------------
    1: "confirmed", //AWB Assigned
    2: "confirmed", //Label Generated
    3: "confirmed", // Pickup Scheduled
    4: "confirmed", //Pickup Queued
    5: "confirmed", //Manifest Generated
    11: "confirmed", // pickup pending
    13: "confirmed", // Pickup Error
    15: "confirmed", // Pickup Rescheduled
    19: "confirmed", // Out For Pickup
    20: "confirmed", // Pickup Exception
    27: "confirmed", // Pickup Booked
    71: "confirmed", // Handover Exception

    // ------------------- CANCELLED → cancel -------------------
    8: "cancel", // Cancelled
    16: "cancel", // Cancellation Requested
    45: "cancel", // Cancelled Before Dispatched

    // ------------------- In Transit -------------------
    6: "in_transit", // Shipped
    17: "in_transit", // Out For Delivery
    18: "in_transit", // In Transit
    22: "in_transit", // Delayed
    23: "in_transit", // Partial Delivered
    38: "in_transit", // Reached Destination Hub
    39: "in_transit", // Misrouted
    42: "in_transit", // Picked Up
    49: "in_transit", // Custom Cleared (India)
    50: "in_transit", // In Flight
    51: "in_transit", // Handover to Courier
    52: "in_transit", // Shipment Booked
    54: "in_transit", // In Transit Overseas
    55: "in_transit", // Connection Aligned
    56: "in_transit", // Reached Overseas Warehouse
    57: "in_transit", // Custom Cleared Overseas
    59: "in_transit", // Box Packing
    60: "in_transit", // FC Allocated
    61: "in_transit", // Picklist Generated
    62: "in_transit", // Ready To Pack
    63: "in_transit", // Packed
    67: "in_transit", // FC Manifest Generated
    68: "in_transit", // Processed at Warehouse
    26: "in_transit", // Fulfilled
    43: "unknown", // Self Fulfilled

    // ------------------- UNKNOWN (not useful statuses) -------------------
    12: "unknown", // Lost
    21: "unknown", // Undelivered
    24: "unknown", // Destroyed
    25: "unknown", // Damaged
    44: "unknown", // Disposed Off
    47: "unknown", // QC Failed
    72: "unknown", // Packed Exception
    75: "unknown", // RTO Lock
    76: "unknown", // Untraceable
    77: "unknown", // Issue related to recipient
  };

  return (
    SHIPROCKET_STATUS_MAP[code] ||
    SHIPROCKET_STATUS_MAP[parseInt(code)] ||
    "unknown"
  );
}

function mapCustomerCode({ normalized, isReturnFlow, trackingFound }) {
  if (!trackingFound) return { code: 1, label: "Created" };

  // ✅ Return created but not picked
  if (
    (isReturnFlow && normalized === "rto_initiated") ||
    normalized === "confirmed"
  ) {
    return { code: 5, label: "Return Initiated" };
  }

  // ✅ Return picked / moving back
  if (
    (isReturnFlow && normalized === "rto_in_transit") ||
    normalized === "in_transit"
  ) {
    return { code: 6, label: "Returned" };
  }

  // ✅ Return received by seller
  if (isReturnFlow && normalized === "rto_delivered") {
    return { code: 7, label: "Return Received" };
  }

  // ✅ Delivered to user
  if (!isReturnFlow && normalized === "delivered") {
    return { code: 4, label: "Delivered" };
  }

  // ✅ Normal in-transit
  if (!isReturnFlow && normalized === "in_transit") {
    return { code: 3, label: "In Transit" };
  }

  return { code: 2, label: "Confirmed" };
}

async function fetchOrder(order, token, isReturn = false) {
  // const orderId = isReturn ? order.returnInfo?.orderId : order.chanelOrderId;
  // const res = await fetch(`${SHIPROCKET_BASE}/orders/show/${orderId}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
  // const data = await res.json();
  // if (!res.ok) {
  //   console.error("Failed to fetch tracking details:", data, order);
  //   throw new Error("Failed to fetch tracking details");
  // }

  const data = JSON.parse(`{
  "data": {
    "id": "92177074",
    "status": "RTO DELIVERED",
    "status_code": 10,
    "is_return": 1,

    "shipments": {
      "id": "97564001",
      "courier": "Trials",
      "awb_assign_date": "2025-09-07",
      "pickup_scheduled_date": "2025-09-08",
      "shipped_date": "2025-09-08",
      "etd": null,
      "delivered_date": null,
      "rto_delivered_date": "2025-09-10",
      "is_rto": true
    },

    "etd_date": null
  }
}
  `);

  return data;
  // return JSON.parse(data);
}

async function getShiprocketToken() {
  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    }
  );
  const data = await res.json();
  return data.token;
}

async function assignCourierAndAWB(token, shipmentId) {
  // const res = await fetch(
  //   "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ shipment_id: shipmentId }),
  //   }
  // );
  // const data = await res.json();
const data = JSON.parse(`{
  "response": {
    "data": {
      "awb_code": "TRI1490FPL",
      "courier_name": "Trials"
    }
  }
}`)
  return data;
}

export async function POST(request) {
  await connectMongo();
  const { orderId, testPicks } = await request.json();

  const order = await Order.findOne({ OrderId: orderId });
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const token = await getShiprocketToken();

  const isReturnFlow = !!order.returnInfo?.shipmentId;

  // ✅ Fetch tracking
  let trackingData, cancelledData;
  try {
    trackingData = await fetchTracking(order, token, isReturnFlow);
  } catch (err) {
    console.log("Tracking not found", err);
  }

  try {
    cancelledData = await fetchOrder(order, token, isReturnFlow);
  } catch (e) {
    console.log("Order data not found", e);
  }

  // ✅ Normalizelet rawTrackingStatus = trackingData?.order_status || "";
  let rawOrderStatus = cancelledData?.data?.status_code || "";
  let rawTrackingStatus = trackingData?.tracking_data?.shipment_status || "";

  const effectiveRawStatus = testPicks || rawTrackingStatus || rawOrderStatus;
  let normalized = normalizeShipmentStatus(effectiveRawStatus);

  // Fallback for shipment-less cancel
  if (normalized === "unknown") {
    const orderLevelStatus = normalizeShipmentStatus(rawOrderStatus);
    if (orderLevelStatus !== "unknown") {
      normalized = orderLevelStatus;
    }
  }

  const isNotConfirmed = trackingData?.tracking_data?.track_status === 0;

  const responseStatus = mapCustomerCode({
    normalized,
    isReturnFlow,
    trackingFound: !isNotConfirmed,
  });

  if (isNotConfirmed) {
    console.log("Tracking not found or not confirmed yet.");
    return NextResponse.json({
      success: true,
      code: responseStatus.code, // yeh raha code from 1-7
      label: responseStatus.label, // simple label like Delivered, In Transit, etc.
      current_status: "Not Confirmed", // can be as shiprocket sends
      isRTO: false, // Product is returned because user did not accepted (or not on delivery place)
      order, // Mongo db order object
      trakingInfo: {
        edd: "", // normal format like: 5 Sep 2025
        confirmationDate: "",
        rtoDeliveryDate: "",
        pickupDate: "", // normal format like: 3-Sep-2025
        returnPickupDate: "", // normal format like: 3-Sep-2025
        trackigUrl: `https://shiprocket.co/tracking/${order.trackingCode}`,
      },
    });
  }

  if (
    !order.trackingCode ||
    !order.shipmentId ||
    !order.chanelOrderId ||
    (!order.courierBy && !isNotConfirmed && !isReturnFlow)
  ) {
    order.shipmentId = cancelledData?.data?.shipments.id || null;
    order.chanelOrderId = cancelledData?.data?.id || null;
    order.courierBy =
      trackingData?.tracking_data?.shipment_track[0]?.courier_name ||
      cancelledData?.data?.shipments.courier;
    order.trackingCode =
      trackingData?.tracking_data?.shipment_track[0]?.awb_code || null;
    order.status = "confirmed";
    order.statusCode = 2;
    await order.save();
  } else if (isReturnFlow && !order.returnInfo?.awbCode) {
    // ✅ Update return shipment info if returned
    order.set(
      "returnInfo.awbCode",
      trackingData?.tracking_data?.shipment_track?.[0]?.return_awb_code || null
    );

    order.set(
      "returnInfo.courierName",
      cancelledData?.data?.shipments?.courier || null
    );
    await order.save();
  }

  if (normalized === "cancel") {
    order.cancelled.status = true;
    order.cancelled.time = new Date();
    order.status = "cancelled";
    order.statusCode = 0;
    await order.save();
  }

  // update if order is In Transit
  if (!isReturnFlow && normalized === "in_transit") {
    order.status = "inTransit";
    order.statusCode = 3;
    await order.save();
  }

  console.log("Normalized:", normalized);

  // ✅ SET RTO ONLY WHEN RETURN EXISTS
  const isRTO = normalized.includes("rto") && order.exchanged.status !== "none";

  // ✅ RETURN PICKUP CASE
  if (isReturnFlow && normalized === "in_transit") {
    order.statusCode = 6;
    order.status = "returned";
    order.exchanged.status = "returned";
    await order.save();
  }

  // ✅ ✅ RETURN SUCCESSFULLY RECEIVED → CREATE SHIPMENT FOR NEW ORDER
  if (isReturnFlow && normalized === "rto_delivered") {
    console.log("✅ Return received, creating new exchange shipment...");

    order.exchanged.status = "received";
    order.status = "received";
    order.statusCode = 7;
    await order.save();

    // ✅ Find exchange order
    const exchangedOrder = await Order.findOne({
      "wasExchanged.forProduct": order._id,
    });

    if (exchangedOrder && !exchangedOrder.trackingCode) {
      const shipmentExg = await assignCourierAndAWB(
        token,
        exchangedOrder.shipmentId
      );

      exchangedOrder.courierBy =
        shipmentExg?.response?.data?.courier_name || null;

      exchangedOrder.trackingCode =
        shipmentExg?.response?.data?.awb_code || null;

      exchangedOrder.status = "confirmed";
      exchangedOrder.statusCode = 2;

      await exchangedOrder.save();

      console.log("✅ New shipment created for exchange order");
    }
  }

  // ✅ Forward delivery (not return)
  if (!isReturnFlow && normalized === "delivered") {
    order.status = "delivered";
    order.statusCode = 4;
    await order.save();
  }

  // ✅ Forward RTO without exchange
  if (!isReturnFlow && normalized.includes("rto")) {
    order.isRTO = true;
    await order.save();
  }

  let deliveryDate =
    cancelledData.data?.shipments?.etd ||
    cancelledData.data?.etd_date?.split(" ")[0] ||
    trackingData?.tracking_data?.shipment_track[0].edd;
  trackingData?.tracking_data?.shipment_track[0]?.delivered_date ||
    cancelledData.data?.shipments?.delivered_date;

  let customTrackingUrl = `https://shiprocket.co/tracking/${order.trackingCode}`;

  if (isReturnFlow) {
    customTrackingUrl = `https://shiprocket.co/tracking/${order.returnInfo?.awbCode}`;
  }

  console.log(isReturnFlow, "is return flow");

  return NextResponse.json({
    success: true,
    isReturnFlow,
    normalized,
    code: responseStatus.code, // yeh raha code from 1-7
    label: responseStatus.label, // simple label like Delivered, In Transit, etc.
    current_status:
      trackingData?.tracking_data?.shipment_track[0]?.current_status ||
      cancelledData?.data?.status ||
      "", // can be as shiprocket sends
    isRTO, // Product is returned because user did not accepted (or not on delivery place)
    order, // Mongo db order object
    trakingInfo: {
      edd: deliveryDate || null, // normal format like: 5 Sep 2025
      confirmationDate: cancelledData?.data?.shipments?.awb_assign_date,
      rtoDeliveryDate: cancelledData?.data?.shipments?.rto_delivered_date,
      pickupDate:
        cancelledData?.data?.shipments?.pickup_scheduled_date ||
        cancelledData?.data?.shipments?.shipped_date ||
        trackingData?.tracking_data?.shipment_track[0]?.pickup_date ||
        null, // normal format like: 3-Sep-2025
      returnPickupDate:
        cancelledData?.data?.shipments?.pickup_scheduled_date || null, // normal format like: 3-Sep-2025
      trackigUrl: trackingData?.tracking_data?.track_url || customTrackingUrl,
    },
  });
}
