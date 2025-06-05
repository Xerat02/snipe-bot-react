import { useState, useEffect } from "react";
import "././styles.css";
import {
  BarChart,
  Bar,
  Legend,
  Tooltip,
  Rectangle,
  CartesianGrid,
  YAxis,
  XAxis,
  Treemap,
} from "recharts";
import GraphCard from "./Components/GraphCard";
import GraphCardsContainer from "./Components/GraphCardsContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import ErrorMessage from "./Components/ErrorMessage";
import { fetchData } from "./tools/Api";

function Stats() {
  const endpoints = [
    "https://api.csbay.org/stats/all",
    "https://api.csbay.org/stats/busyness",
    "https://api.csbay.org/stats/skins",
    "https://api.csbay.org/stats/market",
    "https://api.csbay.org/stats/market-age-histogram",
  ];
  const [allStats, setAllStats] = useState(null);
  const [hourStats, setHourStats] = useState([]);
  const [skinsStats, setSkinsStats] = useState([]);
  const [skinsPage, setSkinsPage] = useState(1);
  const [skinsHasMore, setSkinsHasMore] = useState(true);
  const [skinsFilter, setSkinsFilter] = useState({ order: "desc" });
  const [marketStats, setMarketStats] = useState([]);
  const [histoData, setHistoData] = useState([]);
  const [treemapData, setTreemapData] = useState([]);
  const [activeMarket, setActiveMarket] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllStats = async () => {
    // allStats
    const allStats = await fetchData(endpoints[0]);
    if (!allStats) {
      setError("Failed to fetch all stats");
      return;
    }
    setAllStats(allStats[0]);
    // hourStats
    const hourStats = await fetchData(endpoints[1]);
    if (!hourStats) {
      setError("Failed to fetch hour stats");
      return;
    }
    setHourStats(hourStats);
    // marketStats
    const marketStats = await fetchData(endpoints[3]);
    if (!marketStats) {
      setError("Failed to fetch market stats");
      return;
    }
    let ar = [];
    for (let i = 0; i < marketStats.length; i++) {
      const TreemapData = {
        name: marketStats[i]._id,
        size: marketStats[i].count,
      };
      ar.push(TreemapData);
    }
    setTreemapData(ar);
    setMarketStats(marketStats);
    fetchHistoData(marketStats[activeMarket]._id);

    // skinsStats
    const skinsStats = await fetchData(endpoints[2], skinsFilter, 1);
    if (!skinsStats) {
      setError("Failed to fetch skins stats");
      return;
    }
    setSkinsStats(skinsStats);
    setLoading(false);
  };

  const fetchHistoData = async (marketName) => {
    const data = await fetchData(endpoints[4], {
      market_name: marketName,
      max_lookback_days: 15,
    });

    if (!data) {
      setError("Failed to fetch histogram data");
      return;
    }

    setHistoData(data);
    console.log("Histogram data:", data);
  };

  const loadFilteredSkins = async () => {
    setSkinsPage(1);
    setSkinsHasMore(true);
    const new_data = await fetchData(endpoints[2], skinsFilter, 1);
    if (!new_data) {
      setError("Failed to fetch skins stats");
      return;
    }
    if (new_data.length === 0) {
      setSkinsHasMore(false);
      return;
    }
    setSkinsStats(new_data);
  };

  const loadMoreSkins = async () => {
    const new_page = skinsPage + 1;
    const new_skins = await fetchData(endpoints[2], skinsFilter, new_page);
    if (!new_skins) {
      setError("Failed to fetch skins stats");
      return;
    }
    if (new_skins.length === 0) {
      setSkinsHasMore(false);
      return;
    }
    setSkinsStats((prev) => [...prev, ...new_skins]);
    setSkinsPage(new_page);
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadFilteredSkins();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [skinsFilter]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-base-100 bg-opacity-50 z-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="ml-4 text-lg">Loading data...</span>
      </div>
    );
  }
  if (error) return <ErrorMessage message={error} />;
  return (
    <>
      {/* Main stats */}
      <div className="stats shadow mt-2 bg-base-100">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total snipes</div>
          <div className="stat-value">{allStats.count ?? "N/A"}</div>
          <div className="stat-desc text-green-500">
            {allStats.last_hour_count
              ? `+${allStats.count - allStats.last_hour_count} (last hour)`
              : ""}
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Max recorded profit</div>
          <div className="stat-value">${allStats.max_profit ?? "N/A"}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Average discount over time</div>
          <div className="stat-value">{allStats.average ?? "N/A"}%</div>
        </div>
      </div>
      {/* Popular hours */}
      <GraphCardsContainer>
        <GraphCard title="Popular hours">
          <BarChart width={48} height={48} data={hourStats}>
            <XAxis />
            <YAxis
              tickCount="10"
              type="number"
              domain={[0, 100]}
              scale="sqrt"
            />
            <Tooltip />
            <Bar
              dataKey="busyness_percentage"
              fill="#605dff"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        </GraphCard>
      </GraphCardsContainer>
      {/* Market stats */}
      <h1 className="text-center text-bold my-2 text-xl">Market stats</h1>
      <div className="flex flex-col lg:flex-row lg:h-82 bg-base-100 p-4 shadow-sm rounded-lg w-full gap-2">
        <div className="flex-1/3 bg-base-200  overflow-y-auto p-4 rounded-lg max-h-64 lg:max-h-full">
          {marketStats.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-center p-4 hover:bg-base-100 cursor-pointer ${
                activeMarket === index
                  ? "bg-base-100 text-primary font-bold"
                  : "bg-base-200"
              }`}
              onClick={() => {
                setActiveMarket(index);
                if (activeMarket === index) return;
                fetchHistoData(marketStats[index]._id);
              }}
            >
              <img src={item.market_logo} className="w-8 mr-2" />
              <div>{item._id}</div>
            </div>
          ))}
        </div>
        <div className="flex-2/3 bg-base-200 rounded-lg p-6 shadow-md">
          <div className="text-2xl font-bold text-center mb-2 text-primary">
            {marketStats[activeMarket]._id}
          </div>
          <hr className="border-base-300 my-4" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total snipes:</span>
              <span className="badge badge-lg badge-neutral">
                {marketStats[activeMarket].count} (+
                {marketStats[activeMarket].count -
                  marketStats[activeMarket].last_hour_count}{" "}
                last hour)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Average discount:</span>
              <span className="text-xl font-bold text-success">
                {marketStats[activeMarket].average}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Max recorded profit:</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-secondary">
                  ${marketStats[activeMarket].max_profit}
                </span>
                <a
                  className="btn btn-xs btn-ghost text-info"
                  href={marketStats[activeMarket].message_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View
                </a>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-base-300">
              <span className="font-bold">Total potential profit:</span>
              <span className="text-2xl font-extrabold text-accent">
                $
                {Math.round(
                  marketStats[activeMarket].total_profit
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Market histogram */}
      <GraphCardsContainer>
        <GraphCard
          title={` Offers count for last 2 weeks by days for ${
            marketStats[activeMarket]?._id || "selected market"
          }`}
        >
          {histoData && histoData.length > 0 ? (
            <BarChart
              width={500}
              height={500}
              data={histoData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="7 7" />
              <XAxis
                dataKey="bin_label"
                label={{
                  value: "Days",
                  position: "left",
                }}
                height={70}
              />
              <YAxis
                allowDecimals={false}
                label={{
                  value: "Snipes count",
                  angle: -90,
                  position: "left",
                }}
                width={70}
              />
              <Tooltip
                formatter={(value) => [`${value} snipes`, "Count"]}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
                itemStyle={{
                  color: "#f8fafc",
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                fill="#605dff"
                name={`Number of listings (${
                  marketStats[activeMarket]?._id || "N/A"
                })`}
              />
            </BarChart>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-4 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No Data Available
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                There is no data to display for "
                {marketStats[activeMarket]?._id || "the selected market"}" at
                the moment.
              </p>
            </div>
          )}
        </GraphCard>
      </GraphCardsContainer>
      {/* Market size by count */}
      <GraphCardsContainer>
        <GraphCard title="Market size by count">
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          />
        </GraphCard>
      </GraphCardsContainer>
      {/* Skins stats */}
      <h1 className="text-center text-bold my-2 text-xl">Skin stats</h1>
      <div className="flex items-center mt-2 bg-base-100 p-4 shadow-sm rounded-lg w-full gap-2">
        <div className="flex-2/3">
          <input
            className="input w-full"
            type="text"
            placeholder="Search skin..."
            onChange={(e) => {
              setSkinsFilter((prev) => ({ ...prev, search: e.target.value }));
            }}
          />
        </div>
        <select
          defaultValue="asc"
          className="select select-primary flex-1/3"
          onChange={(e) => {
            setSkinsFilter((prev) => ({ ...prev, order: e.target.value }));
          }}
        >
          <option value={"desc"}>desc</option>
          <option value={"asc"}>asc</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <InfiniteScroll
          dataLength={skinsStats.length}
          next={loadMoreSkins}
          hasMore={skinsHasMore}
          loader={
            <div className="text-center">
              <span class="loading loading-spinner text-primary"></span>
              Loading...
            </div>
          }
        >
          <table className="table">
            <tbody>
              {skinsStats.map((item, index) => (
                <tr key={item._id + index}>
                  {index === 0 && (
                    <td className="text-red-500 font-bold">{index + 1}</td>
                  )}
                  {index === 1 && (
                    <td className="text-yellow-500 font-bold">{index + 1}</td>
                  )}
                  {index === 2 && (
                    <td className="text-green-500 font-bold">{index + 1}</td>
                  )}
                  {index > 2 && <td>{index + 1}</td>}

                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{item._id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm opacity-50">Average discount</div>
                    <div className="font-bold">
                      {Math.round(item.average_discount * 100, 2)}%
                    </div>
                  </td>
                  <td>
                    <div className="text-sm opacity-50">Total snipes</div>
                    <div className="font-bold">{item.count}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </>
  );
}

export default Stats;
