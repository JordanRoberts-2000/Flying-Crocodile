import { useQuery } from "@tanstack/react-query";

export const fetchAdminStatus = async () => {
  const response = await fetch("/auth/adminCheck", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin status");
  }

  const data = await response.json();

  if (!data) {
    throw new Error("Failed to parse json");
  }

  return data.admin;
};

export const useAdminStatus = () => {
  return useQuery({
    queryKey: ["adminStatus"],
    queryFn: fetchAdminStatus,
    refetchOnMount: false,
  });
};
