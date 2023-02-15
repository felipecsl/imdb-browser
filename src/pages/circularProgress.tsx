import React from "react";
import { isEmpty } from "lodash";

export type CircularProgressProps = {
  text?: string;
  className?: string;
};
const CircularProgress = ({
  text = "Loading...",
  className,
}: CircularProgressProps) => (
  <div
    className={`bg-gray-900 inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white transition ease-in-out duration-150 cursor-not-allowed ${className}`}
  >
    <svg
      className={`animate-spin h-5 w-5 text-white ${
        !isEmpty(text) ? "-ml-1 mr-3" : ""
      }`}
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    {text}
  </div>
);
export default CircularProgress;
