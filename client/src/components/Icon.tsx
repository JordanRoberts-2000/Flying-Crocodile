import { cn } from "@/lib/utils";
import PlusIcon from "../assets/svgs/plus.svg?react";
import ArrowIcon from "../assets/svgs/arrow.svg?react";
import BinIcon from "../assets/svgs/bin.svg?react";
import EditIcon from "../assets/svgs/edit.svg?react";
import FolderIcon from "../assets/svgs/folder.svg?react";
import UserIcon from "../assets/svgs/user.svg?react";
import PhotoIcon from "../assets/svgs/photo.svg?react";
import FolderPlusIcon from "../assets/svgs/folderPlus.svg?react";
import CloseIcon from "../assets/svgs/close.svg?react";

type name =
  | "plus"
  | "bin"
  | "edit"
  | "folder"
  | "arrow"
  | "folderPlus"
  | "user"
  | "photo"
  | "close";

type Props = {
  name: name;
} & React.SVGAttributes<SVGElement>;

const Icon = ({ name, className, ...rest }: Props) => {
  switch (name) {
    case "plus":
      return (
        <PlusIcon {...rest} className={cn("size-5 shrink-0", className)} />
      );
    case "arrow":
      return (
        <ArrowIcon {...rest} className={cn("size-5 shrink-0", className)} />
      );
    case "bin":
      return <BinIcon {...rest} className={cn("size-5 shrink-0", className)} />;
    case "edit":
      return (
        <EditIcon {...rest} className={cn("size-5 shrink-0", className)} />
      );
    case "folder":
      return (
        <FolderIcon {...rest} className={cn("size-5 shrink-0", className)} />
      );
    case "folderPlus":
      return (
        <FolderPlusIcon
          {...rest}
          className={cn("size-5 shrink-0", className)}
        />
      );
    case "photo":
      return (
        <PhotoIcon {...rest} className={cn("size-5 shrink-0", className)} />
      );
    case "user":
      return (
        <UserIcon {...rest} className={cn("size-5 shrink-0", className)} />
      );
    case "close":
      return (
        <CloseIcon {...rest} className={cn("size-5 shrink-0", className)} />
      );
  }
};

export default Icon;
