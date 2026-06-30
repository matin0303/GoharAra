export default function ArticleCardSkeleton() {
    return (
      <div className="group transition-all w-full h-full rounded-sm shadow-lg border-1 border-gray-200 animate-pulse">
        {/* Image skeleton */}
        <div className="overflow-hidden">
          <div className="aspect-video object-cover object-center rounded-t-sm bg-gray-200"></div>
        </div>
        
        <div className="p-3">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          
          {/* Description skeleton - دو خط */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
  
          {/* Bottom section skeleton */}
          <div className="w-full flex justify-between items-center mt-3">
            {/* Date skeleton */}
            <div className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
  
            {/* Stats skeleton */}
            <div className="flex justify-end items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }