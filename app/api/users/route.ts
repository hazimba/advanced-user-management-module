import { User } from "@/app/types";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const user = await request.json();

    if (Array.isArray(user)) {
      await Promise.all(
        user.map(async (i: User) => {
          const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${i.id}`;

          const res = await fetch(url, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete from mockapi");
        })
      );

      await Promise.all(
        user.map(async (i: User) => {
          const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser`;

          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(i),
          });

          if (!res.ok)
            throw new Error("Failed to patch users to deletedUser collection");
        })
      );

      return NextResponse.json(
        { message: "Successful delete users and patch users to deletedUser" },
        { status: 200 }
      );
    }

    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${user.id}`;
    const urlDel = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser`;

    const res = await fetch(url, { method: "DELETE" });

    const resDel = await fetch(urlDel, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error("Failed to delete from mockapi");
    if (!resDel.ok) throw new Error("Failed to delete from mockapi");

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("error deleting user", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await request.json();
    console.log("user", user);

    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        createdAt: Date.now(),
      }),
    });

    if (!res.ok) throw new Error("Failed to create user");

    return NextResponse.json(
      { message: "Success Create User" },
      { status: 200 }
    );
  } catch (error) {
    console.error("error", error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await request.json();

    const { id, ...updateData } = user;
    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${id}`;
    console.log("Updating user with ID:", id, "with data:", updateData);

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error("Failed to edit user");

    return NextResponse.json(
      { message: "Success update user" },
      { status: 200 }
    );
  } catch (error) {
    console.error("error", error);
  }
}

export async function GET() {
  try {
    const users = await fetch(
      `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users`
    );

    return NextResponse.json(users);
  } catch (error) {
    console.log("error", error);
  }
}
