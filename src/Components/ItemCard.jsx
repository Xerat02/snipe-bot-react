function ItemCard({ data }) {
  // Formátování času a kontrola aktuality
  const isDataFresh = () => {
    if (!data?.inserted_time) return false;

    const updateTime = new Date(data.inserted_time);
    const now = new Date();
    return now - updateTime < 5 * 60 * 1000;
  };

  // Získání textu o stáří dat
  function getDataAgeText() {
    if (!data?.inserted_time) return "No data available";

    const updateTime = new Date(data.inserted_time);
    const now = new Date();
    const diffSec = Math.floor((now - updateTime) / 1000);

    if (diffSec < 60)
      return `Created ${diffSec} second${diffSec === 1 ? "" : "s"} ago`;
    if (diffSec < 3600)
      return `Created ${Math.floor(diffSec / 60)} minute${
        diffSec / 60 < 2 ? "" : "s"
      } ago`;
    if (diffSec < 86400)
      return `Created ${Math.floor(diffSec / 3600)} hour${
        diffSec / 3600 < 2 ? "" : "s"
      } ago`;

    const days = Math.floor(diffSec / 86400);
    return `Created ${days} day${days === 1 ? "" : "s"} ago`;
  }

  // Určení rizika
  const getRiskLevel = (risk) => {
    if (risk == 0) return { text: "Low", color: "bg-green-500" };
    if (risk == 1) return { text: "Medium", color: "bg-yellow-500" };
    return { text: "High", color: "bg-red-500" };
  };

  const risk = getRiskLevel(data.market_risk_factor);

  return (
    <div className="card bg-base-100 w-full h-full flex flex-col rounded-lg overflow-hidden hover:scale-105 transition-shadow relative">
      {/* Pulsující tečka v levém rohu */}
      <div className="absolute top-2 left-2 z-10">
        <span className="relative flex">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
              isDataFresh() ? "bg-green-500" : "bg-red-500"
            } opacity-75`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-4 w-4 ${
              isDataFresh() ? "bg-green-500" : "bg-red-500"
            }`}
            title={getDataAgeText()}
          ></span>
        </span>
      </div>

      {/* Logo marketu v pravém rohu */}
      {data.market_logo && (
        <div className="absolute top-2 right-2 z-10">
          <img
            src={data.market_logo}
            alt={data.market_name}
            className="w-6 h-6 object-contain"
          />
        </div>
      )}

      {/* Obrázek itemu */}
      <div className="relative pt-[70%] bg-gray-800">
        <img
          src={data.buff_item_image}
          alt={data.item_name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300";
            e.target.className =
              "absolute top-0 left-0 w-full h-full object-cover";
          }}
        />
      </div>

      {/* Obsah karty */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Název a stav */}
        <div className="mb-2">
          <h3 className="font-semibold text-sm line-clamp-2">
            {data.item_name}
          </h3>
        </div>

        {/* Risk faktor */}
        <div className="flex items-center mb-2">
          <span className={`w-3 h-3 rounded-full ${risk.color} mr-2`}></span>
          <span className="text-xs">
            {risk.text} ({data.buff_item_sell_num} on sale)
          </span>
        </div>

        {/* Ceny a profit */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div>
            <p className="text-xs text-gray-500">Buff</p>
            <p className="font-bold text-sm">${data.buff_price?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Market</p>
            <p className="font-bold text-sm">
              ${data.market_price?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Potential Profit</p>
            <p className="font-bold text-green-600 text-sm">
              $
              {Array.isArray(data.profit)
                ? data.profit[0]?.toFixed(2)
                : data.profit?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Discount</p>
            <p className="font-bold text-red-600 text-sm">
              {data.buff_discount?.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Tlačítka */}
        <div className="flex space-x-2 mt-4">
          <a
            href={data.buff_item_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-xs flex-1"
          >
            Buff
          </a>
          <a
            href={data.market_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-xs flex-1"
          >
            Buy
          </a>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
