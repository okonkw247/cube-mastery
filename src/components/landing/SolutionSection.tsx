import { Check, Target, Layers, Zap } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Layer-by-Layer System",
    description: "Our proven method breaks the cube into manageable layers. Master each one before moving on.",
  },
  {
    icon: Target,
    title: "Clear Progression",
    description: "From first solve to sub-30 seconds. Every lesson builds on the last with clear milestones.",
  },
  {
    icon: Zap,
    title: "Speed Techniques",
    description: "Advanced finger tricks, lookahead training, and algorithm optimization for serious speedcubers.",
  },
];

const benefits = [
  "50+ HD video lessons",
  "Printable algorithm sheets",
  "Practice routines",
  "Progress tracking",
  "Community access",
  "Lifetime updates",
];

const SolutionSection = () => {
  return (
    <section id="solution" className="py-24 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">The Solution</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            The CubeMaster Method
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A structured, step-by-step video system designed by speedcubing champions to get you solving fast.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Card */}
          <div className="card-gradient rounded-3xl p-8 sm:p-10 border border-border">
            <h3 className="text-2xl font-bold mb-8">What You Get</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
