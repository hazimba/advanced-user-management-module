"use client";
import { User } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CornerDownLeft, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FormSchema } from "../users/page";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const mutationRestore = useMutation({
    mutationFn: async (data: FormSchema) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Error occured");
      }

      return res.json();
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["deletedUser"] });
      toast.success("Success restore");
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  const mutationDelPerm = useMutation({
    mutationFn: async (data: FormSchema) => {
      const res = await fetch("/api/delete-perm", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Error occured");
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
    if (data?.length < 1) {
      toast.error("No data to recover");
    } else {
      setRecoverLoading(true);
      // @ts-expect-error:notsure
      await mutation.mutateAsync(data);
    }
  };

  return (
    <div className="max-h-screen h-186 w-screen flex flex-col items-center p-4">
      <div className="max-w-7xl w-full md:px-4 px-2 flex justify-center flex-col">
        <div className="pb-4 font-semibold tracking-widest flex items-center">
          DELETED USERS PAGE -
        </div>
        <div className="flex w-full justify-between gap-3 pb-4">
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
              if (data?.length < 1) {
                return toast.error("No data to delete pemanently");
              } else {
                setLoading(true);
                await mutationDelPerm.mutateAsync(data);
              }
            }}
          >
            {loading ? "Deleting..." : "Delete All"}
          </Button>
        </div>
        <Table>
          <TableCaption>A list of recent deleted users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">NAME</TableHead>
              <TableHead>PHONE NO</TableHead>
              <TableHead className="text-left">EMAIL</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data?.length > 0 ? (
              <>
                {data?.map((du: User[] | any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{du.name}</TableCell>
                    <TableCell>{du.phoneNumber}</TableCell>
                    <TableCell className="text-left">{du.email}</TableCell>
                    <TableCell className="text-right flex gap-4">
                      <Tooltip>
                        <TooltipContent>Recover {`${du.name}`}</TooltipContent>
                        <TooltipTrigger asChild>
                          <CornerDownLeft
                            className="cursor-pointer"
                            size={"15"}
                            onClick={async () => {
                              await mutationRestore.mutateAsync(du);
                              await mutationDelPerm.mutateAsync(du);
                            }}
                          />
                        </TooltipTrigger>
                      </Tooltip>
                      <Tooltip>
                        <TooltipContent>
                          Permanantly delete {`${du.name}`}
                        </TooltipContent>
                        <TooltipTrigger asChild>
                          <Trash
                            className="cursor-pointer"
                            size={"15"}
                            onClick={async () => {
                              await mutationDelPerm.mutateAsync(du);
                            }}
                          />
                        </TooltipTrigger>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : isPending ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No data to display
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default PermissionPage;
