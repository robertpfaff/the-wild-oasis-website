"use client";

import { isWithinInterval } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";
import { useReservation } from "./ReservationContext";
import { getSettings } from "../_lib/data-services";

function isAlreadyBooked(range, datesArr) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  // Use shared reservation state from context
  // Default values for 'from' and 'to' are set in ReservationContext.js
  // Defensive default: ensure range is always an object with from/to
  const { range: contextRange, setRange, resetRange } = useReservation();
  const range = contextRange || { from: undefined, to: undefined };
  
// Extract price and discount from cabin prop
  const { regularPrice, discount } = cabin;

  // Calculate number of nights based on selected range
  const numNights =
    range.from && range.to
      ? Math.max(
          0,
          Math.abs((range.to - range.from) / (1000 * 60 * 60 * 24)))
      : 0;

  // Calculate total price for the stay
  const cabinPrice = numNights * (regularPrice - discount);

  // Extract booking length settings
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between">
      {/* Calendar for selecting booking range */}
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={setRange}
        selected={range}
        min={minBookingLength + 1}
        max={maxBookingLength}
        startMonth={new Date()}
        startDate={new Date()}
        endMonth={new Date(
          new Date().setFullYear(new Date().getFullYear() + 5)
        )}
        captionLayout="dropdown"
        numberOfMonths={2}
      />

      {/* Price summary and booking info */}
      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {/* Show discounted price if applicable */}
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {/* Show total nights and price if a range is selected */}
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {/* Button to clear selected range */}
        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;