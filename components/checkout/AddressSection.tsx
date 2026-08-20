"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Edit3,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  houseNo: string;
  addressLine: string;
  city: string;
  state: string;
  isDefault: boolean;
}

interface AddressForm {
  fullName: string;
  phone: string;
  pincode: string;
  houseNo: string;
  addressLine: string;
  city: string;
  state: string;
  isDefault: boolean;
}

const emptyForm: AddressForm = {
  fullName: "",
  phone: "",
  pincode: "",
  houseNo: "",
  addressLine: "",
  city: "",
  state: "",
  isDefault: true,
};

export default function AddressSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadAddresses() {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/addresses", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load addresses.");
      }

      const data = await response.json();

      const loadedAddresses: Address[] = data.addresses ?? [];

      setAddresses(loadedAddresses);

      const defaultAddress =
        loadedAddresses.find((address) => address.isDefault) ??
        loadedAddresses[0];

      setSelectedId(defaultAddress?.id ?? "");
    } catch (error) {
      console.error("Failed to load addresses:", error);
      setError("Unable to load your saved addresses.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  function openAddDrawer() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      isDefault: addresses.length === 0,
    });
    setError("");
    setIsDrawerOpen(true);
  }

  function openEditDrawer(address: Address) {
    setEditingId(address.id);

    setForm({
      fullName: address.fullName,
      phone: address.phone,
      pincode: address.pincode,
      houseNo: address.houseNo,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      isDefault: address.isDefault,
    });

    setError("");
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    if (isSaving) {
      return;
    }

    setIsDrawerOpen(false);
    setEditingId(null);
    setError("");
  }

  function updateField(field: keyof AddressForm, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm() {
    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.pincode.trim() ||
      !form.houseNo.trim() ||
      !form.addressLine.trim() ||
      !form.city.trim() ||
      !form.state.trim()
    ) {
      return "Please complete all required fields.";
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      return "Enter a valid 10-digit phone number.";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      return "Enter a valid 6-digit pincode.";
    }

    return "";
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const response = await fetch("/api/addresses", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? {
                addressId: editingId,
                ...form,
              }
            : form,
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save address.");
      }

      setIsDrawerOpen(false);
      setEditingId(null);

      await loadAddresses();
    } catch (error) {
      console.error("Failed to save address:", error);

      setError(
        error instanceof Error ? error.message : "Unable to save address.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(addressId: string) {
    const confirmed = window.confirm("Remove this address?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/addresses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete address.");
      }

      await loadAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);

      setError(
        error instanceof Error ? error.message : "Unable to delete address.",
      );
    }
  }

  async function handleSelect(addressId: string) {
    setSelectedId(addressId);

    const address = addresses.find((item) => item.id === addressId);

    if (!address || address.isDefault) {
      return;
    }

    try {
      const response = await fetch("/api/addresses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId,
          fullName: address.fullName,
          phone: address.phone,
          pincode: address.pincode,
          houseNo: address.houseNo,
          addressLine: address.addressLine,
          city: address.city,
          state: address.state,
          isDefault: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to select address.");
      }

      await loadAddresses();
    } catch (error) {
      console.error("Failed to select address:", error);
      setError("Unable to select this address.");
    }
  }

  if (isLoading) {
    return (
      <section>
        <div className="animate-pulse">
          <div className="h-7 w-40 rounded bg-neutral-100" />
          <div className="mt-3 h-5 w-72 rounded bg-neutral-100" />

          <div className="mt-8 h-44 rounded-2xl border border-neutral-200 bg-neutral-50" />
        </div>
      </section>
    );
  }

  return (
    <>
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Choose Address
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Select where you want your order delivered.
            </p>
          </div>
        </div>

        {error && !isDrawerOpen && (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {addresses.map((address) => {
            const isSelected = selectedId === address.id;

            return (
              <div
                key={address.id}
                className={`relative rounded-2xl border p-5 transition ${
                  isSelected
                    ? "border-black"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(address.id)}
                  className="w-full text-left"
                >
                  <div className="flex gap-4">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-neutral-400"
                      }`}
                    >
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>

                    <div className="min-w-0 flex-1 pr-20">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{address.fullName}</h3>

                        {address.isDefault && (
                          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        {address.houseNo}, {address.addressLine}
                        <br />
                        {address.city}, {address.state} {address.pincode}
                      </p>

                      <p className="mt-2 text-sm text-neutral-600">
                        +91 {address.phone}
                      </p>
                    </div>
                  </div>
                </button>

                <div className="absolute right-5 top-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditDrawer(address)}
                    aria-label="Edit address"
                    className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
                  >
                    <Edit3 size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    aria-label="Delete address"
                    className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={openAddDrawer}
            className="flex min-h-36 w-full items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-6 text-center transition hover:border-black hover:bg-neutral-50"
          >
            <span>
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300">
                <Plus size={20} />
              </span>

              <span className="mt-3 block text-sm font-semibold">
                Add New Address
              </span>

              <span className="mt-1 block text-xs text-neutral-500">
                Add another delivery address
              </span>
            </span>
          </button>
        </div>
      </section>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Close address drawer"
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/45"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Enter your delivery details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close"
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                {error && (
                  <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Full Name
                    </label>

                    <input
                      value={form.fullName}
                      onChange={(event) =>
                        updateField("fullName", event.target.value)
                      }
                      placeholder="Enter full name"
                      autoComplete="name"
                      className="h-13 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Phone Number
                    </label>

                    <input
                      value={form.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="10-digit mobile number"
                      inputMode="numeric"
                      autoComplete="tel"
                      className="h-13 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Pincode
                    </label>

                    <input
                      value={form.pincode}
                      onChange={(event) =>
                        updateField(
                          "pincode",
                          event.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      placeholder="6-digit pincode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      className="h-13 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      House / Flat / Office No.
                    </label>

                    <input
                      value={form.houseNo}
                      onChange={(event) =>
                        updateField("houseNo", event.target.value)
                      }
                      placeholder="House / Flat / Office No."
                      autoComplete="address-line1"
                      className="h-13 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Road / Area / Colony
                    </label>

                    <textarea
                      value={form.addressLine}
                      onChange={(event) =>
                        updateField("addressLine", event.target.value)
                      }
                      placeholder="Road Name / Area / Colony"
                      rows={3}
                      autoComplete="address-line2"
                      className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        City
                      </label>

                      <input
                        value={form.city}
                        onChange={(event) =>
                          updateField("city", event.target.value)
                        }
                        placeholder="City"
                        autoComplete="address-level2"
                        className="h-13 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        State
                      </label>

                      <input
                        value={form.state}
                        onChange={(event) =>
                          updateField("state", event.target.value)
                        }
                        placeholder="State"
                        autoComplete="address-level1"
                        className="h-13 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-black"
                      />
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 px-4 py-4">
                    <div>
                      <p className="text-sm font-medium">
                        Use as default address
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Use this address automatically next time.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(event) =>
                        updateField("isDefault", event.target.checked)
                      }
                      className="h-5 w-5 accent-black"
                    />
                  </label>
                </div>
              </div>

              <div className="border-t border-neutral-200 bg-white px-6 py-5 sm:px-8">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex h-14 w-full items-center justify-center rounded-full bg-black text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  {isSaving
                    ? "Saving Address..."
                    : editingId
                      ? "Save Changes"
                      : "Ship to this Address"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
