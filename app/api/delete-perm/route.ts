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
        const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser/${u.id}`;
        const res = await fetch(url, { method: "DELETE" });

        if (!res.ok) throw new Error("Unable to delete user permenantly");
      }
      return NextResponse.json({ message: "Delete deleted" }, { status: 200 });
    }
    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser/${user.id}`;
    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) throw new Error("Cant delete");

    return NextResponse.json({ message: "Delete deleted" }, { status: 200 });
  } catch (error) {
    console.error("error", error);
  }
}
