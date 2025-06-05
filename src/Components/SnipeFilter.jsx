import { use, useEffect, useState } from "react";
import { fetchData } from "../tools/Api";
import ErrorMessage from "./ErrorMessage";

function SnipeFilter({ onFilterChange }) {
  const endpoints = ["https://api.csbay.org/stats/market"];
  const [discount, setDiscount] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999999);
  const [market, setMarket] = useState([]);
  const [marketSelected, setMarketSelected] = useState("");
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [error, setError] = useState(null);
  const [risk, setRisk] = useState(0);
  const [notify, setNotify] = useState(false);
  const [sort, setSort] = useState("newest");

  const fetchMarketData = async () => {
    const new_data = await fetchData(endpoints[0]);
    if (!new_data) {
      setError("Failed to fetch data. Please try again later.");
      return;
    }
    if (new_data.length === 0) {
      setError("No data found. Please try again later.");
      return;
    }

    let ar = [];

    for (let i = 0; i < new_data.length; i++) {
      let logo = "";
      if (new_data[i].logo) {
        logo = new_data[i].logo;
      }
      ar.push([new_data[i]._id, logo]);
    }

    setMarket(ar);
  };

  // Funkce pro aktualizaci filtrů
  const updateFilters = () => {
    const filters = {
      buff_discount: discount,
      min_price: minPrice,
      max_price: maxPrice,
      market: marketSelected,
      risk_factor: risk,
      sort: sort,
    };
    onFilterChange(filters, notify);
  };

  useEffect(() => {
    if (Date.now() - lastUpdate > 300) {
      setLastUpdate(Date.now());
      updateFilters();
    }
  }, [discount, minPrice, maxPrice, marketSelected, risk, notify, sort]);

  useEffect(() => {
    fetchMarketData();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }
  return (
    <div className="w-full bg-base-100 shadow-xl rounded-lg mt-2 p-4 sticky top-12 z-50">
      <div className="flex flex-col xl:flex-row gap-4 w-full">
        {/* Discount slider */}
        <fieldset className="flex-1 bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Min discount</legend>
          <input
            type="range"
            min={0}
            max={100}
            value={discount}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setDiscount(value);
            }}
            className={`range w-full ${
              discount > 70
                ? "range-success"
                : discount > 30
                ? "range-warning"
                : "range-error"
            }`}
          />
          <div
            className={`text-center mt-2 ${
              discount > 70
                ? "text-success"
                : discount > 30
                ? "text-warning"
                : "text-error"
            }`}
          >
            {discount}%
          </div>
        </fieldset>
        {/* Market select */}
        <fieldset className="flex-1 bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Market</legend>
          <select
            className="select select-md w-full"
            value={marketSelected || "-1"}
            onChange={(e) => {
              const value = e.target.value === "-1" ? null : e.target.value;
              setMarketSelected(value);
            }}
          >
            <option value="">Select market</option>
            {market?.length > 0 ? (
              market.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))
            ) : (
              <option disabled>Loading markets...</option>
            )}
          </select>
        </fieldset>

        {/* Risk select */}
        <fieldset className="flex-1 bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Maximum risk</legend>
          <select
            className="select select-md w-full"
            value={risk}
            onChange={(e) => {
              setRisk(e.target.value);
            }}
          >
            <option value="-1">Select risk</option>
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>
        </fieldset>

        {/* Min price */}
        <fieldset className="flex-1 bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Min price</legend>
          <input
            type="number"
            min="0"
            placeholder="Min price"
            className="input w-full"
            value={minPrice}
            onChange={(e) => {
              try {
                const value = parseFloat(e.target.value) || 0;
                if (Number.isInteger(value)) {
                  if (value >= maxPrice) {
                    setMaxPrice(value + 1);
                  }
                  setMinPrice(value);
                }
              } catch (error) {
                console.error("Invalid input:", error);
                return;
              }
            }}
          />
        </fieldset>

        {/* Max price */}
        <fieldset className="flex-1 bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Max price</legend>
          <input
            type="number"
            min="0"
            placeholder="Max price"
            className="input w-full"
            value={maxPrice || ""}
            onChange={(e) => {
              try {
                const value = parseFloat(e.target.value) || null;
                if (Number.isInteger(value)) {
                  if (value <= minPrice && value !== 0) {
                    setMinPrice(value - 1);
                  }
                  setMaxPrice(value);
                }
              } catch (error) {
                console.error("Invalid input:", error);
                return;
              }
            }}
          />
        </fieldset>

        {/* Data sort */}
        <fieldset className="flex-1 bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Data sort</legend>
          <select
            className="select select-md w-full"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="market_price_desc">Market price (Desc)</option>
            <option value="market_price_asc">Market price (Asc)</option>
            <option value="buff_price_desc">Buff price (Desc)</option>
            <option value="buff_price_asc">Buff price (Asc)</option>
          </select>
          <p className="textarea-xs text-gray-500 mt-2">
            Applicable only for snipes Overview
          </p>
        </fieldset>

        {/* Notify checkbox */}
        <fieldset className="flex-1 bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">System notifications</legend>
          <label className="fieldset-label">
            <input
              type="checkbox"
              className="toggle toggle-accent"
              onChange={(e) => {
                if (Notification.permission !== "granted") {
                  Notification.requestPermission();
                }
                setNotify(e.target.checked);
              }}
            />
            Turn{" "}
            {notify ? (
              <span className="text-secondary">off</span>
            ) : (
              <span className="text-accent">on</span>
            )}{" "}
            notifications
          </label>
        </fieldset>
      </div>
    </div>
  );
}

export default SnipeFilter;
