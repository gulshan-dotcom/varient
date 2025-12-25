import { NextResponse } from "next/server";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Orders";
import connectMongo from "@/lib/connectMongo";

function generateOrderId() {
  return `500${Date.now()}${Math.floor(Math.random() * 100000)}`;
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

async function createShiprocketOrder(token, orderData) {
  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    }
  );
  const data = await res.json();
  console.log(data);
  return data;
}

export async function POST(request) {
  try {
    await connectMongo();

    const body = await request.json();
    const { productId, size, color, address, affilatorId, wasExchanged } = body;
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: userEmail });
    const product = await Product.findById(productId);

    if (!user || !product) {
      return NextResponse.json(
        { error: "Invalid user or product" },
        { status: 404 }
      );
    }

    let finalPrice = product.currentPrice;

    if (user.Orders.length === 0) {
      finalPrice = finalPrice - (finalPrice / 100) * 15;
    } else {
      finalPrice = finalPrice - (finalPrice / 100) * 10;
    }

    // Step 1: Save order in DB
    const orderId = generateOrderId();
    const order = await Order.create({
      user: user._id,
      items: [
        {
          product: product._id,
          color,
          size,
          priceAtPurchase: finalPrice,
        },
      ],
      vendorPrice: product.vendorPrice,
      address,
      totalAmount: product.currentPrice,
      OrderId: orderId,
      wasExchanged: {
        status: wasExchanged ? true : false,
        forProduct: wasExchanged ? wasExchanged : undefined,
      },
    });

    user.Orders.push({
      productId: order._id,
      size,
      color,
      amount: finalPrice,
    });
    await user.save();

    // Step 2: Create order in Shiprocket
    const token = await getShiprocketToken();
    const shiprocketOrderData = {
      order_id: orderId,
      order_date: new Date().toISOString(),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
      billing_customer_name: user.username,
      billing_last_name: user.lastName || "",
      billing_address: `${address.houseNumber}, ${address.street}, near ${
        address.landmark || ""
      }`,
      billing_city: address.city,
      billing_pincode: address.pincode,
      billing_state: address.state,
      billing_country: address.country || "India",
      billing_email: user.email,
      billing_phone: user.phone || "9999999999",
      shipping_is_billing: true,
      order_items: [
        {
          name: product.title,
          sku: product._id.toString(),
          units: 1,
          selling_price: product.currentPrice,
        },
      ],
      payment_method: "Prepaid",
      sub_total: product.currentPrice,
      length: product.dimension?.length,
      breadth: product.dimension?.breadth,
      height: product.dimension?.height,
      weight: product.weight / 1000,
    };

    const shiprocketRes = await createShiprocketOrder(
      token,
      shiprocketOrderData
    );

    order.OrderId = orderId || null;

    // testing for shipment
    order.shipmentId = "shiprocketRes.shipment_id" || null;
    order.chanelOrderId = "shiprocketRes.order_id" || "";
    order.courierBy = "courierRes.response.data.courier_name" || null;
    order.trackingCode = "courierRes.response.data.awb_code" || null;
    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order placed, courier assigned, invoice generated",
        order,
        shiprocket: {
          order: shiprocketRes,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order placing error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// {
//   order_id: 932514925,
//   channel_order_id: 'ORD-1755348780745-60579',
//   shipment_id: 928967322,
//   status: 'NEW', //only here will be provided cancelled status
//   status_code: 1,
//   onboarding_completed_now: 0,
//   awb_code: '',
//   courier_company_id: '',
//   courier_name: '',
//   new_channel: false,
//   packaging_box_error: ''
// }

// {
//     "awb_assign_status": 1,
//     "response": {
//         "data": {
//             "courier_company_id": 685,
//             "awb_code": "19041788453480",
//             "cod": 0,
//             "order_id": 932536267,
//             "shipment_id": 928988547,
//             "awb_code_status": 1,
//             "assigned_date_time": {
//                 "date": "2025-08-16 18:52:30.000000",
//                 "timezone_type": 3,
//                 "timezone": "Asia/Kolkata"
//             },
//             "applied_weight": 0.5,
//             "company_id": 5725500,
//             "courier_name": "Delhivery Surface_Stressed",
//             "child_courier_name": null,
//             "freight_charges": 71.76,
//             "routing_code": "DEL./MII",
//             "rto_routing_code": null,
//             "invoice_no": "Retail00002",
//             "transporter_id": "06AAPCS9575E1ZR",
//             "transporter_name": "Delhivery",
//             "shipped_by": {
//                 "shipper_company_name": "Gulshan ",
//                 "shipper_address_1": "85, street  1 2",
//                 "shipper_address_2": "Simran palace, gilla girls school",
//                 "shipper_city": "Ludhiana",
//                 "shipper_state": "Punjab",
//                 "shipper_country": "India",
//                 "shipper_postcode": "141003",
//                 "shipper_first_mile_activated": 0,
//                 "shipper_phone": "9877037380",
//                 "lat": "30.844289565829",
//                 "long": "75.883622707124",
//                 "shipper_email": "popzen2343@gmail.com",
//                 "extra_info": {
//                     "role": "Warehouse Helper",
//                     "source": 1,
//                     "open_time": "4:00 AM",
//                     "close_time": "11:30 PM",
//                     "select_days": "[\"Monday\",\"Wednesday\",\"Friday\",\"Sunday\"]",
//                     "alternate_name": "",
//                     "alternate_role": "",
//                     "alternate_email": "",
//                     "send_pickup_rto_updates": 0
//                 },
//                 "rto_company_name": "Gulshan ",
//                 "rto_address_1": "85, street  1 2",
//                 "rto_address_2": "Simran palace, gilla girls school",
//                 "rto_city": "Ludhiana",
//                 "rto_state": "Punjab",
//                 "rto_country": "India",
//                 "rto_postcode": "141003",
//                 "rto_phone": "9877037380",
//                 "rto_email": "popzen2343@gmail.com"
//             }
//         }
//     },
//     "no_pickup_popup": 0,
//     "quick_pick": 0
// }
