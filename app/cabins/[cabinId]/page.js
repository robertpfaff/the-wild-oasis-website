import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-services";
import { ReservationProvider } from "@/app/_components/ReservationContext";

import Image from "next/image";
import { Suspense } from "react";

// export const metadata = {
//   title: "Cabin",
// };

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { name } = await getCabin(resolvedParams.cabinId);
  console.log("Metadata function, resolved params:", resolvedParams);
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
  return ids;
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  console.log("Page function, resolved params:", resolvedParams);
  const { cabinId } = resolvedParams;
  const cabin = await getCabin(cabinId);
  console.log("Page getCabin:", cabinId);
  console.log("Cabin data in Page Component:", cabin);
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <ReservationProvider>
          <Suspense fallback={<Spinner />}>
            <Reservation cabin={cabin} />
          </Suspense>
        </ReservationProvider>
      </div>
    </div>
  );
}