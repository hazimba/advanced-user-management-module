import { useQuery } from "@tanstack/react-query";

export const useFetchData = (
  entity: string,
  page: number,
  limit: number,
  search: string,
  selectInput: string
) => {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: [entity, page, search, selectInput],
    queryFn: async () => {
      const url = new URL(
        `https://690c9788a6d92d83e84e61f2.mockapi.io/api/v1/${entity}`
      );

      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
      };

      if (search) params.search = search;
      if (selectInput) params.role = selectInput;

      url.search = new URLSearchParams(params).toString();

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${entity}`);
      const data = await res.json();

      return Array.isArray(data) ? data : [];
    },
  });
  return { isPending, error, data, refetch };
};
