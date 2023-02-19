import Link from "next/link";
import React from "react";
import CircularProgress from "@/pages/circularProgress";

const HeaderSection = ({
  query,
  loading,
}: {
  query?: string;
  loading: boolean;
}) => {
  return (
    <div className="mb-16">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl my-4 font-medium">
          <Link href="/">Title browser</Link>
        </h1>
        <div className="flex">
          <form method="get" action="/">
            <input
              type="text"
              name="q"
              defaultValue={query || ""}
              placeholder="Search term..."
              className="rounded py-2 px-4 text-xl w-96 text-gray-900 border border-gray-200 focus:outline-none"
            />
          </form>
          <div className="">
            {loading && (
              <CircularProgress
                text=""
                className="py-3 border border-gray-200 rounded-r-md rounded-l-none -ml-1"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
