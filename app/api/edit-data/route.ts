import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { generatePhoneNumber } from "phone-number-generator-js";

export async function PATCH(request: Request) {
  const { data, selectAllDataset } = await request.json();

  const roles = ["admin", "user", "guest"];
  const active = ["active", "inactive"];

  try {
    if (selectAllDataset) {
      const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users`;

      const res = await fetch(url);
      const json = await res.json();

      for (const js of json) {
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        const randomActive = active[Math.floor(Math.random() * active.length)];
        const res = await fetch(
          `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${js.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...js,
              role: randomRole,
              phoneNumber: generatePhoneNumber(),
              active: randomActive,
              createdAt: dayjs(
                Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000
              ).format("DD-MM-YYYY"),
            }),
          }
        );
        if (!res.ok) throw new Error("failed to update user");
      }
    }

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
          createdAt: dayjs(
            Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000
          ).format("DD-MM-YYYY"),
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
