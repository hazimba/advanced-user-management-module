import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `https://691a9cf52d8d7855756f6c32.mockapi.io/deletedUser`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Error");
    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    console.error(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await request.json();
    const url = `https://691a9cf52d8d7855756f6c32.mockapi.io/deletedUser`;

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

    if (Array.isArray(data)) {
      for (const dt of data) {
        const url = `https://691a9cf52d8d7855756f6c32.mockapi.io/deletedUser/${dt.id}`;
        const res = await fetch(url, { method: "DELETE" });

        if (res.ok) {
          const postUrl = `https://691a9cf52d8d7855756f6c32.mockapi.io/users`;
          await fetch(postUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dt),
          });
        } else {
          console.warn(`Failed to delete deletedUser with id: ${dt.id}`);
        }
      }

      return NextResponse.json(
        { message: "Successfully restored users" },
        { status: 200 }
      );
    }

    const url = `https://691a9cf52d8d7855756f6c32.mockapi.io/deletedUser/${id}`;
    const res = await fetch(url, { method: "DELETE" });

    const resRec = await fetch(
      `https://691a9cf52d8d7855756f6c32.mockapi.io/users`,
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
