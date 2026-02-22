"use server";

import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-services";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const [nationality, countryFlag] = formData.get("nationality").split("%");
    const updateData = { nationality, countryFlag };

    const { data, error } = await supabase
      .from("guests")
      .update(updateData)
      .eq("id", session.user.guestId);

    if (error) {
      console.error("Supabase updateGuest error:", error, { updateData, guestId: session.user.guestId });
      throw new Error(`Guest could not be updated: ${error.message || error}`);
    }

    revalidatePath("/account/profile");
  } catch (err) {
    console.error("updateGuest failed:", err);
    throw err;
  }
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestID: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    // Log the full Supabase error for debugging
    console.error("Supabase booking insert error:", error);
    throw new Error(`Booking could not be created: ${error.message || error}`);
  }

  revalidatePath(`/cabins/${bookingData.cabinID}`);

  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(bookingId))
      throw new Error("You are not allowed to delete this booking");

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) {
      console.error("Supabase deleteBooking error:", error, { bookingId });
      throw new Error(`Booking could not be deleted: ${error.message || error}`);
    }

    revalidatePath("/account/reservations");
  } catch (err) {
    console.error("deleteBooking failed:", err);
    throw err;
  }
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 3) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 5) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // 7) Redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}