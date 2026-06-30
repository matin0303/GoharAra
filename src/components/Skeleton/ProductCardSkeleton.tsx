export default function ProductCardSkeleton() {
    return (
      <div className="select-none relative min-w-55 max-w-60 max-sm:max-w-70 h-70 flex justify-center items-end shadow-md/30 rounded-2xl mb-1 bg-gray-100 animate-pulse">
        <div className="w-full flex justify-center items-center flex-col z-20">
          {/* Image skeleton */}
          <div className="relative w-full">
            <div className="overflow-hidden h-60 w-full aspect-square object-cover rounded-t-2xl bg-gray-200" />
            {/* Title skeleton */}
            <div className="absolute top-0 left-0 w-full h-[60px] rounded-t-2xl px-3 flex justify-end items-center">
              <div className="h-4 w-24 bg-gray-300/50 rounded ml-auto"></div>
            </div>
          </div>
  
          <div className="w-full flex justify-center items-center duration-500 transition-all">
            {/* Button section skeleton */}
            <div className="BTN w-full flex items-end justify-start">
              <div className="flex bg-gray-200 justify-center items-center h-10 rounded-2xl rounded-tl-none rounded-br-none w-12">
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
              </div>
              <div className="w-3 h-3 bg-gray-200 rounded-tr-full">
                <div className="w-full h-full bg-gray-100 rounded-bl-full border-l-4 border-solid border-white"></div>
              </div>
            </div>
  
            {/* Price skeleton */}
            <div className="w-full flex justify-center items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }