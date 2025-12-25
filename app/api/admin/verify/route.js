import { jwtVerify } from "jose";

export async function GET(request) {
  const token = request.cookies.get("adminToken")?.value;

  if (!token) return Response.json({ isAdmin: false });

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return Response.json({ isAdmin: payload?.isAdmin === true });
  } catch {
    return Response.json({ isAdmin: false });
  }
}
