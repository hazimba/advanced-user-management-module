import { NextResponse } from "next/server";
import _ from "lodash";

export async function GET(request: Request) {
  try {
    const url = `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Unable to fetch data");
    const data = await res.json();

    const groupByRole = _.groupBy(data, "role");
    const groupByActive = _.groupBy(data, "active");
    const groupByDate = _.groupBy(data, "createdAt");

    const returnData = {
      role: groupByRole,
      active: groupByActive,
      date: groupByDate,
    };

    return Response.json(returnData);
  } catch (error) {
    return NextResponse.json(
      { message: "Unsuccessfully fetch data" },
      { status: 400 }
    );
  }
}
