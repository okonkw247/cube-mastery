import { Clock, Frown, Shuffle } from "lucide-react";

const problems = [
  {
    icon: Shuffle,
    title: "Stuck & Confused",
    description: "You've tried YouTube tutorials but always get stuck at the same point. The cube feels impossible.",
  },
  {
    icon: Clock,
    title: "Painfully Slow",
    description: "You can technically solve it, but it takes 5+ minutes and you forget the algorithms constantly.",
  },
  {
    icon: Frown,
    title: "No Structure",
    description: "Random tips and tricks don't add up to real skill. You need a clear path from beginner to fast.",
  },
];

const ProblemSection = () => {
  return (
    <section id="problem" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">The Problem</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Why Most Cubers Stay Stuck
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Most people give up on the Rubik's Cube or plateau at slow times. Here's why.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="card-gradient rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-6 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
