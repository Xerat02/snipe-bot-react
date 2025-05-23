import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SnipeFilter from "./Components/SnipeFilter";
import ItemCard from "./Components/ItemCard";
import ItemCardSkeleton from "./Components/ItemCardSkeleton";
import ErrorMessage from "./Components/ErrorMessage";
import { fetchData } from "./tools/Api";
import addNotification from "react-push-notification";

function Snipes() {
  const endpoints = [
    "https://api.csbay.org/snipes",
    "https://api.csbay.org/stats/market",
  ];
  const [oldData, setOldData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    buff_discount: 0,
    min_price: 0,
    max_price: 9999999 ?? "",
    risk_factor: -1,
    market: "",
  });
  const [notification, setNotification] = useState(false);
  let items = [];
  const intervalRef = useRef(null);

  const fetchOldData = async () => {
    if (!hasMore) return;
    const new_data = await fetchData(endpoints[0], filters, page);
    if (!new_data) {
      setError("Failed to fetch data. Please try again later.");
      return;
    }
    if (new_data.length === 0) {
      setHasMore(false);
      return;
    }
    setOldData((prev) => [...prev, ...new_data]);
    setPage(page + 1);
  };

  const fetchNewData = async () => {
    const new_data = await fetchData(endpoints[0], filters, 1);
    if (!new_data) {
      setError("Failed to fetch data. Please try again later.");
      return;
    }
    if (new_data.length === 0) {
      return;
    }
    new_data.forEach((item) => {
      if (notification) {
        if (!items.includes(item._id)) {
          addNotification({
            title: "New snipe found!",
            subtitle: item._id,
            message: `New snipe found for ${item.market_name} with a discount of ${item.buff_discount}%`,
            theme: "darkblue",
            native: true,
            icon: item.buff_item_image,
          });
          items.push(item._id);
        }
      }
    });

    setNewData(new_data);
  };

  // Use effects
  useEffect(() => {
    intervalRef.current = setInterval(fetchNewData, 3000);
    return () => clearInterval(intervalRef.current);
  }, [filters]);

  useEffect(() => {
    setPage(1);
    setOldData([]);
    setOldData([]);
    setHasMore(true);
    fetchNewData();
    fetchOldData();
  }, [filters]);

  if (error) return <ErrorMessage message={error} />;
  return (
    <>
      <SnipeFilter
        onFilterChange={(newFilters, notify) => {
          setNotification(notify);
          setFilters(newFilters);
        }}
      />
      <div className="text-center sticky top-0 z-20 bg-base-200 py-3">
        The latest Snipes
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {newData.length !== 0
          ? newData.map((item, index) => (
              <ItemCard key={`${item._id}-${index}`} data={item} />
            ))
          : [...Array(8)].map((_, i) => (
              <ItemCardSkeleton key={`new_data_skeleton${i}`} />
            ))}
      </div>
      <div className="text-center sticky top-0 z-20 bg-base-200 py-3">
        Older Snipes
      </div>
      <InfiniteScroll
        dataLength={oldData.length}
        next={fetchOldData}
        hasMore={hasMore}
        loader={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {[...Array(8)].map((_, i) => (
              <ItemCardSkeleton key={`old_data_skeleton${i}`} />
            ))}
          </div>
        }
        endMessage={
          <div role="alert" className="alert alert-warning my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>No more data to display!</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 overflow-y-hidden">
          {oldData.length !== 0
            ? oldData.map((item, index) => (
                <ItemCard key={`${item._id}-${index}`} data={item} />
              ))
            : null}
        </div>
      </InfiniteScroll>
    </>
  );
}

export default Snipes;
