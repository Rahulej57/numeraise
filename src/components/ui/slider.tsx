import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

/**
 * Base UI renders Root as a <div role="group"> and Thumb as the real
 * <input type="range"> that carries role="slider".
 *
 * ARIA therefore has to land on the Thumb, not the Root. Passing aria-label or
 * aria-valuetext through to Root produced two Lighthouse failures at once: the
 * range input had no accessible name, and aria-valuetext is not a permitted
 * attribute on role="group". Both are pulled out of props here and forwarded to
 * the Thumb instead.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  "aria-label": ariaLabel,
  valueText,
  ...props
}: SliderPrimitive.Root.Props & {
  "aria-label"?: string;
  /**
   * Human-readable value announced instead of the raw track position.
   * Consumers pass the already-formatted figure, e.g. "₹5,000".
   */
  valueText?: string;
}) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full h-8 touch-pan-y items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col cursor-pointer">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            // Lands on the real <input type="range">, which is what assistive
            // technology reads and what Lighthouse audits.
            aria-label={ariaLabel}
            // These sliders drive an internal 0-10000 resolution track so the
            // movement can follow a cubic curve on large money ranges. That
            // makes aria-valuenow ("44.84") meaningless to a listener.
            // getAriaValueText is Base UI's supported hook for overriding what
            // is announced; a plain aria-valuetext prop is not forwarded to the
            // underlying input.
            getAriaValueText={valueText ? () => valueText : undefined}
            className="relative block size-5 shrink-0 rounded-full border-2 border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-3 hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden active:ring-4 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
