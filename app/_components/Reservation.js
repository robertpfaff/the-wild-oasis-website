import { getBookedDatesByCabinId, getSettings } from "../_lib/data-services";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import { Suspense } from "react";
import Spinner from "./Spinner";

async function Reservation({ cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <Suspense fallback={<Spinner />} >
        <DateSelector
          settings={settings}
          bookedDates={bookedDates}
          cabin={cabin}
        />
      </Suspense>
      <ReservationForm cabin={cabin} />
    </div>
  );
}

export default Reservation;