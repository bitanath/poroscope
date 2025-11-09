import React, { useMemo,useState } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip } from './tool-tip';

export const getLastMonday = (start: Date) => {
  let diff = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - diff);
  return start;
}

export const getColor = (colors: string[], max: number, value: number) => {
  if (!value) return colors[0];
  let p = (value / max) * (colors.length - 1);
  return colors[Math.ceil(p)];
}

export const getCalendar = (data: { [key: string]: number }, year: number) => {
  let base = getLastMonday(new Date(year, 0, 1));
  let out: any = {}

  out.max = 0;
  out.calendar = Array.from({ length: 7 }, (_, i) => {
    let start = new Date(base);
    start.setDate(start.getDate() + i);
    return Array.from({ length: 53 }, (_, j) => {
      let day = new Date(start);
      day.setDate(start.getDate() + j * 7);
      if (day.getFullYear() == year) {
        let date = day.toISOString().split("T")[0];
        let value = data[date] ?? 0;
        if (value > out.max) {
          out.max = value;
        }
        return { date, value };
      }
    });
  })

  return out;
}


interface HeatmapProps {
  data: { [key: string]: number };
  year?: number;
  showDayLabels?: boolean;
  showMonthLabels?: boolean;
  colors?: string[];
  className?: string;
  tooltipLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLTableCellElement | HTMLDivElement>) => void;
  onMouseOut?: (event: React.MouseEvent<HTMLTableCellElement | HTMLDivElement>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLTableCellElement | HTMLDivElement>) => void;
}

const Heatmap = React.forwardRef<HTMLTableElement, HeatmapProps>(
  ({
    data,
    year = new Date().getFullYear(),
    showDayLabels = true,
    showMonthLabels = true,
    colors = ["#fca5a5", "#fed7aa", "#fde68a", "#bef264", "#86efac"],
    className,
    onClick,
    onMouseOut,
    onMouseOver,
    tooltipLabel = "games", 
    ...props
  }, ref) => {
    const { max, calendar } = useMemo(() => getCalendar(data, year), [data, year]);
    const [hoveredData, setHoveredData] = useState<{date: string, value: string} | null>(null);

    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthSpans = [4, 4, 5, 4, 5, 4, 4, 5, 4, 4, 5, 4];

    return (
      <table 
        ref={ref}
        className={cn("text-base border-separate border-spacing-0.5", className)}
        {...props}
      >
        {showMonthLabels && (
          <thead>
            <tr className="text-[12px]">
              <td className="pb-2"></td>
              {monthLabels.map((month, i) => (
                <td key={month} colSpan={monthSpans[i]}>
                  {month}
                </td>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {calendar.map((week: any[], i: number) => (
            <tr key={i}>
              {showDayLabels && (
                <td className="pr-2 text-[12px]">
                  {dayLabels[i]}
                </td>
              )}
              {week.map((day, j) => (
                day ? (
                  <td key={j} className="p-0">
                    <Tooltip 
                      content={hoveredData ? `${hoveredData.date}: ${hoveredData.value} ${tooltipLabel}` : ""}
                      open={!!hoveredData && hoveredData.date === day.date} asChild
                    >
                      <div
                        className="w-3 h-3 cursor-pointer rounded-[2px] border-none!"
                        style={{ backgroundColor: getColor(colors, max, day.value) }}
                        data-date={day.date}
                        data-value={day.value}
                        onClick={onClick}
                        onMouseOut={(e) => {
                          setHoveredData(null);
                          onMouseOut?.(e);
                        }}
                        onMouseOver={(e) => {
                          const date = e.currentTarget.dataset.date;
                          const value = e.currentTarget.dataset.value;
                          setHoveredData({ date: date || "", value: value || "" });
                          onMouseOver?.(e);
                        }}
                      />
                    </Tooltip>
                  </td>
                ) : (
                  <td key={j} />
                )
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);


Heatmap.displayName = "Heatmap";


export function ContributionMap({data,label}:{data:{[key:string]:number};label?:string;}) {
  return (
    <div className="p-4">
      <Heatmap 
        data={data}
        year={2025}
        tooltipLabel={label}
      />
    </div>
  );
}


export { Heatmap, type HeatmapProps };