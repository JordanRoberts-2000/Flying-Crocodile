import Icon from "@/components/Icon";
import { Separator } from "@radix-ui/react-separator";

const CategorySelection = ({}) => {
  return (
    <>
      <div className="flex px-2 text-xs my-4 gap-2 items-center">
        <div className="py-1 px-4 rounded-full bg-black text-white outline outline-1 outline-black font-semibold">
          Public
        </div>
        <div className="py-1 px-4 rounded-full bg-white outline outline-1 outline-gray-300 font-semibold">
          Inspo
        </div>
        <div className="py-1 px-4 rounded-full bg-white outline outline-1 outline-gray-300 font-semibold">
          Flying Crocodile
        </div>
        <div className="aspect-square h-[90%] rounded-full flex items-center justify-center text-base bg-white outline outline-1 outline-gray-300 font-semibold">
          <Icon name="plus" className="size-3" />
        </div>
      </div>
      <Separator
        orientation="horizontal"
        className="w-[calc(100%-16px)] mx-auto mb-4 h-px bg-gray-300"
      />
    </>
  );
};

export default CategorySelection;
