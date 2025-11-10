"use client";
import CustomActiveShapePieChart from "@/components/doughnut-chart";
import Example from "@/components/line-graph";
import PieChartWithCustomizedLabel from "@/components/pie-chart";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const AnalyticsPage = () => {
  const [roleClick, setRoleClick] = useState<string>("guest");
  const [activeClick, setActiveClick] = useState<string>("active");
  const { isPending, data, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");

      if (!res.ok) throw new Error("Unable to fetch data");

      return res.json();
    },
  });

  if (error) return <>Error fetch data...</>;
  if (isPending) return <>Loading...</>;

  const { active, role, date } = data;

  const seggData = role
    ? Object.entries(role).map(([role, users]) => ({
        name: role,
        // @ts-expect-error:nocare
        value: users?.length,
      }))
    : [];

  const seggActive = active
    ? Object.entries(active).map(([active, users]) => ({
        name: active,
        // @ts-expect-error:nocare
        value: users?.length,
      }))
    : [];

  const seggDate = date
    ? Object.entries(date)
        .map(([date, users]) => ({
          name: date,
          // @ts-expect-error:nocare
          pv: users?.length,
        }))
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.name.split("-").map(Number);
          const [dayB, monthB, yearB] = b.name.split("-").map(Number);

          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);

          // @ts-expect-error:nocare
          return dateA - dateB;
        })
    : [];

  return (
    <div className="w-screen px-4 flex justify-center">
      <Tabs defaultValue="role" className="max-w-7xl w-full py-2">
        <TabsList>
          <TabsTrigger value="role">Role</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
        </TabsList>
        <TabsContent value="role" className="w-full">
          <Card className="md:h-[600px]">
            <CardHeader>
              <CardTitle>Role</CardTitle>
              <CardDescription>Pie chart of User Role</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-5 grid-cols-1 items-center h-full">
              <div className="col-span-3 w-full align-center text-center flex items-center justify-center">
                <PieChartWithCustomizedLabel data={seggData} />
              </div>
              <div className="col-span-2 flex flex-col justify-center space-y-3">
                {seggData.map((i) => (
                  <Button
                    key={i.name}
                    variant={roleClick === i.name ? "default" : "outline"}
                    className="flex justify-between items-center border rounded-md"
                    onClick={() => setRoleClick(i.name)}
                  >
                    <span className="font-medium capitalize">{i.name}</span>
                    <span className="">{i.value}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          <Card className="md:h-[600px]">
            <CardHeader>
              <CardTitle>Active</CardTitle>
              <CardDescription>Pie chart of User Status</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-5 grid-cols-1 items-center h-full">
              <div className="col-span-3 w-full align-center text-center flex items-center justify-center">
                <CustomActiveShapePieChart data={seggActive} />
              </div>
              <div className="col-span-2 flex flex-col justify-center space-y-3">
                {seggActive.map((i) => (
                  <Button
                    key={i.name}
                    variant={activeClick === i.name ? "default" : "outline"}
                    className="flex justify-between items-center border rounded-md"
                    onClick={() => setActiveClick(i.name)}
                  >
                    <span className="font-medium capitalize">{i.name}</span>
                    <span className="">{i.value}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="registration">
          <Card className="md:h-[600px]">
            <CardHeader>
              <CardTitle>User Registration</CardTitle>
              <CardDescription>User registration over time</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-5 grid-cols-1 items-center h-full">
              <div className="col-span-3 w-full align-center text-center flex items-center justify-center">
                <Example data={seggDate} />
              </div>
              <div className="col-span-2 flex flex-col justify-center space-y-3">
                {seggDate.map((i) => (
                  <Button
                    key={i.name}
                    variant={activeClick === i.name ? "default" : "outline"}
                    className="flex justify-between items-center border rounded-md"
                    onClick={() => setActiveClick(i.name)}
                  >
                    <span className="font-medium capitalize">{i.name}</span>
                    <span className="">{i.pv}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AnalyticsPage;
