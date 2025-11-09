"use client";
import { User } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CornerDownLeft, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FormSchema } from "../users/page";

const PermissionPage = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [recoverLoading, setRecoverLoading] = useState<boolean>(false);

  const { isPending, refetch, data } = useQuery({
    queryKey: ["deletedUser"],
    queryFn: async () => {
      const res = await fetch("/api/deleted");
      if (!res.ok) throw new Error("Unable to get deleteduser");

      return res.json();
    },
  });

  const mutationDelPerm = useMutation({
    mutationFn: async (data: FormSchema) => {
      const res = await fetch("/api/delete-perm", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      console.log("json", json);

      if (!res.ok) {
        throw new Error(json.message || "Error occured");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedUser"] });
      toast.success("Success delete permanently");
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormSchema) => {
      const res = await fetch("/api/deleted", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setRecoverLoading(false);
        throw new Error(json.message || "Error occured");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("All user successfully recover");
      queryClient.invalidateQueries({ queryKey: ["deletedUser"] });
      setRecoverLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRecoverAll = async (data: User[]) => {
    setRecoverLoading(true);
    await mutation.mutateAsync(data);
  };

  return (
    <div className="max-h-screen h-120 flex flex-col justify center p-4 gap-3">
      <div className="flex w-full justify-end gap-3">
        <Button
          disabled={recoverLoading}
          variant="outline"
          className="cursor-pointer"
          onClick={() => handleRecoverAll(data)}
        >
          {recoverLoading ? "Recovering..." : "Recover All"}
        </Button>
        <Button
          disabled={loading}
          className="cursor-pointer"
          variant="destructive"
          onClick={async () => {
            setLoading(true);
            await mutationDelPerm.mutateAsync(data);
          }}
        >
          {loading ? "Deleting..." : "Delete All"}
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your recent deleted users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">NAME</TableHead>
            <TableHead>PHONE NO</TableHead>
            <TableHead className="text-left">EMAIL</TableHead>
            <TableHead>ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isPending ? (
            <>
              {data?.map((du: User, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{du.name}</TableCell>
                  <TableCell>{du.phoneNumber}</TableCell>
                  <TableCell className="text-left">{du.email}</TableCell>
                  <TableCell className="text-right flex gap-4">
                    <CornerDownLeft
                      className="cursor-pointer"
                      size={"15"}
                      onClick={async () => {
                        await mutationDelPerm.mutateAsync(du);
                      }}
                    />
                    <Trash
                      className="cursor-pointer"
                      size={"15"}
                      onClick={async () => {
                        try {
                          await fetch("/api/delete-perm", {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(du),
                          });
                          refetch();
                          toast(`User is delete permenantly`);
                        } catch (error) {
                          console.error("error", error);
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow></TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
export default PermissionPage;
