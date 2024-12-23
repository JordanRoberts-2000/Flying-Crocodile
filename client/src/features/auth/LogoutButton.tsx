import { HTMLAttributes, PropsWithChildren, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const logoutRequest = async () => {
  const response = await fetch("api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to log out");
  }
};

const LogoutButton = ({
  children,
  ...rest
}: PropsWithChildren & HTMLAttributes<HTMLButtonElement>) => {
  const queryClient = useQueryClient();
  const [isDisabled, setIsDisabled] = useState(false);

  const { mutateAsync: logout } = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStatus"] });
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
    <button {...rest} disabled={isDisabled} onClick={handleLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
