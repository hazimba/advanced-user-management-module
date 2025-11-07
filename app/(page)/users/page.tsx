"use client";
import { User } from "@/app/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchData } from "@/lib/queries/shared";
import {
  Briefcase,
  DeleteIcon,
  Edit2Icon,
  Mail,
  Phone,
  Shield,
  Trash2Icon,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [openModal, setOpenModal] = useState<boolean>();
  const [isDeleting, setIsDeleting] = useState<boolean>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [checkboxClicked, setCheckboxClicked] = useState<string[]>([]);
  const { isPending, error, data } = useFetchData(
    "users",
    page,
    17,
    debouncedSearch
  );

  console.log("checkboxClicked", checkboxClicked);

  const handleCheckboxClick = (userId: string, checked: boolean) => {
    setCheckboxClicked((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  // if (!data) {
  //   return <>No data available</>;
  // }
  return (
    <div className="p-4 min-w-7xl gap-3 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <Input
          className="w-50"
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search User..."
        />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex gap-4">
              <NavigationMenuLink asChild>
                {/* <Link className="flex flex-row items-center"> */}
                <Button
                  onClick={() =>
                    toast("Clicked", {
                      description: "Mantap",
                      action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                      },
                    })
                  }
                >
                  Add New User
                </Button>
                {/* </Link> */}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Popover>
                <PopoverTrigger>
                  {checkboxClicked.length > 0 && (
                    <Trash2Icon className="cursor-pointer size-4" />
                  )}
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  className="flex gap-2 font-2 text-2"
                >
                  <p className="font-2 text-xs">
                    Are you sure want to delete the selected checkbox
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      console.log("delete", checkboxClicked);
                      toast("Deleted the selected from checkbox");
                    }}
                  >
                    Yes
                  </Button>
                </PopoverContent>
              </Popover>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="">Phone</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={isPending ? `` : `border-1`}>
          {data && data?.length ? (
            data?.map((user: User) => (
              <TableRow
                className="w-screen"
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  setOpenModal(true);
                }}
              >
                <TableCell
                  onClick={(e) => e.stopPropagation()}
                  className="w-[10%]"
                >
                  <Checkbox
                    onCheckedChange={(checked) =>
                      handleCheckboxClick(user.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell className="w-[40%]">{user.name}</TableCell>
                <TableCell className="">{user.phoneNumber}</TableCell>
                <TableCell
                  className="flex justify-end gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit2Icon className="cursor-pointer size-4" />
                  <Popover>
                    <PopoverTrigger>
                      <Trash2Icon
                        className="cursor-pointer size-4"
                        onClick={() => console.log("user.id", user.id)}
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      side="left"
                      className="flex gap-2 font-2 text-2"
                    >
                      <p className="font-2 text-xs flex flex-col gap-2">
                        Are you sure want to delete the selected checkbox user:
                        <p className="font-bold">{`${user.name}`}</p>
                      </p>
                      <Button
                        className="flex justify-end items-end h-full"
                        variant="destructive"
                        onClick={() => {
                          console.log("user.id", user.id);
                          toast("Deleted the selected from checkbox");
                        }}
                      >
                        Yes
                      </Button>
                    </PopoverContent>
                    {/* <PopoverDeleteButton
                      data={employee}
                      refetch={refetch}
                      setIsDeleting={setIsDeleting}
                      entity="users"
                    /> */}
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent className="flex justify-end">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <span className="flex items-center px-4">Page {page}</span>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => p + 1)}
              className={
                !data || data.length < 10
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="lg:space-y-3">
            <DialogTitle className="lg:text-2xl">User Details</DialogTitle>
            <DialogDescription>
              View complete user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="lg:mt-6 space-y-4">
              <Image
                src={selectedUser.avatar}
                height={200}
                width={200}
                alt=""
              />
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-200 hover:bg-slate-100 transition-colors">
                <UserIcon className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Name
                  </p>
                  <p className="text-sm text-slate-900 font-medium truncate">
                    {selectedUser.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-200 hover:bg-slate-100 transition-colors">
                <Mail className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-sm text-slate-900 truncate">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-200 hover:bg-slate-100 transition-colors">
                <Phone className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-sm text-slate-900">
                    {selectedUser.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-200 hover:bg-slate-100 transition-colors">
                <Shield className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {selectedUser.active ? "Active" : "Not Active"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-200 hover:bg-slate-100 transition-colors">
                <Briefcase className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Role
                  </p>
                  <p className="text-sm text-slate-900 font-medium">
                    {selectedUser.role}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose
              asChild
              onClick={() => {
                setOpenModal(false);
                // setSelectedUser(null);
              }}
            >
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default UsersPage;
