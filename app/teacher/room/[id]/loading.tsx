export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-24 h-8 flex items-center">
            <div className="w-6 h-6 bg-purple-200 animate-pulse rounded-full"></div>
            <div className="w-16 h-4 bg-purple-200 animate-pulse rounded ml-2"></div>
          </div>
          <div className="h-8 w-64 bg-purple-700 bg-opacity-20 animate-pulse rounded-md"></div>
        </div>

        {/* Info Card */}
        <div className="w-full bg-white rounded-xl p-6 shadow-sm mb-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Questions */}
            <div className="space-y-2">
              <div className="w-24 h-5 bg-purple-100 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100"></div>
                <div className="w-32 h-5 bg-gray-100 rounded"></div>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="w-24 h-5 bg-purple-100 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100"></div>
                <div className="w-32 h-5 bg-gray-100 rounded"></div>
              </div>
            </div>

            {/* Room Code */}
            <div className="space-y-2">
              <div className="w-24 h-5 bg-purple-100 rounded"></div>
              <div className="w-full h-10 bg-purple-50 rounded-md"></div>
            </div>
          </div>

          {/* Resume Button */}
          <div className="mt-6">
            <div className="w-full h-12 bg-green-50 border border-green-100 rounded-md"></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <div className="w-28 h-10 bg-purple-100 animate-pulse rounded-t-md mr-2"></div>
          <div className="w-28 h-10 bg-gray-100 animate-pulse rounded-t-md mr-2"></div>
          <div className="w-28 h-10 bg-gray-100 animate-pulse rounded-t-md"></div>
        </div>

        {/* Student Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="w-48 h-7 bg-purple-100 animate-pulse rounded"></div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-5 bg-gray-100 rounded"></div>
              <div className="w-24 h-8 bg-purple-100 rounded-md"></div>
              <div className="w-24 h-8 bg-gray-100 rounded-md"></div>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-16 gap-2 mb-4 border-b pb-2">
            <div className="col-span-3 w-full h-6 bg-purple-50 rounded"></div>
            <div className="col-span-1 w-full h-6 bg-purple-50 rounded"></div>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="col-span-1 w-full h-6 bg-purple-50 rounded"
              ></div>
            ))}
          </div>

          {/* Table Rows */}
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-16 gap-2 py-4 border-b"
            >
              <div className="col-span-3 w-full h-6 bg-gray-100 rounded"></div>
              <div className="col-span-1 w-full h-6 bg-blue-100 rounded"></div>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="col-span-1 w-8 h-8 mx-auto rounded-full bg-gray-100"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
