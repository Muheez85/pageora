import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

import { getOrderById } from "../services/orderService";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);

        setOrder(data);
      } catch (error) {
        console.error("GET ORDER ERROR:", error);

        setError(
          error.response?.data?.message ||
            "We couldn't load this order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-[#6F756F]">
            Loading your order...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <Link
            to="/books"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#124C3B]"
          >
            <ArrowLeft size={17} />
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  if (!order) return null;

  const isPaid = order.paymentStatus === "paid";

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-6 py-10 sm:py-14">

        {/* Success message */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#124C3B] text-white">
            <CheckCircle
              size={28}
              strokeWidth={1.8}
            />
          </div>

          <h1 className="mt-6 text-4xl text-[#124C3B] sm:text-5xl">
            Order received
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#6F756F] sm:text-base">
            Thanks for your order. We've received your request
            and will begin processing it once payment is confirmed.
          </p>

          <p className="mt-4 text-sm font-medium text-[#17211D]">
            Order #{order.id}
          </p>
        </div>

        {/* Main content */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1.3fr_0.7fr]">

          {/* Items */}
          <section className="border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-7">
            <h2 className="text-2xl text-[#124C3B]">
              Items in your order
            </h2>

            <div className="mt-6 divide-y divide-[#DED8CC]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-5 first:pt-0"
                >
                  <div className="h-28 w-20 shrink-0 overflow-hidden bg-[#F0F1F2]">
                    {item.book.coverImage ? (
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-xs text-[#6F756F]">
                        No cover
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg text-[#124C3B]">
                      {item.book.title}
                    </h3>

                    <p className="mt-2 text-sm text-[#6F756F]">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-2 text-sm text-[#6F756F]">
                      Price: ₦
                      {Number(
                        item.price
                      ).toLocaleString()}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-[#17211D]">
                      ₦
                      {Number(
                        item.subtotal
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order summary */}
          <aside className="h-fit border border-[#DED8CC] bg-[#FFFDF8] p-5 sm:p-7 lg:sticky lg:top-6">
            <h2 className="text-2xl text-[#124C3B]">
              Order summary
            </h2>

            <div className="mt-6 space-y-4">

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-[#6F756F]">
                  Subtotal
                </span>

                <span className="font-medium text-[#17211D]">
                  ₦
                  {Number(
                    order.subtotal
                  ).toLocaleString()}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span className="text-[#6F756F]">
                  Shipping
                </span>

                <span className="font-medium text-[#17211D]">
                  ₦
                  {Number(
                    order.shippingFee
                  ).toLocaleString()}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between border-t border-[#DED8CC] pt-4">
                <span className="font-medium text-[#17211D]">
                  Total
                </span>

                <span className="text-xl font-semibold text-[#124C3B]">
                  ₦
                  {Number(
                    order.total
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment status */}
            <div className="mt-7 border-t border-[#DED8CC] pt-6">
              <p className="text-xs uppercase tracking-[0.12em] text-[#6F756F]">
                Payment status
              </p>

              <p
                className={`mt-2 inline-flex px-3 py-2 text-sm font-medium capitalize ${
                  isPaid
                    ? "bg-[#E8F3EE] text-[#124C3B]"
                    : "bg-[#FFF1E8] text-[#C4551E]"
                }`}
              >
                {order.paymentStatus}
              </p>
            </div>

            {/* Order status */}
            <div className="mt-7 border-t border-[#DED8CC] pt-6">
              <p className="text-xs uppercase tracking-[0.12em] text-[#6F756F]">
                Order status
              </p>

              <p className="mt-2 inline-flex bg-[#F7F3EC] px-3 py-2 text-sm font-medium capitalize text-[#124C3B]">
                {order.status}
              </p>
            </div>

            {/* Shipping */}
            <div className="mt-7 border-t border-[#DED8CC] pt-6">
              <p className="text-xs uppercase tracking-[0.12em] text-[#6F756F]">
                Delivery details
              </p>

              <div className="mt-3 space-y-1 text-sm leading-6 text-[#17211D]">
                <p>{order.shippingName}</p>

                <p>{order.shippingPhone}</p>

                <p>{order.shippingAddress}</p>

                <p>
                  {order.shippingCity},{" "}
                  {order.shippingState}
                </p>

                <p>{order.shippingCountry}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Order actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">

          {/* Pay Now — only for unpaid orders */}
          {!isPaid && (
            <button
              type="button"
              onClick={() =>
                navigate(`/payment/${order.id}`)
              }
              className="inline-flex w-full items-center justify-center bg-[#E86A2A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#D95C20] sm:w-auto"
            >
              Pay now
            </button>
          )}

          {/* Continue Shopping */}
          <Link
            to="/books"
            className="inline-flex w-full items-center justify-center bg-[#124C3B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D3D30] sm:w-auto"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;