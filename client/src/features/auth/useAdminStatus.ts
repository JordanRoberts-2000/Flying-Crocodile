import { GRAPHQL_BASE_URL } from "@/constants";
import { AdminCheckQuery } from "@/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import { gql, GraphQLClient } from "graphql-request";

const ADMIN_CHECK_QUERY = gql`
  query AdminCheck {
    adminCheck {
      admin {
        login
        name
        email
        avatarUrl
      }
    }
  }
`;

export const fetchAdminStatus = async () => {
  const graphQLClient = new GraphQLClient(GRAPHQL_BASE_URL, {
    credentials: `include`,
    mode: `cors`,
  });

  const data = await graphQLClient.request<AdminCheckQuery>(ADMIN_CHECK_QUERY);

  if (!data) {
    throw new Error("Failed to fetch admin status");
  }

  return data.adminCheck.admin;
};

export const useAdminStatus = () => {
  return useQuery({
    queryKey: ["adminStatus"],
    queryFn: fetchAdminStatus,
    refetchOnMount: false,
  });
};
