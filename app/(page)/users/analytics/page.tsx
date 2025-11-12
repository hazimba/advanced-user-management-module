"use client";
import CustomActiveShapePieChart from "@/components/doughnut-chart";
import Example from "@/components/line-graph";
import PieChartWithCustomizedLabel from "@/components/pie-chart";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar1 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";

interface FormSchema {
  dateRange: {
    from: Date;
    to: Date;
  };
}

const AnalyticsPage = () => {
  const form = useForm();
  const [roleClick, setRoleClick] = useState<string>("guest");
  const [activeClick, setActiveClick] = useState<number>(0);
  const [filterDate, setFilterDate] = useState<{
    fromDate: string;
    toDate: string;
  }>({
    fromDate: "7-01-2025",
    toDate: "10-01-2025",
  });
  const { data, isPending, error } = useQuery({
    queryKey: ["users", filterDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterDate.fromDate) params.append("from", filterDate.fromDate);
      if (filterDate.toDate) params.append("to", filterDate.toDate);

      const res = await fetch(`/api/analytics?${params.toString()}`);
      if (!res.ok) throw new Error("Unable to fetch analytics data");
      return res.json();
    },
    enabled: !!(filterDate.fromDate && filterDate.toDate), // only fetch if both dates set
  });

  if (error) return <>{error.message}</>;
  if (isPending)
    return (
      <div className="px-4">
        <Spinner />
      </div>
    );

  const { active, role, date } = data;

  const seggData = role
    ? Object.entries(role).map(([role, users]) => ({
        name: role,
        // @ts-expect-error:notsure
        value: users?.length,
      }))
    : [];

  const seggActive = active
    ? Object.entries(active).map(([active, users]) => ({
        name: active,
        // @ts-expect-error:notsure
        value: users?.length,
      }))
    : [];

  const seggDate = date
    ? Object.entries(date)
        .map(([date, users]) => ({
          name: date,
          // @ts-expect-error:notsure
          registration: users?.length,
        }))
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.name.split("-").map(Number);
          const [dayB, monthB, yearB] = b.name.split("-").map(Number);

          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);

          // @ts-expect-error:notsure
          return dateA - dateB;
        })
    : [];

  const onSubmit: SubmitHandler<FormSchema> = async (value: FormSchema) => {
    const toDate = dayjs(value?.dateRange.to).format("DD-MM-YYYY");
    const fromDate = dayjs(value.dateRange.from).format("DD-MM-YYYY");

    setFilterDate({ toDate: toDate, fromDate: fromDate });
  };

  return (
    <div className="w-screen px-4 flex justify-center">
      <Tabs defaultValue="role" className="max-w-7xl w-full py-2">
        <div className="flex items-center gap-4">
          <Link href="/users">
            <ArrowLeft />
          </Link>
          <TabsList>
            <TabsTrigger value="role">Role</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="role" className="w-full">
          <Card className="md:h-[600px]">
            <CardHeader>
              <CardTitle>Role</CardTitle>
              <CardDescription>Pie chart of User Role</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-5 grid-cols-1 items-center h-full">
              <div className="col-span-3 w-full align-center text-center flex items-center justify-center">
                <PieChartWithCustomizedLabel
                  data={seggData}
                  roleClick={roleClick}
                />
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
                <CustomActiveShapePieChart
                  data={seggActive}
                  activeClick={activeClick}
                  setActiveClick={setActiveClick}
                />
              </div>
              <div className="col-span-2 flex flex-col justify-center space-y-3">
                {seggActive.map((i, index) => (
                  <Button
                    key={i.name}
                    variant={activeClick === index ? "default" : "outline"}
                    className="flex justify-between items-center border rounded-md"
                    onClick={() => setActiveClick(index)}
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
          <Card className="md:min-h-[600px] md:h-full">
            <CardHeader>
              <CardTitle>User Registration</CardTitle>
              <CardDescription>User registration over time</CardDescription>
              <Dialog>
                <DialogTrigger>
                  <Calendar1 />
                </DialogTrigger>
                <DialogContent className="!w-auto !max-w-fit p-6">
                  <DialogTitle className="mb-4">Filter Date</DialogTitle>
                  <Form {...form}>
                    <form
                      className="flex flex-col gap-2"
                      // @ts-expect-error:typeerrornoidea
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="dateRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Calendar</FormLabel>
                            <FormControl>
                              <Calendar
                                mode="range"
                                defaultMonth={field.value?.from}
                                selected={field.value}
                                onSelect={(range) => field.onChange(range)}
                                numberOfMonths={2}
                                className="rounded-lg border shadow-sm bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="" type="submit">
                        Filter
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid md:grid-cols-5 grid-cols-1 items-center h-full">
              <div className="col-span-3 w-full align-center text-center flex items-center justify-center">
                <Example data={seggDate} />
              </div>
              <div className="col-span-2 flex flex-col justify-center space-y-3">
                {seggDate.map((i) => (
                  <Button
                    key={i.name}
                    variant={"outline"}
                    className="flex justify-between items-center border rounded-md"
                    // onClick={() => setActiveClick(i.name)}
                  >
                    <span className="font-medium capitalize">{i.name}</span>
                    <span className="">{i.registration}</span>
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
