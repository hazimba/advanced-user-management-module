import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    console.log("received id from request", id);

    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${id}`;
    console.log("url", url);

    // Example: actually call mockapi to delete
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete from mockapi");

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
  } catch (error) {
    console.log("error", error);
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
