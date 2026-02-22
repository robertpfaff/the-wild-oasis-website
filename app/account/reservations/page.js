import ReservationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBookings, getGuest } from "@/app/_lib/data-services";

export const metadata = {
  title: "Reservations",
};

export default async function Page() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return <p>Please log in to view your reservations</p>;
    }

    // Get the guest ID from database using email
    const guest = await getGuest(session.user.email);
    
    if (!guest?.id) {
      return <p>Guest profile not found. Please contact support.</p>;
    }
    
    const bookings = await getBookings(guest.id);

    return (
      <div>
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
          Your reservations
        </h2>

        {bookings.length === 0 ? (
          <p className="text-lg">
            You have no reservations yet. Check out our{" "}
            <a className="underline text-accent-500" href="/cabins">
              luxury cabins &rarr;
            </a>
          </p>
        ) : (
          <ReservationList bookings={bookings} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Reservations page error:", error);
    return (
      <div>
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
          Your reservations
        </h2>
        <p className="text-red-500">Error loading reservations. Please try again later.</p>
      </div>
    );
  }
}
  );
}