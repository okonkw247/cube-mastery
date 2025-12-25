import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "privacy" | "terms" | "refund";
}

const content = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Information We Collect",
        text: "We collect information you provide directly, such as your name, email address, and payment information when you create an account or make a purchase. We also collect usage data to improve our services.",
      },
      {
        heading: "How We Use Your Information",
        text: "We use your information to provide and improve our services, process transactions, send you updates about your account, and communicate with you about our products.",
      },
      {
        heading: "Data Security",
        text: "We implement industry-standard security measures to protect your personal information. Your data is encrypted in transit and at rest.",
      },
      {
        heading: "Your Rights",
        text: "You have the right to access, update, or delete your personal information at any time. Contact us at privacy@jsncubing.com for any data-related requests.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    sections: [
      {
        heading: "Acceptance of Terms",
        text: "By accessing or using JSN Cubing, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.",
      },
      {
        heading: "User Accounts",
        text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      },
      {
        heading: "Subscription and Payments",
        text: "Paid subscriptions are billed according to the plan you select. You may cancel at any time, and your subscription will remain active until the end of the billing period.",
      },
      {
        heading: "Intellectual Property",
        text: "All content on JSN Cubing, including videos, text, and graphics, is owned by us and protected by copyright laws. You may not reproduce or distribute our content without permission.",
      },
    ],
  },
  refund: {
    title: "Refund Policy",
    sections: [
      {
        heading: "30-Day Money-Back Guarantee",
        text: "We offer a full refund within 30 days of your initial purchase if you're not satisfied with our service. Simply contact our support team.",
      },
      {
        heading: "How to Request a Refund",
        text: "Email us at support@jsncubing.com with your account email and order details. Refunds are typically processed within 5-7 business days.",
      },
      {
        heading: "Exclusions",
        text: "Refunds are not available for accounts that have been terminated due to violations of our Terms of Service or after the 30-day window has passed.",
      },
      {
        heading: "Subscription Cancellation",
        text: "You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.",
      },
    ],
  },
};

const LegalModal = ({ open, onOpenChange, type }: LegalModalProps) => {
  const data = content[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {data.sections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-2">{section.heading}</h3>
                <p className="text-muted-foreground leading-relaxed">{section.text}</p>
              </div>
            ))}
            <p className="text-sm text-muted-foreground pt-4 border-t border-border">
              Last updated: December 2024. If you have questions, contact us at support@jsncubing.com
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LegalModal;
