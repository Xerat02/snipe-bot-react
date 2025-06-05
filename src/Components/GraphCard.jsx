import { ResponsiveContainer } from "recharts";

function GraphCard({ title, children }) {
  return (
    <div className="flex flex-col h-96 mt-2 bg-base-100 p-4 shadow-sm rounded-lg w-full">
      <div className="text-center text-xl">{title}</div>
      <ResponsiveContainer width={"100%"} height={"100%"}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export default GraphCard;
