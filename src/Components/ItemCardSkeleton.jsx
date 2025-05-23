function ItemCardSkeleton() {
  return (
    <div className="card bg-base-100 rounded-lg overflow-hidden">
      <div className="skeleton h-64 w-full"></div> {/* Obrázek */}
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4"></div> {/* Název */}
        <div className="skeleton h-4 w-1/2"></div> {/* Stav */}
        <div className="skeleton h-4 w-full"></div> {/* Risk faktor */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="space-y-1">
              <div className="skeleton h-4 w-3/4"></div> {/* Label */}
              <div className="skeleton h-6 w-full"></div> {/* Hodnota */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemCardSkeleton;
