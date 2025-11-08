"use client";
import { User } from "@/app/types";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Edit2Icon,
  Mail,
  Phone,
  PlusIcon,
  Shield,
  Trash2Icon,
  User as UserIcon,
} from "lucide-react";
// import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

enum Role {
  admin = "admin",
  user = "user",
  guest = "guest",
}

const formSchema = z.object({
  name: z.string().min(2, "min 2 char").max(50),
  avatar: z.string().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(Role, "select one role"),
  bio: z.string().min(1, "add bio"),
  id: z.string(),
  createdAt: z.any(),
  active: z.boolean(),
  email: z.email("invalid email"),
});

export type FormSchema = z.infer<typeof formSchema>;

interface FormCreateEditUserProps {
  form: UseFormReturn<FormSchema>;
  loading: boolean;
  setLoading: (arg0: boolean) => void;
  refetch: () => void;
  openCreateUser: boolean;
  setOpenCreateUser: (arg0: boolean) => void;
  selectedEditUser?: User;
  setSelectedEditUser: (arg0: User | undefined) => void;
}

const FormCreateEditUser = ({
  form,
  loading,
  setLoading,
  refetch,
  openCreateUser,
  setOpenCreateUser,
  selectedEditUser,
  setSelectedEditUser,
}: FormCreateEditUserProps) => {
  const onSubmit = async (value: FormSchema) => {
    console.log(value);

    try {
      setLoading(true);
      const res = await fetch("/api/users", {
        method: selectedEditUser ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      console.log("res.status", res.status);
      const data = await res.json();
      console.log("message:", data.message);
      setOpenCreateUser(false);
      setLoading(false);
      refetch();
      form.reset();
      toast(
        <div className="flex w-full justify-center items-center font-bold">
          User created successfully
        </div>
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (selectedEditUser) {
      form.reset({
        ...selectedEditUser,
        role: selectedEditUser.role as Role,
      });
    } else if (!selectedEditUser) {
      form.reset({});
    }
  }, [openCreateUser, selectedEditUser, form]);

  return (
    <Dialog
      open={openCreateUser}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset({});
          setSelectedEditUser(undefined);
        }
        setOpenCreateUser(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {!selectedEditUser ? "Create User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>id</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter id..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full" {...field}>
                        <SelectValue placeholder="Select a role..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="guest">Guest</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter avatar..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit">
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [openModal, setOpenModal] = useState<boolean>();
  const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
  // const [isDeleting, setIsDeleting] = useState<boolean>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [checkboxClicked, setCheckboxClicked] = useState<string[]>([]);
  // const [deleteOneUser, setDeleteOneUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEditUser, setSelectedEditUser] = useState<User>();
  const [popoverBulkDelete, setPopoverBulkDelete] = useState<boolean>();
  // const [openModalEditUser, setOpenModalEditUser] = useState<boolean>();

  const [popoverDeleteOne, setPopoverDeleteOne] = useState<boolean>(false);
  const { isPending, error, data, refetch } = useFetchData(
    "users",
    page,
    14,
    debouncedSearch
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      active: true,
      avatar: "",
      phoneNumber: "",
      email: "",
      role: undefined,
      bio: "",
      id: "",
    },
  });

  const handleDeleteUser = async (user: string | string[]) => {
    try {
      setLoading(true);
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      console.log("message", data.message);

      if (res.ok) {
        console.log("User deleted successfully!");
      } else {
        console.error("Error deleting user:", data.message);
      }
      setPopoverDeleteOne(false);
      toast(`User is removed successfully`);
      setLoading(false);
      setPopoverBulkDelete(false);
      setCheckboxClicked([]);
      refetch();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCheckboxClick = (user: User, checked: boolean) => {
    // @ts-expect-error:no care
    setCheckboxClicked((prev) => {
      if (checked) {
        return [...prev, user];
      } else {
        // @ts-expect-error:no care
        return prev.filter((u: User) => u.id !== user.id);
      }
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchInput]);

  if (error) return <p>Error loading data</p>;

  return (
    <div className="p-4 gap-3 flex flex-col justify-between">
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
                  className=""
                  // onClick={() =>
                  //   toast("Clicked", {
                  //     description: "Mantap",
                  //     action: {
                  //       label: "Undo",
                  //       onClick: () => console.log("Undo"),
                  //     },
                  //   })
                  // }
                >
                  <span
                    className="block md:hidden"
                    onClick={() => {
                      setOpenCreateUser(true);
                    }}
                  >
                    <PlusIcon />
                  </span>
                  <span
                    className="hidden md:block"
                    onClick={() => {
                      setOpenCreateUser(true);
                    }}
                  >
                    Add New User
                  </span>
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
              <Popover
                open={popoverBulkDelete}
                onOpenChange={setPopoverBulkDelete}
              >
                <PopoverTrigger>
                  {checkboxClicked.length > 0 && (
                    <Trash2Icon className="cursor-pointer size-4" />
                  )}
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  className="flex flex-col gap-2 font-2"
                >
                  <div className="font-2 text-xs">
                    <div className="pb-4">
                      Are you sure want to delete the selected checkbox?
                    </div>
                    {/* @ts-expect-error:no care  */}
                    {checkboxClicked.map((i: User, index) => {
                      return (
                        <div className="font-bold" key={i.id}>
                          {index + 1}. {i.name}
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      console.log("delete", checkboxClicked);
                      handleDeleteUser(checkboxClicked);
                      setPopoverBulkDelete(false);
                    }}
                  >
                    {loading ? "Deleting..." : "Yes"}
                  </Button>
                </PopoverContent>
              </Popover>
            </TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="hidden md:table-cell">PHONE</TableHead>
            <TableHead className="text-right">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={isPending ? `` : ``}>
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
                      handleCheckboxClick(user, !!checked)
                    }
                  />
                </TableCell>
                <TableCell className="md:w-[30%] max-w-[120px] truncate">
                  {user.name}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.phoneNumber}
                </TableCell>
                <TableCell
                  className="flex justify-end gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit2Icon
                    className="cursor-pointer size-4"
                    onClick={() => {
                      setSelectedEditUser(user);
                      setOpenCreateUser(true);
                    }}
                  />
                  <Popover
                    // @ts-expect-error:if-not-will-render-all
                    open={popoverDeleteOne === user.id}
                    onOpenChange={(isOpen) =>
                      // @ts-expect-error:if-not-will-render-all
                      setPopoverDeleteOne(isOpen ? user.id : null)
                    }
                  >
                    <PopoverTrigger>
                      <Trash2Icon
                        className="cursor-pointer size-4"
                        onClick={() => setPopoverDeleteOne(true)}
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      side="left"
                      className="flex flex-col gap-2 font-2 text-2"
                    >
                      <div className="font-2 text-xs flex flex-col gap-2">
                        Are you sure want to delete the selected checkbox user:
                        <div className="font-bold">{`${user.name}`}</div>
                      </div>
                      <Button
                        className="flex"
                        variant="destructive"
                        disabled={loading}
                        onClick={() => {
                          // @ts-expect-error:no care
                          handleDeleteUser(user);
                        }}
                      >
                        {loading ? "Deleting..." : "Yes"}
                      </Button>
                    </PopoverContent>
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
      <FormCreateEditUser
        form={form}
        loading={loading}
        setLoading={setLoading}
        refetch={refetch}
        openCreateUser={openCreateUser}
        setOpenCreateUser={setOpenCreateUser}
        selectedEditUser={selectedEditUser}
        setSelectedEditUser={setSelectedEditUser}
      />
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
              {/* {selectedUser.avatar ? (
                <Image
                  src={
                    selectedUser.avatar
                      ? selectedUser.avatar
                      : "https://avatars.githubusercontent.com/u/31102952"
                  }
                  height={200}
                  width={200}
                  alt=""
                />
              ) : (
                <></>
              )} */}
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
                  <p className="text-sm text-slate-900 truncate md:w-100 w-40">
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
