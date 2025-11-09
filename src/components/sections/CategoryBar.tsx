"use client"

import React from "react"

import { AvailableChartColors, AvailableChartColorsKeys, getColorClassName } from "../ui/utils"
import { Tooltip } from "../ui/tool-tip"
import { cn } from "@/lib/utils"


const getMarkerBgColor = (
  marker: number | undefined,
  values: number[],
  colors: AvailableChartColorsKeys[],
): string => {
  if (marker === undefined) return ""

  if (marker === 0) {
    for (let index = 0; index < values.length; index++) {
      if (values[index] > 0) {
        return getColorClassName(colors[index], "bg")
      }
    }
  }

  let prefixSum = 0
  for (let index = 0; index < values.length; index++) {
    prefixSum += values[index]
    if (prefixSum >= marker) {
      return getColorClassName(colors[index], "bg")
    }
  }

  return getColorClassName(colors[values.length - 1], "bg")
}

const getPositionLeft = (
  value: number | undefined,
  maxValue: number,
): number => (value ? (value / maxValue) * 100 : 0)

const sumNumericArray = (arr: number[]) =>
  arr.reduce((prefixSum, num) => prefixSum + num, 0)

const formatNumber = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toString()
  }
  return num.toFixed(1)
}

const BarLabels = ({ values, labels }: { values: number[]; labels?: string[] }) => {
  const sumValues = React.useMemo(() => sumNumericArray(values), [values])
  let prefixSum = 0

  return (
    <div
      className={cn(
        "relative mb-2 flex h-12 w-full text-sm font-medium",
        "text-gray-500 dark:text-gray-100",
      )}
    >
      <div className="absolute bottom-0 left-0 flex items-center">
        {labels ? labels[0] || "0" : "0"}
      </div>
      {values.map((widthPercentage, index) => {
        prefixSum += widthPercentage
        const widthPositionLeft = getPositionLeft(widthPercentage, sumValues)
        const isTop = index % 2 === 1
        const showLabel = index < values.length - 2 // Force show all labels for testing

        return (
          <div
            key={`item-${index}`}
            className="flex items-end justify-end pr-0.5 relative h-full"
            style={{ width: `${widthPositionLeft}%` }}
          >
            {showLabel ? (
              <span
                className={cn(
                  "absolute translate-x-4/5 px-4 text-sm tabular-nums", // Changed to red for visibility
                  isTop ? "top-7" : "-bottom-10"
                )}
              >
                {labels ? labels[index + 1] || formatNumber(prefixSum) : formatNumber(prefixSum)}
              </span>
            ) : null}
          </div>
        )
      })}
      <div className="absolute right-0 bottom-0 flex items-center">
        {labels ? labels[labels.length - 1] || formatNumber(sumValues) : formatNumber(sumValues)}
      </div>
    </div>
  )
}





interface CategoryBarProps extends React.HTMLAttributes<HTMLDivElement> {
  values: number[]
  colors?: AvailableChartColorsKeys[]
  labels?: string[]
  marker?: { value: number; tooltip?: string; showAnimation?: boolean }
  showLabels?: boolean
}

const CategoryBar = React.forwardRef<HTMLDivElement, CategoryBarProps>(
  (
    {
      values = [],
      colors = AvailableChartColors,
      labels,
      marker,
      showLabels = true,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const markerBgColor = React.useMemo(
      () => getMarkerBgColor(marker?.value, values, colors),
      [marker, values, colors],
    )

    const maxValue = React.useMemo(() => sumNumericArray(values), [values])

    const adjustedMarkerValue = React.useMemo(() => {
      if (marker === undefined) return undefined
      if (marker.value < 0) return 0
      if (marker.value > maxValue) return maxValue
      return marker.value
    }, [marker, maxValue])

    const markerPositionLeft: number = React.useMemo(
      () => getPositionLeft(adjustedMarkerValue, maxValue),
      [adjustedMarkerValue, maxValue],
    )

    return (
      <div
        ref={forwardedRef}
        className={cn(className)}
        aria-label="Category bar"
        aria-valuenow={marker?.value}
        tremor-id="tremor-raw"
        {...props}
      >
        {showLabels ? <BarLabels values={values} labels={labels} /> : null}
        <div className="relative flex h-2 w-full items-center">
          <div className="flex h-full flex-1 items-center gap-0.5 overflow-hidden rounded-full">
            {values.map((value, index) => {
              const barColor = colors[index] ?? "gray"
              const percentage = (value / maxValue) * 100
              return (
                <div
                  key={`item-${index}`}
                  className={cn(
                    "h-full",
                    getColorClassName(
                      barColor as AvailableChartColorsKeys,
                      "bg",
                    ),
                    percentage === 0 && "hidden",
                  )}
                  style={{ width: `${percentage}%` }}
                />
              )
            })}
          </div>

          {marker !== undefined ? (
            <div
              className={cn(
                "absolute w-2 -translate-x-1/2",
                marker.showAnimation &&
                  "transform-gpu transition-all duration-300 ease-in-out",
              )}
              style={{
                left: `${markerPositionLeft}%`,
              }}
            >
              {marker.tooltip ? (
                <Tooltip asChild content={marker.tooltip}>
                  <div
                    aria-hidden="true"
                    className={cn(
                      "relative mx-auto h-4 w-1 rounded-full",
                      markerBgColor,
                    )}
                  >
                    <div
                      aria-hidden
                      className="absolute size-7 -translate-x-[45%] -translate-y-[15%]"
                    ></div>
                  </div>
                </Tooltip>
              ) : (
                <div
                  className={cn(
                    "mx-auto h-4 w-1 rounded-full",
                    markerBgColor,
                  )}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    )
  },
)

CategoryBar.displayName = "CategoryBar"

export { CategoryBar, type CategoryBarProps }