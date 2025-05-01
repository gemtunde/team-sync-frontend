import { getWorkspaceByIdQueryFn } from "@/lib/api";
import { CustomError } from "@/types/custom-error.types";
import { useQuery } from "@tanstack/react-query";

const useGetWorkspaceQuery = (workspaceId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = useQuery<any, CustomError>({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 0,
    retry: 2,
    enabled: !!workspaceId,
  });
  return query;
};

export default useGetWorkspaceQuery;
