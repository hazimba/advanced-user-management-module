import { NextResponse } from "next/server";
import _ from "lodash";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const to = searchParams.get("to");
    const from = searchParams.get("from");

    const url = `https://691a9cf52d8d7855756f6c32.mockapi.io/users`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Unable to fetch data");
    const data = await res.json();

    let filterData = data;
    if (to && from) {
      filterData = data.filter((user: any) => {
        const created = dayjs(user.createdAt, "DD-MM-YYYY");
        return (
          created.isSameOrAfter(dayjs(from, "DD-MM-YYYY")) &&
          created.isSameOrBefore(dayjs(to, "DD-MM-YYYY"))
        );
      });
    }

    const groupByRole = _.groupBy(data, "role");
    const groupByActive = _.groupBy(data, "active");
    const groupByDate = _.groupBy(filterData, "createdAt");

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
