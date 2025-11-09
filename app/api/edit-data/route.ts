import { NextResponse } from "next/server";
import { generatePhoneNumber } from "phone-number-generator-js";

export async function PATCH(request: Request) {
  const data = await request.json();
  try {
    const roles = ["admin", "user", "guest"];
    const active = ["active", "inactive"];
    for (const dt of data) {
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      const randomActive = active[Math.floor(Math.random() * active.length)];

      const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${dt.id}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dt,
          role: randomRole,
          phoneNumber: generatePhoneNumber(),
          active: randomActive,
        }),
      });
      if (!res.ok) throw new Error("failed to update user");
    }
    return NextResponse.json({ message: "Success edit" }, { status: 200 });
  } catch (error) {
    console.error("error", error);
    return new Response(JSON.stringify({ message: "Error updating users" }), {
      status: 500,
    });
  }
}
