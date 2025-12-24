import { Button } from "@/components/ui/button";
import { Download, FileText, Timer, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const bonuses = [
  {
    icon: FileText,
    title: "Algorithm Cheat Sheet",
    description: "All essential algorithms on one printable page",
  },
  {
    icon: Timer,
    title: "Practice Routine Guide",
    description: "Daily drills to build muscle memory fast",
  },
  {
    icon: BookOpen,
    title: "Speedcubing Glossary",
    description: "Learn the language of competitive cubing",
  },
];

const BonusSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Download className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Free Bonus</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Get Your Free <span className="text-gradient">Starter Kit</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Sign up today and get instant access to these bonus resources — no payment required.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {bonuses.map((bonus, index) => (
              <div
                key={index}
                className="card-gradient rounded-2xl p-6 border border-border text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <bonus.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{bonus.title}</h3>
                <p className="text-sm text-muted-foreground">{bonus.description}</p>
              </div>
            ))}
          </div>

          <Link to="/auth?mode=signup">
            <Button variant="hero" size="xl" className="gap-3">
              Get Free Access
              <Download className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BonusSection;
