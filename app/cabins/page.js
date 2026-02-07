import { Suspense } from "react";
import CabinList from "../_components/CabinList";
import Spinner from "../_components/Spinner";

// always in seconds. 3600 seconds = 1 hour. every hour, revalidate the page to get the latest cabin data from the API. This is a good balance between performance and freshness of data, as cabin availability may change frequently but we don't want to hit the API on every request.
export const revalidate = 3600;

export const metadata = {
  title: "Cabins",
};

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>

{/* Use react suspense to load cabin list and show spinner while loading. 
Needs to be outside the component that does asynchronous work to avoid a blocking UI. */}

      <Suspense fallback={<Spinner />}>
        <CabinList />
      </Suspense>
    </div>
  );
}