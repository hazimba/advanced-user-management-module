import { User } from "@/app/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await request.json();
    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error("Failed to delete from mockapi");
  } catch (error) {
    console.error("error", error);
  }
}

// delete from deletedUser and recover to users collection
export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    const id = data.id;

    console.log("data123", data);

    if (Array.isArray(data)) {
      await Promise.all(
        data.map(async (dt: User) => {
          // deletedUser collection
          const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser/${dt.id}`;

          await fetch(url, { method: "DELETE" });
        })
      );

      await Promise.all(
        data.map(async (dt: User) => {
          // user collection
          const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users`;

          await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dt),
          });
        })
      );

      return NextResponse.json({
        message: "Successfully recover all deleted user to user collection",
      });
    }

    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser/${id}`;
    const res = await fetch(url, { method: "DELETE" });

    const resRec = await fetch(
      `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!resRec.ok) throw new Error("Unable to recover to user collection");

    if (!res.ok) throw new Error("Error delete deleted user");

    return NextResponse.json(
      { message: "Success delete deleted user" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
  }
}
