import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const user = await request.json();

    if (user.length < 1)
      return NextResponse.json(
        { message: "No data to delete" },
        { status: 500 }
      );

    if (Array.isArray(user)) {
      for (const u of user) {
        const url = `https://691a9cf52d8d7855756f6c32.mockapi.io/deletedUser/${u.id}`;
        const res = await fetch(url, { method: "DELETE" });

        if (!res.ok) throw new Error("Unable to delete user permenantly");
      }
      return NextResponse.json({ message: "Delete deleted" }, { status: 200 });
    }
    const url = `https://691a9cf52d8d7855756f6c32.mockapi.io/deletedUser/${user.id}`;
    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) throw new Error("Cant delete");

    return NextResponse.json({ message: "Delete deleted" }, { status: 200 });
  } catch (error) {
    console.error("error", error);
  }
}
