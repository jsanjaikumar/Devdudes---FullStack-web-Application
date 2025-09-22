import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const membershipData = {
  silver: {
    title: "Silver Membership",
    price: "₹299",
    duration: "3 months",
    highlight: "Best for trying premium features",
    features: [
      "Unlimited chat access",
      "100 connection requests per day",
      "Profile badge (Blue Tick)",
      "Priority in search results",
      "Basic analytics (profile views)",
    ],
    ctaLabel: "Buy Silver",
    btnStyle: "bg-violet-600 hover:bg-violet-700",
  },
  gold: {
    title: "Gold Membership",
    price: "₹699",
    duration: "6 months",
    highlight: "For power users and creators",
    features: [
      "Unlimited chat access",
      "Unlimited connection requests",
      "Prominent Blue Tick",
      "Top placement in recommendations",
      "Advanced analytics and insights",
      "Priority support",
    ],
    ctaLabel: "Buy Gold",
    btnStyle: "bg-emerald-500 hover:bg-emerald-600",
  },
};

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(""); // "silver" | "gold" | ""

  useEffect(() => {
    verifyPremiumUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // verify the user is premium or not
  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });
      if (res.data.isPremium) {
        setIsUserPremium(true);
      } else {
        setIsUserPremium(false);
      }
    } catch (err) {
      console.error(err?.response ?? err);
    }
  };

  const handleBuyClick = async (type) => {
    if (loadingPlan) return;
    setLoadingPlan(type);
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType: type,
        },
        { withCredentials: true }
      );

      const { orderId, amount, currency, razorpayKeyId, notes } = order.data;
      const options = {
        key: razorpayKeyId,
        amount,
        currency,
        name: "Dev Dudes",
        description: `Purchase ${type} membership`,
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: notes.contact || "9999999999",
        },
        theme: {
          color: "#7c3aed", // violet primary
        },
        handler: async (response) => {
          // call verify after payment succeeded
          await verifyPremiumUser();
          setLoadingPlan("");
        },
        modal: {
          ondismiss: () => setLoadingPlan(""),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err?.response ?? err);
      setLoadingPlan("");
    }
  };

  if (isUserPremium)
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white/6 backdrop-blur-md border border-white/8 rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-2">
            You are already a Premium member
          </h2>
          <p className="text-sm text-white/70 mb-4">
            Thanks for supporting Dev Dudes — enjoy your premium features.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              className="px-4 py-2 rounded-lg bg-white/6 text-white border border-white/8"
              onClick={() => window.location.reload()}
            >
              Refresh status
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold"
              onClick={() => window.open("/help/premium", "_blank")}
            >
              Manage membership
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Headline */}
        <div className="lg:col-span-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Get Premium on Dev Dudes
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Unlock advanced features to grow connections, boost visibility and
            access premium-only tools.
          </p>
        </div>

        {/* Silver */}
        <PlanCard
          planKey="silver"
          data={membershipData.silver}
          onBuy={() => handleBuyClick("silver")}
          loading={loadingPlan === "silver"}
        />

        {/* Gold */}
        <PlanCard
          planKey="gold"
          data={membershipData.gold}
          onBuy={() => handleBuyClick("gold")}
          loading={loadingPlan === "gold"}
        />
      </div>
    </div>
  );
};

const PlanCard = ({ planKey, data, onBuy, loading }) => {
  return (
    <div className="relative">
      <div className="min-h-[28rem] flex flex-col justify-between rounded-2xl overflow-hidden bg-gradient-to-b from-white/4 to-transparent border border-white/8 shadow-[0_20px_50px_rgba(2,2,12,0.6)]">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{data.title}</h3>
              <p className="text-sm text-white/60 mt-1">{data.highlight}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-white">{data.price}</div>
              <div className="text-xs text-white/60">{data.duration}</div>
            </div>
          </div>

          <hr className="my-4 border-white/8" />

          <ul className="grid gap-2 text-sm text-white/90 mb-6">
            {data.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/6 text-white text-xs">
                  ✓
                </span>
                <span className="leading-tight">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={onBuy}
            disabled={loading}
            className={`w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-violet-400 ${
              loading ? "bg-violet-500/60 cursor-not-allowed" : `${data.btnStyle} shadow-lg`
            }`}
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <span>{data.ctaLabel}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 10a1 1 0 011-1h10.586l-3.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 01-1-1z" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {planKey === "gold" && (
        <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-sm font-semibold text-black shadow-md">
          Best value
        </div>
      )}
    </div>
  );
};


export default Premium;
