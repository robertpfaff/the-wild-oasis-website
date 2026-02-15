import { getBookedDatesByCabinId, getSettings } from "../_lib/data-services";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import { Suspense } from "react";
import Spinner from "./Spinner";
import { auth } from "@/app/_lib/auth";
import LoginMessage from "./LoginMessage";

async function Reservation({ cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);
  const session = await auth();

  // Log session only if user exists
  if (session && session.user) {
    console.log("User session:", session);
  }

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <Suspense fallback={<Spinner />} >
        <DateSelector
          settings={settings}
          bookedDates={bookedDates}
          cabin={cabin}
        />
        {session && session.user ? (
          <ReservationForm cabin={cabin} user={session.user} />
        ) : (
          <LoginMessage />
        )}
      </Suspense>
    </div>
  );
}

export default Reservation;