import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic solve tutorial (5 videos)",
      "Beginner algorithms PDF",
      "Community forum access",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Full System",
    price: "$49",
    originalPrice: "$99",
    description: "Everything to become a speedcuber",
    features: [
      "50+ HD video lessons",
      "Advanced algorithm library",
      "Speed techniques masterclass",
      "Practice routines & drills",
      "Progress tracking dashboard",
      "Private Discord community",
      "1-on-1 coaching session",
      "Lifetime access & updates",
    ],
    cta: "Get Full Access",
    popular: true,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Choose Your Path
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Start free or unlock the full system. No subscriptions, just one-time access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 sm:p-10 border transition-all duration-300 ${
                plan.popular
                  ? "card-gradient border-primary/50 glow"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">{plan.originalPrice}</span>
                  )}
                </div>
                {plan.popular && (
                  <span className="text-sm text-primary mt-1 inline-block">One-time payment</span>
                )}
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth?mode=signup">
                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  size="lg"
                  className="w-full gap-2"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
