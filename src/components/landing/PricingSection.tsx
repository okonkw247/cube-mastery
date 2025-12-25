import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ContactModal from "@/components/modals/ContactModal";

const plans = [
  {
    id: "starter",
    name: "Starter Plan",
    price: "$29",
    period: "/month",
    description: "Perfect for beginners new to speedcubing.",
    features: [
      "Access to 15 video lessons",
      "Basic algorithm library",
      "Beginner practice routines",
      "Community forum access",
      "Weekly progress reports",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "$79",
    period: "/month",
    description: "Everything to become a speedcuber.",
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
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For schools and cubing clubs.",
    features: [],
    isEnterprise: true,
  },
];

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [contactOpen, setContactOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[0];

  const handlePlanSelect = () => {
    if (user) {
      // User is logged in - redirect to dashboard with plan info
      navigate(`/dashboard?upgrade=${selectedPlan}`);
    } else {
      // User not logged in - redirect to signup
      navigate(`/auth?mode=signup&plan=${selectedPlan}`);
    }
  };

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Choose A Plan That Suits You 👌
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            99% of students excel after subscribing to one of our plans
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          {/* Plan Image */}
          <div className="relative rounded-3xl overflow-hidden h-[500px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/80 via-destructive/60 to-primary/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-destructive to-destructive/50 animate-pulse-glow" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          </div>

          {/* Plan Selection */}
          <div className="space-y-4">
            {/* Plan Options */}
            <div className="space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    selectedPlan === plan.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedPlan === plan.id
                          ? "border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="font-semibold">{plan.name}</span>
                  </div>
                  <div className="text-right">
                    {plan.isEnterprise ? (
                      <span className="text-muted-foreground text-sm">View details</span>
                    ) : (
                      <span className="font-bold">
                        {plan.price}
                        <span className="text-muted-foreground font-normal text-sm">
                          {plan.period}
                        </span>
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Plan Details */}
            {!currentPlan.isEnterprise && (
              <div className="card-gradient rounded-2xl p-6 border border-border mt-6">
                <p className="text-muted-foreground mb-6">{currentPlan.description}</p>

                <ul className="space-y-3 mb-8">
                  {currentPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  onClick={handlePlanSelect}
                >
                  Continue With {currentPlan.name}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {currentPlan.isEnterprise && (
              <div className="card-gradient rounded-2xl p-6 border border-border mt-6 text-center">
                <p className="text-muted-foreground mb-6">
                  Perfect for schools, cubing clubs, and organizations. Get custom pricing, dedicated support, and group features.
                </p>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={() => setContactOpen(true)}
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </section>
  );
};

export default PricingSection;
