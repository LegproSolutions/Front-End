const SkelatonJobCard = () => {
  return (
    Array(9).fill(0).map((item) => (

      <div className="border border-gray-200 p-4 shadow-sm rounded-lg transition-all duration-300 hover:shadow-lg bg-white flex flex-col h-full">
        {/* Company Logo & Title */}
        <div className="flex justify-between w-full  items-start mb-3">
          <div className="flex items-center">
            <div className="h-14 w-14 rounded-md bg-gray-300 flex items-center justify-center overflow-hidden  animate-pulse border-gray-200">

            </div>
            <div className="ml-3 flex flex-col gap-1  animate-pulse w-48 ">
              <div className="h-4 w-auto rounded-full  bg-gray-300"></div>
              <div className="h-4 w-auto rounded-full  bg-gray-300"></div>
              {/* <p className="text-xs text-gray-500">hbfh</p> */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 my-2 animate-pulse">
          <div className="flex gap-1 items-center text-xs a text-gray-600">
            {/* <MapPin className="w-3 h-3 mr-1 text-gray-500" /> */}
            <div className="rounded-full h-4 w-4 bg-gray-300"></div>
            {/* <span className="truncate">hjbfh</span> */}
            <div className="h-4 w-[90px] rounded-full bg-gray-300"></div>
          </div>
          <div className="flex gap-1 items-center text-xs text-gray-600">
            <div className="rounded-full h-4 w-4 bg-gray-300"></div>

            <div className="h-4 gap-1 w-[90px] rounded-full bg-gray-300"></div>
            {/* <span className="truncate">hjbf</span> */}
          </div>
          <div className="flex gap-1 items-center text-xs text-gray-600">
            <div className="rounded-full h-4 w-4 bg-gray-300"></div>
            <div className="h-4 w-[90px] rounded-full bg-gray-300"></div>
          </div>
          <div className="flex gap-1 items-center text-xs text-gray-600">
            <div className="rounded-full h-4 w-4 bg-gray-300"></div>
            <div className="h-4 w-[90px] rounded-full bg-gray-300"></div>
          </div>
          <div className="flex gap-1 items-center text-xs text-gray-600">
            <div className="rounded-full h-4 w-4 bg-gray-300"></div>
            <div className="h-4 w-[90px] rounded-full bg-gray-300"></div>
          </div>


        </div>
        <div className="flex flex-wrap flex-col gap-1 w-full my-2 animate-pulse">
          <div className="h-4 w-full rounded-full bg-gray-300"></div>
          <div className="h-4 w-full rounded-full bg-gray-300"></div>

        </div>

        <div className="mt-auto pt-2 flex flex-row gap-2 ">
          <div className="flex-1 rounded-full  bg-gray-300"></div>
          <div className="flex-1 rounded-full  bg-gray-300"></div>
        </div>
      </div>

    ))

  )
};
export default SkelatonJobCard;
