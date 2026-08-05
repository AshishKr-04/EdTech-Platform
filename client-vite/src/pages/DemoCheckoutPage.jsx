import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";

const DemoCheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loadUser } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [step, setStep] = useState("form"); // 'form' | 'processing' | 'success'
  const [error, setError] = useState("");

  // Card Form States (Starts empty to prompt actual user entry!)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/payments/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order details. Please make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePay = async (e) => {
    e.preventDefault();

    // 1. INPUT VALIDATION
    if (!cardName.trim()) {
      showToast("Cardholder name is required.", "error");
      return;
    }
    
    // Remove spaces and non-numeric chars from card number
    const numericCard = cardNumber.replace(/\D/g, "");
    if (numericCard.length !== 16) {
      showToast("Card number must be exactly 16 digits.", "error");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      showToast("Expiry date must be in MM/YY format.", "error");
      return;
    }

    const [month] = expiry.split("/").map(Number);
    if (month < 1 || month > 12) {
      showToast("Invalid expiry month (must be 01-12).", "error");
      return;
    }

    const numericCvv = cvv.replace(/\D/g, "");
    if (numericCvv.length !== 3) {
      showToast("CVV / CVC must be exactly 3 digits.", "error");
      return;
    }

    setPaying(true);
    setStep("processing");

    // Phase 1: Simulate banks connection delay (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Phase 2: Complete payment locally
    try {
      await api.post("/payments/demo-complete", { orderId });
      await loadUser();
      
      // Phase 3: Transition to successful checkmark screen (1500ms)
      setStep("success");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("Course enrolled successfully! Happy learning.", "success");
      // Phase 4: Redirect to Course Learning Player!
      navigate(`/learn/${order.course._id}`);
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
      showToast("Payment transaction failed. Please check inputs.", "error");
      setStep("form");
      setPaying(false);
    }
  };

  if (loading) return <p className="text-center mt-20 animate-pulse text-gray-500">Connecting billing gateways...</p>;
  if (error) return <p className="text-center mt-20 text-red-500 font-bold">{error}</p>;
  if (!order) return <p className="text-center mt-20">Order not found.</p>;

  const course = order.course;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 -mt-8">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-5 border border-gray-100">
        
        {/* LEFT COLUMN: ORDER SUMMARY (40% width) */}
        <div className="md:col-span-2 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-8 text-slate-800 flex flex-col justify-between">
          <div>
            <span className="bg-slate-200/60 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-slate-700">
              Order Summary
            </span>
            
            <div className="mt-8">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Purchasing Course</span>
              <h2 className="text-xl font-black mt-1 text-slate-900 leading-snug">{course.title}</h2>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {course.description || "Get immediate access to lectures, video lessons, and verifiable certificates."}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 mt-8 space-y-4">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Subtotal</span>
              <span className="text-slate-800 font-bold">₹{course.price || 0}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Platform Fee</span>
              <span className="text-emerald-650 font-bold">FREE</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold border-t border-slate-200 pt-4 text-slate-800">
              <span>Total Bill</span>
              <span className="text-xl text-yellow-400">₹{course.price || 0}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRANSACTION GATES (60% width) */}
        <div className="md:col-span-3 p-8 flex flex-col justify-center min-h-[400px]">
          
          {/* STEP 1: CARD BILLING FORM */}
          {step === "form" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">✨ Secured Billing Checkout</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Stripe key is inactive. Currently running in secure **Sandbox Payment Simulator**.
                </p>
              </div>

              <form onSubmit={handlePay} className="space-y-4">
                {/* Cardholder Name */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    placeholder="e.g. Rohit Kumar"
                    className="w-full border rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      placeholder="e.g. 4242 4242 4242 4242"
                      className="w-full border rounded-lg pl-3 pr-10 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-mono"
                    />
                    <span className="absolute right-3 top-2.5 text-xs">💳</span>
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                      placeholder="MM/YY"
                      className="w-full border rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      placeholder="e.g. 123"
                      maxLength="3"
                      className="w-full border rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-mono"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={paying}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs shadow-md transition transform hover:scale-[1.02] duration-200 mt-6"
                >
                  Pay ₹{course.price || 0} & Enroll
                </button>
              </form>

              <p className="text-[10px] text-center text-gray-400 font-medium">
                🔒 Protected by 256-bit SSL encryption | Demo Sandbox Checkout Mode
              </p>
            </div>
          )}

          {/* STEP 2: BANKS PROCESSING ANIMATION */}
          {step === "processing" && (
            <div className="text-center space-y-4">
              {/* Spinner */}
              <div className="h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">Authorizing Payment...</h3>
                <p className="text-xs text-gray-500 mt-1">Connecting securely to sandbox credit endpoints.</p>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CHECKMARK TRANSITION */}
          {step === "success" && (
            <div className="text-center space-y-4 animate-scale-up">
              {/* Checkmark */}
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 text-3xl shadow-inner border border-green-200">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-sm text-green-600">Payment Successful!</h3>
                <p className="text-xs text-gray-500 mt-1">Transaction approved. Redirecting to your learning player...</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default DemoCheckoutPage;
