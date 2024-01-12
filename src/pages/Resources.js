import React from "react";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const navigate = useNavigate();

  return (
    <>
      <div class="m-12">
        <p class="text-2xl mb-6 font-bold">Resources</p>

        <div class="grid justify-items-stretch grid-cols-3  gap-5 font-bold">
          <div class="card bg-yellow-100 text-sm w-48 h-32 items-center justify-center mb-6">
            <button onClick={() => navigate("courseform")}>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
          <div class="card bg-pink-300 text-sm w-48 h-32 items-center justify-center mb-6">
            <button> Resource 6</button>
          </div>
          <div class="card bg-green-600 text-sm w-48 h-32 items-center justify-center mb-6">
            <button>Resource 5</button>
          </div>
          <div class="card bg-blue-300 text-sm w-48 h-32 items-center justify-center mb-6">
            <button>Resource 4</button>
          </div>
          <div class="card bg-yellow-300 text-sm w-48 h-32  items-center justify-center mb-6">
            <button> Resource 3</button>
          </div>
          <div class="card bg-orange-500 text-sm w-48 h-32  items-center justify-center mb-6">
            <button> Resource 2</button>
          </div>
          <div class="card bg-gray-400 text-sm w-48 h-32 items-center justify-center">
            <button> Resource 1</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resources;
