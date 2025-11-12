"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/hooks/user-store";
import { MoveLeft } from "lucide-react";
import Image from "next/image";

const IdPage = () => {
  const router = useRouter();
  const entity = useUserStore().entity;
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(
        `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${id}`
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-4">Loading user...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Failed to load user.</div>;

  const user = data;

  return (
    <div className="w-screen min-h-screen px-4 py-10 flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <MoveLeft
          className="cursor-pointer hover:text-blue-500 transition-colors"
          onClick={() => router.push("/users")}
        />
        <div className="text-lg font-semibold">User Update Successfully</div>
      </div>

      <div className="flex flex-col sm:flex-row items-start w-full sm:items-center gap-6 dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
        <Image
          src={user.avatar}
          alt={user.name}
          width={200}
          height={100}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-2 text-gray-800 dark:text-gray-100">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.role}
          </p>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {user.phoneNumber}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {user.active}
          </div>
          <div>
            <span className="font-semibold">Bio:</span> {user.bio || "—"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Created at: {user.createdAt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdPage;
