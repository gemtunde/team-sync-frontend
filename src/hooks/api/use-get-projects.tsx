import { getProjectsInWorkspaceQueryFn } from "@/lib/api";
import { AllProjectPayloadType } from "@/types/api.type";
import { CustomError } from "@/types/custom-error.types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useGetProjectsInWorkspaceQuery = ({
  workspaceId,
  pageNumber,
  pageSize,
  skip = false,
}: AllProjectPayloadType) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = useQuery<any, CustomError>({
    queryKey: ["allProjects", workspaceId, pageNumber, pageSize],
    queryFn: () =>
      getProjectsInWorkspaceQueryFn({ workspaceId, pageNumber, pageSize }),
    staleTime: Infinity,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });
  return query;
};

export default useGetProjectsInWorkspaceQuery;
