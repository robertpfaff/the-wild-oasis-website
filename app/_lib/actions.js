"use server";

import { auth, signIn, signOut } from "./auth";
import { getBookings, getGuest } from "./data-services";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper function to get guestId from session email
async function getGuestId() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("You must be logged in");

  const guest = await getGuest(session.user.email);
  if (!guest?.id) throw new Error("Guest profile not found");

  return guest.id;
}

export async function updateGuest(formData) {
  try {
    const guestId = await getGuestId();
    const [nationality, countryFlag] = formData.get("nationality").split("%");
    const updateData = { nationality, countryFlag };

    const { data, error } = await supabase
      .from("guests")
      .update(updateData)
      .eq("id", guestId);

    if (error) {
      console.error("Supabase updateGuest error:", error, { updateData, guestId });
      throw new Error(`Guest could not be updated: ${error.message || error}`);
    }

    revalidatePath("/account/profile");
  } catch (err) {
    console.error("updateGuest failed:", err);
    throw err;
  }
}

export async function createBooking(bookingData, formData) {
  const guestId = await getGuestId();

  const newBooking = {
    ...bookingData,
    guestID: guestId,
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
    const guestId = await getGuestId();

    const guestBookings = await getBookings(guestId);
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
  const guestId = await getGuestId();

  // Get all guest bookings for authorization
  const guestBookings = await getBookings(guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // Error handling
  if (error) throw new Error("Booking could not be updated");

  // Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // Redirect
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}