export default function ShoppingCardSkeleton() {
    return (
      <div className="w-full h-50 max-md:h-auto flex justify-center items-center border-gray-200 border-t-1 max-md:flex-col animate-pulse">
        <div className="flex justify-between items-center w-full p-5">
          <div className="flex flex-col justify-center items-center gap-1">
            {/* Product image skeleton */}
            <div className="w-30 h-30 rounded-lg bg-gray-200"></div>
            {/* View link skeleton */}
            <div className="h-6 w-24 bg-gray-200 rounded-sm mt-1"></div>
          </div>
  
          <div className="pr-5 flex flex-col w-full gap-2">
            {/* Title skeleton */}
            <div className="flex justify-start items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-40"></div>
            </div>
  
            {/* Weight skeleton */}
            <div className="flex justify-start items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-48"></div>
            </div>
  
            {/* Price skeleton */}
            <div className="flex justify-start items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-36"></div>
            </div>
  
            {/* Supplier skeleton */}
            <div className="flex justify-start items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col max-md:flex-row justify-start items-start mt-2 h-full max-md:w-full ml-5 gap-2">
          {/* Delete button skeleton */}
          <div className="flex justify-center max-md:justify-start items-center w-full py-2 max-md:px-5">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
  
          {/* Weight controls skeleton */}
          <div className="w-full rounded-sm border-1 max-w-25 border-gray-100 flex flex-col max-md:flex-row justify-between items-center p-2">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-4 w-8 bg-gray-200 rounded mx-2"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }