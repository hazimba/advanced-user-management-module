"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/hooks/user-store";
import { MoveLeft } from "lucide-react";

const IdPage = () => {
  const router = useRouter();
  const entity = useUserStore().entity;
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const url = new URL(
        `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/users/${id}`
      );

      const res = await fetch(url);
      if (!res.ok) throw new Error("failed to fetch");

      return res.json();
    },
    enabled: !!id,
  });

  return (
    <div className="w-screen text-wrap px-4 flex flex-col gap-10">
      <div className="flex gap-10">
        <MoveLeft
          className="cursor-pointer"
          onClick={() => {
            router.push("/users");
          }}
        />
        <div>User {entity} Successfully</div>
      </div>
      <pre className="!w-142 text-wrap">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
export default IdPage;
