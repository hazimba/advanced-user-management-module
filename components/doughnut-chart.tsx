import {
  Pie,
  PieChart,
  Sector,
  SectorProps,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TooltipIndex } from "recharts/types/state/tooltipSlice";

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: any;
};

type PieSectorDataItem = React.SVGProps<SVGPathElement> &
  Partial<SectorProps> &
  PieSectorData;

// #region Sample data

// #endregion
const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`PV ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${((percent ?? 1) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function CustomActiveShapePieChart({
  data,
  isAnimationActive = true,
  defaultIndex = undefined,
}: {
  data: any;
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
}) {
  return (
    // <ResponsiveContainer width="100%" height={400}>
    <PieChart
      height={300}
      width={400}
      responsive
      margin={{
        top: 70,
        right: 70,
        bottom: 70,
        left: 70,
      }}
    >
      <Pie
        activeShape={renderActiveShape}
        data={data}
        cx="50%"
        cy="50%"
        innerRadius="60%"
        outerRadius="100%"
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={isAnimationActive}
      />
      <Tooltip content={() => null} defaultIndex={defaultIndex} />
    </PieChart>
    // </ResponsiveContainer>
  );
}
