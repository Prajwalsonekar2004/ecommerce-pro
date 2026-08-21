"use client";

import { CalendarDays, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProfileDetailsModalProps {
  open: boolean;
  email: string;
  onClose?: () => void;
  onCompleted: () => void;
}

type ShoppingPreference = "Men" | "Women" | "Everyone";

interface ProfileDetails {
  firstName: string;
  lastName: string;
  shoppingPreference: ShoppingPreference | "";
  dateOfBirth: string;
}

export default function ProfileDetailsModal({
  open,
  email,
  onClose,
  onCompleted,
}: ProfileDetailsModalProps) {
  const [profile, setProfile] = useState<ProfileDetails>({
    firstName: "",
    lastName: "",
    shoppingPreference: "",
    dateOfBirth: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPreferenceMenu, setShowPreferenceMenu] = useState(false);

  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setIsCheckingProfile(true);
      setError("");

      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            setIsCheckingProfile(false);
          }

          return;
        }

        const data = await response.json();
        const savedProfile = data.profile;

        if (cancelled) {
          return;
        }

        if (
          savedProfile?.firstName &&
          savedProfile?.lastName &&
          savedProfile?.shoppingPreference &&
          savedProfile?.dateOfBirth
        ) {
          onCompleted();
          return;
        }

        setProfile({
          firstName: savedProfile?.firstName ?? "",
          lastName: savedProfile?.lastName ?? "",
          shoppingPreference: savedProfile?.shoppingPreference ?? "",
          dateOfBirth: savedProfile?.dateOfBirth
            ? new Date(savedProfile.dateOfBirth).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (!cancelled) {
          setIsCheckingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [open, onCompleted]);

  if (!open) {
    return null;
  }

  function updateField<K extends keyof ProfileDetails>(
    field: K,
    value: ProfileDetails[K],
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function formatDateForDisplay(value: string) {
    if (!value) {
      return "";
    }

    const parts = value.split("-");

    if (parts.length !== 3) {
      return value;
    }

    const [year, month, day] = parts;

    if (!year || !month || !day) {
      return value;
    }

    return `${day}-${month}-${year}`;
  }

  function convertDisplayDateToISO(value: string) {
    const digits = value.replace(/\D/g, "");

    if (digits.length !== 8) {
      return null;
    }

    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    const dayNumber = Number(day);
    const monthNumber = Number(month);
    const yearNumber = Number(year);

    if (
      !Number.isInteger(dayNumber) ||
      !Number.isInteger(monthNumber) ||
      !Number.isInteger(yearNumber)
    ) {
      return null;
    }

    if (monthNumber < 1 || monthNumber > 12) {
      return null;
    }

    if (dayNumber < 1 || dayNumber > 31) {
      return null;
    }

    if (yearNumber < 1900 || yearNumber > new Date().getFullYear()) {
      return null;
    }

    const date = new Date(yearNumber, monthNumber - 1, dayNumber);

    if (
      date.getFullYear() !== yearNumber ||
      date.getMonth() !== monthNumber - 1 ||
      date.getDate() !== dayNumber
    ) {
      return null;
    }

    return `${year}-${month}-${day}`;
  }

  function handleDateTextChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    let formatted = digits;

    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(
        2,
        4,
      )}-${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }

    const isoDate = convertDisplayDateToISO(formatted);

    updateField("dateOfBirth", isoDate ?? formatted);
  }

  function handleCalendarChange(value: string) {
    updateField("dateOfBirth", value);
  }

  function openDatePicker() {
    datePickerRef.current?.showPicker?.();
    datePickerRef.current?.focus();
  }

  const displayDate = profile.dateOfBirth.includes("-")
    ? profile.dateOfBirth.length === 10 &&
      profile.dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)
      ? formatDateForDisplay(profile.dateOfBirth)
      : profile.dateOfBirth
    : profile.dateOfBirth;

  const isValidDate =
    /^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth) &&
    convertDisplayDateToISO(formatDateForDisplay(profile.dateOfBirth)) !== null;

  const isValid =
    profile.firstName.trim().length > 0 &&
    profile.lastName.trim().length > 0 &&
    profile.shoppingPreference !== "" &&
    isValidDate &&
    termsAccepted;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid || isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim(),
          shoppingPreference: profile.shoppingPreference,
          dateOfBirth: profile.dateOfBirth,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to save your details.");
        return;
      }

      onCompleted();
    } catch (error) {
      console.error("Failed to save profile:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-details-title"
        className="relative max-h-[calc(100dvh-48px)] w-full max-w-[430px] overflow-y-auto rounded-[22px] bg-white px-7 py-8 shadow-2xl sm:px-10 sm:py-9"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        )}

        {isCheckingProfile ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2
                id="profile-details-title"
                className="text-2xl font-medium tracking-tight"
              >
                Almost there!
              </h2>

              <p className="mx-auto mt-2 max-w-[300px] text-sm leading-5 text-neutral-500">
                A few details will help us personalise your experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-4">
                {/* First Name */}
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  placeholder="First Name*"
                  autoComplete="given-name"
                  disabled={isLoading}
                  className="h-14 w-full rounded-xl border border-neutral-400 px-4 text-sm outline-none transition placeholder:text-neutral-500 focus:border-black disabled:bg-neutral-100"
                />

                {/* Last Name */}
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  placeholder="Last Name*"
                  autoComplete="family-name"
                  disabled={isLoading}
                  className="h-14 w-full rounded-xl border border-neutral-400 px-4 text-sm outline-none transition placeholder:text-neutral-500 focus:border-black disabled:bg-neutral-100"
                />

                {/* Shopping Preference */}
                <div className="relative">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setShowPreferenceMenu((current) => !current)}
                    className="flex h-14 w-full items-center justify-between rounded-xl border border-neutral-400 px-4 text-left text-sm transition hover:border-black disabled:bg-neutral-100"
                  >
                    <span
                      className={
                        profile.shoppingPreference
                          ? "text-black"
                          : "text-neutral-500"
                      }
                    >
                      {profile.shoppingPreference || "Shopping Preference*"}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        showPreferenceMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showPreferenceMenu && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-xl">
                      {(["Men", "Women", "Everyone"] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            updateField("shoppingPreference", option);
                            setShowPreferenceMenu(false);
                          }}
                          className="flex h-12 w-full items-center rounded-lg px-3 text-left text-sm transition hover:bg-neutral-100"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displayDate}
                    onChange={(event) =>
                      handleDateTextChange(event.target.value)
                    }
                    placeholder="Date of Birth (DD-MM-YYYY)*"
                    maxLength={10}
                    autoComplete="bday"
                    disabled={isLoading}
                    className="h-14 w-full rounded-xl border border-neutral-400 bg-white px-4 pr-14 text-sm text-black outline-none transition placeholder:text-neutral-500 focus:border-black disabled:bg-neutral-100"
                  />

                  <button
                    type="button"
                    onClick={openDatePicker}
                    disabled={isLoading}
                    aria-label="Choose date of birth"
                    className="absolute right-0 top-0 flex h-14 w-14 items-center justify-center text-black"
                  >
                    <CalendarDays size={19} strokeWidth={1.8} />
                  </button>

                  <input
                    ref={datePickerRef}
                    type="date"
                    tabIndex={-1}
                    value={
                      profile.dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)
                        ? profile.dateOfBirth
                        : ""
                    }
                    onChange={(event) =>
                      handleCalendarChange(event.target.value)
                    }
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                    aria-hidden="true"
                  />
                </div>

                {/* Email */}
                <div className="flex h-14 items-center rounded-xl border border-neutral-400 px-4">
                  <span className="truncate text-sm text-neutral-500">
                    {email}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                  disabled={isLoading}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-black"
                />

                <span className="text-xs leading-5 text-neutral-600">
                  By entering this site, you agree to the{" "}
                  <button
                    type="button"
                    className="font-medium text-black underline"
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-medium text-black underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {/* Error */}
              {error && (
                <p className="mt-4 text-center text-sm text-red-600">{error}</p>
              )}

              {/* Continue */}
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="mt-6 h-12 w-full rounded-full bg-black text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
              >
                {isLoading ? "Saving..." : "Continue"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
