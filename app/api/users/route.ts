// import { User } from "@/app/types";
import dayjs from "dayjs";
import { sortBy } from "lodash";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function DELETE(request: Request) {
  try {
    const user = await request.json();

    if (Array.isArray(user)) {
      for (const u of user) {
        const urlDel = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/deletedUser`;
        const resDel = await fetch(urlDel, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(u),
        });
        if (!resDel.ok) throw new Error("error posting to deletedUser");

        const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${u.id}`;
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) throw new Error("error deleting user");
      }

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

    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        uuid: uuidv4(),
        createdAt: dayjs(Date.now()).format("DD-MM-YYYY"),
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

    const { id } = user;
    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${id}`;

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("name");
  const limit = searchParams.get("limit") || "14";
  const role = searchParams.get("role");
  const orderName = searchParams.get("orderName");

  const url = new URL(
    "https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users"
  );

  const params: Record<string, string> = {
    page,
    limit,
    sortBy: "name",
    order: orderName === "true" ? "asc" : "desc",
  };
  if (search) params.search = search;
  if (role) params.role = role;
  url.search = new URLSearchParams(params).toString();

  const res = await fetch(url);
  const data = await res.json();

  return Response.json(data || []);
}
