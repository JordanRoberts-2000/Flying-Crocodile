import { HTMLAttributes, PropsWithChildren, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const logoutRequest = async () => {
  const response = await fetch("/auth/logout", {
    method: "POST",
    credentials: "include", // Include cookies in the request
  });

  if (!response.ok) {
    throw new Error("Failed to log out");
  }
};

const LogoutButton = ({
  children,
}: PropsWithChildren & HTMLAttributes<HTMLButtonElement>) => {
  const queryClient = useQueryClient();
  const [isDisabled, setIsDisabled] = useState(false);

  const { mutateAsync: logout } = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      // Invalidate or reset the admin status query
      queryClient.invalidateQueries({ queryKey: ["adminCheck"] });
    },
  });

  const handleLogout = async () => {
    setIsDisabled(true);
    try {
      await logout();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <button disabled={isDisabled} onClick={handleLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
