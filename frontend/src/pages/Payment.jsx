import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import PaystackPop from "@paystack/inline-js";

import { getOrderById } from "../services/orderService";
import {
  initializePayment,
  verifyPayment,
} from "../services/paymentService";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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
        console.error("PAYMENT ORDER ERROR:", error);

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

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError("");

      const data = await initializePayment(
        Number(id)
      );

      const accessCode =
        data?.payment?.accessCode;

      if (!accessCode) {
        throw new Error(
          "Paystack did not return an access code."
        );
      }

      const popup = new PaystackPop();

      popup.resumeTransaction(accessCode, {
        onSuccess: async (transaction) => {
          try {
            setProcessing(true);

            await verifyPayment(
              transaction.reference
            );

            navigate(`/orders/${id}`);
          } catch (error) {
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error
            );

            setError(
              error.response?.data?.message ||
                "Payment was completed but verification failed. Please contact support."
            );
          } finally {
            setProcessing(false);
          }
        },

        onCancel: () => {
          setProcessing(false);
          setError(
            "Payment was cancelled. Your order is still pending."
          );
        },
      });
    } catch (error) {
      console.error(
        "PAYMENT INITIALIZATION ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment."
      );

      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-[#6F756F]">
            Loading payment...
          </p>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <Link
            to="/cart"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#124C3B]"
          >
            <ArrowLeft size={17} />
            Back to cart
          </Link>
        </div>
      </main>
    );
  }

  const isPaid =
    order?.paymentStatus === "paid";

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <Link
            to={`/orders/${id}`}
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#6F756F] transition hover:text-[#124C3B]"
          >
            <ArrowLeft size={17} />
            Back to order
          </Link>

          <div className="border border-[#DED8CC] bg-[#FFFDF8] p-6 sm:p-8">
            <div className="text-center">
              <Lock
                size={28}
                className="mx-auto text-[#124C3B]"
              />

              <h1 className="mt-4 text-3xl text-[#124C3B] sm:text-4xl">
                {isPaid
                  ? "Payment complete"
                  : "Complete your payment"}
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#6F756F]">
                Order #{order.id}
              </p>
            </div>

            <div className="mt-8 border-t border-[#DED8CC] pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6F756F]">
                  Subtotal
                </span>

                <span className="font-medium">
                  ₦
                  {Number(
                    order.subtotal
                  ).toLocaleString()}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-[#6F756F]">
                  Shipping
                </span>

                <span className="font-medium">
                  ₦
                  {Number(
                    order.shippingFee
                  ).toLocaleString()}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#DED8CC] pt-5">
                <span className="font-medium">
                  Total
                </span>

                <span className="text-2xl font-semibold text-[#124C3B]">
                  ₦
                  {Number(
                    order.total
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {error && (
              <p className="mt-6 text-sm leading-5 text-red-600">
                {error}
              </p>
            )}

            {!isPaid ? (
              <button
                type="button"
                onClick={handlePayment}
                disabled={processing}
                className="mt-8 flex h-12 w-full items-center justify-center gap-2 bg-[#124C3B] px-6 text-sm font-medium text-white transition hover:bg-[#0D3D30] disabled:cursor-not-allowed disabled:bg-[#9AA19C]"
              >
                <Lock size={17} />

                {processing
                  ? "Processing..."
                  : "Pay now"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  navigate(`/orders/${id}`)
                }
                className="mt-8 h-12 w-full bg-[#124C3B] text-sm font-medium text-white transition hover:bg-[#0D3D30]"
              >
                View order
              </button>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-[#6F756F]">
              You will complete payment securely through
              Paystack.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Payment;