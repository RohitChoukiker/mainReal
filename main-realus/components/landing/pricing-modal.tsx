"use client"

import { motion } from "framer-motion"
import { X, Check } from "lucide-react"

interface PricingModalProps {
  onClose: () => void
}

export default function PricingModal({ onClose }: PricingModalProps) {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for individual agents",
      features: [
        "Up to 10 active transactions",
        "Basic document management",
        "Email notifications",
        "Standard support",
        "1 user account",
      ],
      limitations: ["No team collaboration", "No AI insights", "Limited analytics"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      description: "Ideal for growing teams",
      features: [
        "Up to 50 active transactions",
        "Advanced document management",
        "Email & SMS notifications",
        "Priority support",
        "Up to 5 user accounts",
        "Team collaboration"      ],
      limitations: [],
      cta: "Try Free for 14 Days",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$249",
      description: "For established brokerages",
      features: [
        "Unlimited active transactions",
        "All notification channels",
         "Unlimited user accounts",
        "Advanced team collaboration",
        "Full AI-powered insights",
        "Advanced analytics & reporting"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center pt-72 overflow-y-auto">
      <motion.div
        className="bg-background rounded-xl shadow-xl w-full max-w-4xl relative my-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10">
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Pricing Plans</h2>
            <p className="text-muted-foreground mt-2">Choose the perfect plan for your real estate business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl border ${
                  plan.popular ? "border-primary shadow-lg relative" : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="ml-1 text-xl font-semibold text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="ml-2 text-sm text-foreground">{feature}</span>
                      </li>
                    ))}

                    {plan.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0">
                          <X className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="ml-2 text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <button
                      type="button"
                      className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-background text-primary border border-primary hover:bg-primary/10"
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-medium text-foreground">Can I switch plans later?</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next
                  billing cycle.
                </p>
              </div>

              <div>
                <h4 className="text-base font-medium text-foreground">Is there a setup fee?</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  No, there are no setup fees for any of our plans. You only pay the monthly subscription.
                </p>
              </div>

              <div>
                <h4 className="text-base font-medium text-foreground">Do you offer annual billing?</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Yes, we offer a 20% discount for annual billing on all plans. Contact our sales team for details.
                </p>
              </div>

              <div>
                <h4 className="text-base font-medium text-foreground">What payment methods do you accept?</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  We accept all major credit cards, ACH transfers, and PayPal for payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

