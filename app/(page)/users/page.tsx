"use client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ImageUploadForm } from "@/components/file-upload";
import { PhoneInput } from "@/components/phone-input";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { handleFileSelect } from "@/hooks/handleFileSelect";
import { useUserStore } from "@/hooks/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  DatabaseZap,
  DownloadIcon,
  Edit2Icon,
  Fingerprint,
  Mail,
  Phone,
  PlusIcon,
  Shield,
  Trash2Icon,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

enum Role {
  admin = "admin",
  user = "user",
  guest = "guest",
}

const formSchema = z.object({
  uuid: z.any(),
  name: z.string().optional(), // .min(2, "min 2 char").max(50),
  avatar: z.string().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(Role, "select one role").optional(),
  bio: z.string(), // .min(1, "add bio").max(500),
  id: z.string().optional(),
  createdAt: z.any().optional(),
  active: z.string().optional(),
  email: z.string().optional(), // email("invalid email"),
});

export type FormSchema = z.infer<typeof formSchema>;

interface FormCreateEditUserProps {
  form: UseFormReturn<FormSchema>;
  loading: boolean;
  setLoading: (arg0: boolean) => void;
  openCreateUser: boolean;
  setOpenCreateUser: (arg0: boolean) => void;
  selectedEditUser?: User;
  setSelectedEditUser: (arg0: User | undefined) => void;
}

const FormCreateEditUser = ({
  form,
  loading,
  setLoading,
  openCreateUser,
  setOpenCreateUser,
  selectedEditUser,
  setSelectedEditUser,
}: FormCreateEditUserProps) => {
  const [file, setFile] = useState<File | null>(null);
  const setEntity = useUserStore().setEntity;
  const router = useRouter();

  const queryClient = useQueryClient();

  const mutationEditCreate = useMutation({
    mutationFn: async (value: FormSchema) => {
      const res = await fetch("/api/users", {
        method: selectedEditUser ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      if (!res.ok) throw new Error("Failed to save user, user not found");
      return res.json();
    },
    onSuccess: () => {
      toast.success(
        `User ${selectedEditUser ? "update" : "created"} successfully`
      );
      // same as refetch but this can be call inside mutation if dont have refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
      // setOpenCreateUser(false);
      setSelectedEditUser(undefined);
      setLoading(false);
      form.reset({
        name: "",
        active: "",
        avatar: "",
        phoneNumber: "",
        email: "",
        role: undefined,
        bio: "",
        id: "",
        createdAt: "",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit = async (value: FormSchema) => {
    try {
      setLoading(true);

      if (file) {
        const imageUrl = await handleFileSelect(
          "user-image",
          file ? ([file] as unknown as FileList) : null,
          form
        );
        if (imageUrl) {
          value = { ...value, avatar: imageUrl };
        }
      }
      await mutationEditCreate.mutateAsync(value);
      setEntity("Update");
      router.push(`/users/${value.id}`);
      setOpenCreateUser(false);
      setLoading(false);
      form.reset({});
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    if (selectedEditUser) {
      form.reset({
        ...selectedEditUser,
        role: selectedEditUser.role as Role,
      });
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
              name="uuid"
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
              name="avatar"
              render={({}) => {
                return (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <ImageUploadForm setFile={setFile} form={form} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
                    {/* <Input placeholder="Enter phone number..." {...field} /> */}
                    <PhoneInput {...field} />
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
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full" {...field}>
                        <SelectValue placeholder="Select a status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit">
              {loading ? <Spinner /> : selectedEditUser ? "Edit" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const UsersPage = () => {
  const queryClient = useQueryClient();
  const setEntity = useUserStore().setEntity;
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [openModal, setOpenModal] = useState<boolean>();
  const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectInput, setSelectInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [checkboxClicked, setCheckboxClicked] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEditUser, setSelectedEditUser] = useState<User>();
  const [popoverBulkDelete, setPopoverBulkDelete] = useState<boolean>();
  const [expandBio, setExpandBio] = useState<boolean>(false);

  const [popoverDeleteOne, setPopoverDeleteOne] = useState<boolean>(false);
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["users", page, debouncedSearch, selectInput],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: "14",
      });

      if (debouncedSearch) params.append("name", debouncedSearch);
      if (selectInput) params.append("role", selectInput);

      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) throw new Error("Unable to fetch data");

      const json = await res.json();
      return Array.isArray(json) ? json : [];
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      active: "",
      avatar: "",
      phoneNumber: "",
      email: "",
      role: undefined,
      bio: "",
      id: "",
      createdAt: "",
    },
  });

  const permDeleteRef = useRef<boolean>(true);
  const [permDelete, setPermDelete] = useState<boolean>(true);
  const [mutateData, setMutateData] = useState<boolean>(false);

  const mutationDelete = useMutation({
    mutationFn: async (user: FormSchema) => {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return res.json();
    },
    onSuccess: () => {
      toast.success(
        <div className="flex">
          <div>User is removed successfully</div>
        </div>
      );
      setPopoverDeleteOne(false);
      setLoading(false);
      setPopoverBulkDelete(false);
      setCheckboxClicked([]);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
      setPopoverDeleteOne(false);
      setLoading(false);
      setPopoverBulkDelete(false);
      setCheckboxClicked([]);
      refetch();
    },
  });

  useEffect(() => {
    permDeleteRef.current = permDelete;
  }, [permDelete]);

  const handleDeleteUser = async (user: string[] | string) => {
    setPermDelete(true);

    toast.info(
      <div className="flex items-center w-full justify-between gap-3 text-sm">
        <span className="text-foreground">Removing selected user...</span>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 py-1 text-xs"
          onClick={() => {
            return setPermDelete(false);
          }}
        >
          Undo
        </Button>
      </div>,
      { duration: 5000 }
    );

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (!permDeleteRef.current) {
        toast.success("Successfully not proceed to delete");
        setCheckboxClicked([]);
        setLoading(false);
        return;
      }
      setPermDelete(true);

      if (permDelete) {
        setEntity("Delete");
        // @ts-expect-error: no care
        mutationDelete.mutateAsync(user);
      }
    } catch (error) {
      console.error("error", error);
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

  const handleCheckAll = (checked: boolean, allUsers: any) => {
    setCheckboxClicked(checked ? allUsers : []);
  };

  const dataMutation = useMutation({
    mutationFn: async (data: User) => {
      const res = await fetch("/api/edit-data", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Unable to mutate data");

      return res.json();
    },
    onSuccess: () => {
      setMutateData(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Data mutated");
    },
    onError: (error) => {
      toast.error(`Error mutate data: ${error.message}`);
    },
  });

  const handleDataRefresh = async (data: User) => {
    setMutateData(true);
    await dataMutation.mutateAsync(data);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchInput]);

  if (error) return <p>Error loading data</p>;

  const handleExportCSV = (data: User[]) => {
    if (!data) return;
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const csvOutput = XLSX.write(workbook, {
      bookType: "csv",
      type: "array",
    });

    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "data.csv");
  };

  return (
    <div className="p-4 gap-3 flex flex-col ">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-col justify-start md:flex-row">
          <Input
            className="w-50 text-sm"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            placeholder="Search user..."
          />
          <Select
            onValueChange={(value) => setSelectInput(value)}
            value={selectInput}
          >
            <SelectTrigger className="w-50">
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
          <div className="flex w-full items-center md:justify-start justify-between gap-4">
            <Button
              onClick={() => {
                setDebouncedSearch("");
                setSearchInput("");
                setSelectInput("");
              }}
            >
              Clear Filter
            </Button>
            {!mutateData ? (
              <DatabaseZap
                className="cursor-pointer"
                onClick={() => {
                  if (data?.length < 1) {
                    toast.error("No data available to mutate, kindly add one");
                  } else {
                    handleDataRefresh(data);
                  }
                }}
              />
            ) : (
              <Spinner />
            )}
            <DownloadIcon className="" onClick={() => handleExportCSV(data)} />
          </div>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex gap-4">
              <NavigationMenuLink asChild>
                {/* <Link className="flex flex-row items-center"> */}
                <Button>
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
        <TableCaption>A list of users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="flex items-center gap-3">
              <Checkbox
                checked={checkboxClicked?.length === data?.length}
                onCheckedChange={(checked) => {
                  handleCheckAll(!!checked, data);
                }}
              />
              <Popover
                open={popoverBulkDelete}
                onOpenChange={setPopoverBulkDelete}
              >
                <PopoverTrigger>
                  {checkboxClicked.length > 0 && !loading ? (
                    <Trash2Icon className="cursor-pointer size-4" />
                  ) : loading ? (
                    <Spinner />
                  ) : (
                    <></>
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
                    {checkboxClicked?.map((i: User, index) => {
                      return (
                        <div className="font-bold" key={index}>
                          {i.name}
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => {
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
          {data ? (
            data?.map((user: User, index) => (
              <TableRow
                className="w-screen"
                key={index}
                onClick={() => {
                  setSelectedUser(user);
                  setOpenModal(true);
                }}
              >
                <TableCell
                  onClick={(e) => e.stopPropagation()}
                  className="w-[10%] align-left"
                >
                  <div key={index} className="flex items-center space-x-2 ml-0">
                    <Checkbox
                      checked={checkboxClicked.some(
                        (u: User | any) => u.id === user.id
                      )}
                      onCheckedChange={(checked) =>
                        handleCheckboxClick(user, !!checked)
                      }
                    />
                  </div>
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
        openCreateUser={openCreateUser}
        setOpenCreateUser={setOpenCreateUser}
        selectedEditUser={selectedEditUser}
        setSelectedEditUser={setSelectedEditUser}
      />
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-xl max-h-[600px] overflow-auto">
          <DialogHeader className="lg:space-y-3">
            <DialogTitle className="lg:text-2xl">User Details</DialogTitle>
            <DialogDescription>
              View complete user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="lg:mt-6 space-y-4 truncate">
              {selectedUser.avatar ? (
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
              )}
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
                <CalendarPlus className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Created At
                  </div>
                  <div className="text-sm text-slate-900 font-medium">
                    {dayjs(selectedUser?.createdAt).format("DD-MM-YY")}
                  </div>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg bg-slate-200 hover:bg-slate-100 transition-colors ${
                  expandBio ? "h-50" : ""
                }`}
              >
                <Fingerprint className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Bio
                  </p>
                  <p
                    className={`text-sm text-slate-900 font-medium ${
                      expandBio ? "text-wrap" : "truncate"
                    }`}
                  >
                    {selectedUser.bio}
                  </p>
                </div>
                <div>
                  {expandBio && selectedUser.bio.length > 20 ? (
                    <ChevronUp onClick={() => setExpandBio(false)} />
                  ) : selectedUser.bio.length > 20 ? (
                    <ChevronDown onClick={() => setExpandBio(true)} />
                  ) : (
                    <></>
                  )}
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
