import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Plus } from "lucide-react";

import { getCart } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { getShippingLocations } from "../services/shippingService";
import {
  getAddresses,
  createAddress,
} from "../services/addressService";

const emptyCheckout = {
  shippingName: "",
  shippingPhone: "",
  shippingAddress: "",
  shippingCity: "",
  shippingState: "",
  shippingCountry: "Nigeria",
};

const emptyAddress = {
  label: "Home",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "Nigeria",
  isDefault: false,
};

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [shippingLocations, setShippingLocations] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [shippingLocationId, setShippingLocationId] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [formData, setFormData] = useState(emptyCheckout);
  const [addressForm, setAddressForm] = useState(emptyAddress);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [error, setError] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    const loadCheckout = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const [cartData, locations, savedAddresses] =
          await Promise.all([
            getCart(),
            getShippingLocations(),
            getAddresses(),
          ]);

        if (!cartData?.items?.length) {
          navigate("/cart", { replace: true });
          return;
        }

        setCart(cartData);
        setShippingLocations(locations || []);
        setAddresses(savedAddresses || []);

        const defaultAddress = (savedAddresses || []).find(
          (address) => address.isDefault
        );

        if (defaultAddress) {
          selectAddress(defaultAddress);
        }
      } catch (error) {
        console.error("CHECKOUT LOAD ERROR:", error);
        setError(
          error.response?.data?.message ||
            "Could not load checkout."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, [navigate]);

  const selectAddress = (address) => {
    setSelectedAddressId(String(address.id));

    setFormData({
      shippingName: address.fullName || "",
      shippingPhone: address.phone || "",
      shippingAddress: address.address || "",
      shippingCity: address.city || "",
      shippingState: address.state || "",
      shippingCountry: address.country || "Nigeria",
    });

    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleAddressChange = (event) => {
    const { name, value, type, checked } = event.target;

    setAddressForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setAddressError("");
  };

  const handleAddressSelect = (event) => {
    const id = event.target.value;

    setSelectedAddressId(id);

    if (!id) {
      setFormData(emptyCheckout);
      return;
    }

    const address = addresses.find(
      (item) => item.id === Number(id)
    );

    if (address) {
      selectAddress(address);
    }
  };

  const saveAddress = async () => {
    setAddressError("");

    if (
      !addressForm.fullName ||
      !addressForm.phone ||
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.country
    ) {
      setAddressError("Please complete all address fields.");
      return;
    }

    try {
      setSavingAddress(true);

      const newAddress = await createAddress(addressForm);
      const updatedAddresses = await getAddresses();

      setAddresses(updatedAddresses);

      const savedAddress =
        updatedAddresses.find(
          (address) => address.id === newAddress.id
        ) || newAddress;

      selectAddress(savedAddress);

      setAddressForm(emptyAddress);
      setShowAddressForm(false);
    } catch (error) {
      console.error("SAVE ADDRESS ERROR:", error);
      setAddressError(
        error.response?.data?.message ||
          "Could not save address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (placingOrder) return;

    if (
      !formData.shippingName ||
      !formData.shippingPhone ||
      !formData.shippingAddress ||
      !formData.shippingCity ||
      !formData.shippingState ||
      !formData.shippingCountry
    ) {
      setError("Please complete your delivery information.");
      return;
    }

    if (!shippingLocationId) {
      setError("Please select your delivery location.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const data = await createOrder({
        ...formData,
        shippingLocationId: Number(shippingLocationId),
      });

      if (!data?.order?.id) {
        throw new Error("Order could not be created.");
      }

      // Payment comes next.
      // Cart and stock are not changed yet.
      navigate(`/payment/${data.order.id}`);
    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Could not create your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-[#6F756F]">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-red-600">{error}</p>

          <Link
            to="/cart"
            className="mt-6 inline-flex items-center gap-2 text-sm text-[#124C3B]"
          >
            <ArrowLeft size={17} />
            Back to cart
          </Link>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.book.price) * Number(item.quantity),
    0
  );

  const selectedLocation = shippingLocations.find(
    (location) =>
      location.id === Number(shippingLocationId)
  );

  const shippingFee = selectedLocation
    ? Number(selectedLocation.fee)
    : 0;

  const total = subtotal + shippingFee;

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-6 py-10 sm:py-14">
        <div className="mb-10">
          <Link
            to="/cart"
            className="mb-5 inline-flex items-center gap-2 text-sm text-[#6F756F] hover:text-[#124C3B] rounded-3xl"
          >
            <ArrowLeft size={17} />
            Back to cart
          </Link>

          <h1 className="text-4xl text-[#124C3B] sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-3 text-sm text-[#6F756F] sm:text-base">
            Confirm your delivery details before payment.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            {/* LEFT */}
            <div className="space-y-8">
              {/* SAVED ADDRESSES */}
              <section className="border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl text-[#124C3B]">
                      Delivery address
                    </h2>

                    <p className="mt-2 text-sm text-[#6F756F]">
                      Choose a saved address or add a new one.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowAddressForm(!showAddressForm)
                    }
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#124C3B]"
                  >
                    <Plus size={17} />
                    Add
                  </button>
                </div>

                {addresses.length > 0 && (
                  <select
                    value={selectedAddressId}
                    onChange={handleAddressSelect}
                    className="mt-6 w-full border border-[#DED8CC] bg-white px-4 py-3 text-sm-none focus:border-[#124C3B]"
                  >
                    <option value="">
                      Select a saved address
                    </option>

                    {addresses.map((address) => (
                      <option
                        key={address.id}
                        value={address.id}
                      >
                        {address.label}
                        {address.isDefault
                          ? " (Default)"
                          : ""}
                      </option>
                    ))}
                  </select>
                )}

                {/* NEW ADDRESS */}
                {showAddressForm && (
                  <div className="mt-7 border-t border-[#DED8CC] pt-7">
                    <h3 className="text-xl text-[#124C3B]">
                      Add new address
                    </h3>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <input
                        name="label"
                        value={addressForm.label}
                        onChange={handleAddressChange}
                        placeholder="Label e.g. Home"
                        className="border border-[#DED8CC] bg-white px-4 py-3 text-sm-none rounded-3xl focus:border-[#124C3B]"
                      />

                      <input
                        name="fullName"
                        value={addressForm.fullName}
                        onChange={handleAddressChange}
                        placeholder="Full name"
                        className="border border-[#DED8CC] bg-white px-4 py-3 text-sm-none rounded-3xl focus:border-[#124C3B]"
                      />

                      <input
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        placeholder="Phone number"
                        className="border border-[#DED8CC] bg-white px-4 py-3 text-sm-none rounded-3xl focus:border-[#124C3B]"
                      />

                      <input
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        className="border border-[#DED8CC] bg-white px-4 py-3 rounded-3xl text-sm-none focus:border-[#124C3B]"
                      />

                      <input
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                        className="border border-[#DED8CC] bg-white px-4 py-3 rounded-3xl text-sm-none focus:border-[#124C3B]"
                      />

                      <input
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        placeholder="Country"
                        className="border border-[#DED8CC] bg-white px-4 py-3  rounded-3xl text-sm-none focus:border-[#124C3B]"
                      />

                      <textarea
                        name="address"
                        value={addressForm.address}
                        onChange={handleAddressChange}
                        placeholder="Full delivery address"
                        rows="3"
                        className="border border-[#DED8CC] bg-white px-4 py-3 rounded-3xl text-sm-none focus:border-[#124C3B] sm:col-span-2"
                      />

                      <label className="flex items-center gap-2 text-sm text-[#6F756F]">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={addressForm.isDefault}
                          onChange={handleAddressChange}
                        />
                        Make this my default address
                      </label>
                    </div>

                    {addressError && (
                      <p className="mt-4 text-sm text-red-600">
                        {addressError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={saveAddress}
                      disabled={savingAddress}
                      className="mt-5 bg-[#124C3B] px-5 py-3 text-sm font-medium rounded-3xl text-white disabled:opacity-50"
                    >
                      {savingAddress
                        ? "Saving..."
                        : "Save address"}
                    </button>
                  </div>
                )}
              </section>

              {/* SHIPPING DETAILS */}
              <section className="border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-7">
                <h2 className="text-2xl text-[#124C3B]">
                  Shipping information
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <input
                    name="shippingName"
                    value={formData.shippingName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="border border-[#DED8CC] bg-white px-4 py-3 text-sm-none rounded-3xl focus:border-[#124C3B]"
                  />

                  <input
                    name="shippingPhone"
                    value={formData.shippingPhone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="border border-[#DED8CC] bg-white px-4 py-3 text-sm-none rounded-3xl focus:border-[#124C3B]"
                  />

                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    placeholder="Delivery address"
                    rows="3"
                    className="border border-[#DED8CC] bg-white rounded-3xl px-4 py-3 text-sm-none focus:border-[#124C3B] sm:col-span-2"
                  />

                  <input
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    placeholder="City"
                    className="border border-[#DED8CC] bg-white rounded-3xl px-4 py-3 text-sm-none focus:border-[#124C3B]"
                  />

                  <input
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleChange}
                    placeholder="State"
                    className="border border-[#DED8CC] bg-white rounded-3xl px-4 py-3 text-sm-none focus:border-[#124C3B]"
                  />

                  <input
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    placeholder="Country"
                    className="border border-[#DED8CC] rounded-3xl bg-white px-4 py-3 text-sm-none focus:border-[#124C3B]"
                  />

                  <select
                    value={shippingLocationId}
                    onChange={(event) => {
                      setShippingLocationId(
                        event.target.value
                      );
                      setError("");
                    }}
                    className="border border-[#DED8CC] rounded-3xl bg-white px-4 py-3 text-sm-none focus:border-[#124C3B]"
                  >
                    <option value="">
                      Select delivery location
                    </option>

                    {shippingLocations.map((location) => (
                      <option
                        key={location.id}
                        value={location.id}
                      >
                        {location.name} — ₦
                        {Number(
                          location.fee
                        ).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="h-fit border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-7 lg:sticky lg:top-6">
              <h2 className="text-2xl text-[#124C3B]">
                Order summary
              </h2>

              <div className="mt-6 space-y-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >
                    <div className="h-20 w-14 shrink-0 overflow-hidden bg-[#F7F3EC]">
                      {item.book.coverImage ? (
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-[#6F756F]">
                          No cover
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium">
                        {item.book.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#6F756F]">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        ₦
                        {(
                          Number(item.book.price) *
                          Number(item.quantity)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-[#DED8CC] pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6F756F]">
                    Subtotal
                  </span>
                  <span>
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-[#6F756F]">
                    Shipping
                  </span>
                  <span>
                    {selectedLocation
                      ? `₦${shippingFee.toLocaleString()}`
                      : "Select location"}
                  </span>
                </div>

                <div className="mt-5 flex justify-between border-t border-[#DED8CC] pt-5">
                  <span className="font-medium">
                    Total
                  </span>
                  <span className="text-xl font-semibold text-[#124C3B]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {error && (
                <p className="mt-5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  placingOrder ||
                  !shippingLocationId ||
                  items.length === 0
                }
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-[#124C3B] text-sm font-medium text-white hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:bg-[#9AA19C]"
              >
                <Lock size={17} />

                {placingOrder
                  ? "Creating order..."
                  : "Continue to payment"}
              </button>

              <p className="mt-4 text-center text-xs text-[#6F756F]">
                Payment will be handled on the next step.
              </p>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;