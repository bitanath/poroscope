import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

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
  onClick?: (event: React.MouseEvent<HTMLTableCellElement>) => void;
  onMouseOut?: (event: React.MouseEvent<HTMLTableCellElement>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLTableCellElement>) => void;
}

const Heatmap = React.forwardRef<HTMLTableElement, HeatmapProps>(
  ({
    data,
    year = new Date().getFullYear(),
    showDayLabels = true,
    showMonthLabels = true,
    colors = ["#f3f4f6", "#e9d5ff", "#c084fc", "#9333ea", "#581c87"],
    className,
    onClick,
    onMouseOut,
    onMouseOver,
    ...props
  }, ref) => {
    const { max, calendar } = useMemo(() => getCalendar(data, year), [data, year]);

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
            <tr className="text-[8px]">
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
                <td className="pr-2 text-[8px]">
                  {dayLabels[i]}
                </td>
              )}
              {week.map((day, j) => (
                day ? (
                    <td key={j} className="p-0">
                    <div
                        className="w-2 h-2 cursor-pointer rounded-[2px]"
                        style={{ backgroundColor: getColor(colors, max, day.value) }}
                        data-date={day.date}
                        data-value={day.value}
                        onClick={onClick}
                        onMouseOut={onMouseOut}
                        onMouseOver={onMouseOver}
                    />
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

const generateRandomData = (year: number) => {
  const data: { [key: string]: number } = {};
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().split('T')[0];
    data[date] = Math.floor(Math.random() * 10); // Random value 0-9
  }
  
  return data;
};

const randomContributions = generateRandomData(2025)

export function ContributionMap({data=randomContributions}:{data?:{[key:string]:number}|undefined}) {
  
  return (
    <div className="p-4">
      <Heatmap 
        data={data}
        year={2025}
        onClick={(e) => {
          const date = e.currentTarget.dataset.date;
          const value = e.currentTarget.dataset.value;
          console.log(`Clicked: ${date}, Value: ${value}`);
        }}
        onMouseOver={(e) => {
          const date = e.currentTarget.dataset.date;
          const value = e.currentTarget.dataset.value;
          console.log(`Hover: ${date}, Value: ${value}`);
        }}
      />
    </div>
  );
}


export { Heatmap, type HeatmapProps };