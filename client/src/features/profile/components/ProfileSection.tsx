import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AdminLoginDialog from "./AdminLoginDialog";
import { useAdminStatus } from "@/features/auth/useAdminStatus";
import LogoutButton from "@/features/auth/LogoutButton";

const ProfileSection = ({}) => {
  const { data: admin } = useAdminStatus();
  console.log(admin);
  return (
    <div className="bg-neutral-50 p-3 flex">
      {admin ? (
        <div className="flex gap-4">
          <img
            src={admin.avatar_url}
            className="bg-green-50 size-10 rounded-full shadow"
          ></img>
          <div>
            <p className="">{admin.login}</p>
            <LogoutButton className="text-xs border border-gray-200 px-2 rounded-md py-0.5">
              Log out
            </LogoutButton>
          </div>
        </div>
      ) : (
        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <button className="border border-gray-300 border-1 px-2 py-1 rounded-lg text-sm font-semibold">
                Sign in as admin
              </button>
            </DialogTrigger>
            <AdminLoginDialog />
          </Dialog>
        </div>
      )}
      <div className="ml-auto flex gap-4 mr-12 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProfileSection;
