import { User } from "@/app/types";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const user = await request.json();
    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser/${user.id}`;

    if (Array.isArray(user)) {
      await Promise.all(
        user.map(async (u: User) => {
          const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser/${u.id}`;

          await fetch(url, { method: "DELETE" });
        })
      );
    }

    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) throw new Error("Cant delete");

    return NextResponse.json({ message: "Delete deleted" }, { status: 200 });
  } catch (error) {
    console.error("error", error);
  }
}
