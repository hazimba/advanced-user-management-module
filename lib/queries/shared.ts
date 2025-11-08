import { useQuery } from "@tanstack/react-query";

export const useFetchData = (
  entity: string,
  page: number,
  limit: number,
  search: string
) => {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: [entity, page, search],
    queryFn: async () => {
      const url = new URL(
        `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/${entity}`
      );
      url.search = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
      }).toString();

      const res = await fetch(url);
      const data = await res.json();

      return data;
    },
  });
  return { isPending, error, data, refetch };
};
