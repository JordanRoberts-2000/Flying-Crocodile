import { DialogContent } from "@/components/ui/dialog";

const AdminLoginDialog = ({}) => {
  return (
    <DialogContent className="w-fit rounded-md">
      <div className="flex flex-col justify-center items-center">
        <svg
          className="size-12 mb-3"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="1.5"
            d="M8 10V7c0-2.21 1.79-4 4-4s4 1.79 4 4v3m-4 5a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 0v3m-5.4-8h10.8c.88 0 1.6.72 1.6 1.6v7c0 1.32-1.08 2.4-2.4 2.4H7.4C6.08 21 5 19.92 5 18.6v-7c0-.88.72-1.6 1.6-1.6"
          />
        </svg>
        <h3 className="text-xl font-semibold">Sign in as admin</h3>
        <p className="text-sm text-gray-600">
          welcome back! please sign in to continue
        </p>
        <div className="flex gap-4 mt-4">
          <a
            href="api/auth/github"
            className="flex-1 pr-10 border border-gray-300 flex gap-4 rounded-md shadow px-3 py-1 font-semibold"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              />
            </svg>
            GitHub
          </a>
          <button className="flex-1 pr-10 items-center border border-gray-300 flex gap-4 rounded-md shadow px-3 py-1 font-semibold">
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47c-1.34.03-1.77-.79-3.29-.79c-1.53 0-2 .77-3.27.82c-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51c1.28-.02 2.5.87 3.29.87c.78 0 2.26-1.07 3.81-.91c.65.03 2.47.26 3.64 1.98c-.09.06-2.17 1.28-2.15 3.81c.03 3.02 2.65 4.03 2.68 4.04c-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5c.13 1.17-.34 2.35-1.04 3.19c-.69.85-1.83 1.51-2.95 1.42c-.15-1.15.41-2.35 1.05-3.11"
              />
            </svg>
            Apple
          </button>
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminLoginDialog;
