"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PricingPlan {
  name: string;
  price: string;
  currency: string;
  billingCycle: string;
  description: string;
  features: string[];
  cta: {
    text: string;
    link: string;
  };
  highlighted: boolean;
}

interface PricingCardsProps {
  plans: PricingPlan[];
}

function PricingCards({ plans }: PricingCardsProps) {
  return (
    <div className="max-w-7xl h-fit mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.02 }}
            className={`relative rounded-2xl p-4 transition-all ${
              plan.highlighted
                ? "bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-transparent bg-origin-border shadow-2xl"
                : "bg-gray-900/50 backdrop-blur-sm border border-gray-800"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-bl-2xl rounded-tr-2xl text-sm font-medium">
                Popular
              </div>
            )}

            <div className="mb-8">
              <h3
                className={`text-lg font-bold mb-2 ${
                  plan.highlighted
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
                    : "text-white"
                }`}
              >
                {plan.name}
              </h3>
              <p className="text-gray-400 text-sm">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-xs font-bold text-white">
                  {plan.currency}
                </span>
                <span className="text-gray-400">{plan.billingCycle}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <motion.div
              className={
                plan.highlighted
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"
                  : "bg-gray-800 rounded-lg"
              }
            >
              <Button
                size="lg"
                className={`w-full text-lg font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-transparent hover:bg-white/10 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                {plan.cta.text}
              </Button>
            </motion.div>

            {plan.highlighted && (
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-3xl opacity-30" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export { PricingCards };
