import { Card, CardContent } from "./UI/card";
import { Truck, ShieldCheck, Zap, Terminal, LayoutDashboard, Globe, BarChart, Building2 } from "lucide-react";

const aboutCards = [
  {
    icon: <Truck className="w-6 h-6 text-blue-600" />,
    title: "End-to-End Traceability",
    description: "Track each product's journey from origin to destination with blockchain-backed authenticity.",
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Built on Solana",
    description: "Fast, low-cost, and scalable infrastructure for real-time supply chain operations.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
    title: "Tamper-Proof Records",
    description: "Immutable and auditable data ideal for compliance and trust-building.",
  },
  {
    icon: <Terminal className="w-6 h-6 text-purple-600" />,
    title: "Smart Contract Automation",
    description: "Automate product updates, registration, and verification with on-chain logic.",
  },
  {
    icon: <LayoutDashboard className="w-6 h-6 text-pink-600" />,
    title: "User-Friendly Dashboard",
    description: "Business-ready interface for managing data without needing blockchain expertise.",
  },
  {
    icon: <BarChart className="w-6 h-6 text-indigo-600" />,
    title: "Real-Time Visibility",
    description: "Stakeholders get shared access and live updates for enhanced collaboration.",
  },
  {
    icon: <Building2 className="w-6 h-6 text-gray-600" />,
    title: "Enterprise Ready",
    description: "Designed to fit into real-world logistics, manufacturing, and retail operations.",
  },
  {
    icon: <Globe className="w-6 h-6 text-teal-600" />,
    title: "Decentralized & Scalable",
    description: "Future-proof architecture that's open to expansion with IoT, AI, and ESG systems.",
  },
];

export default function AboutCards() {
  return (
    <div id="about" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {aboutCards.map((card, idx) => (
        <Card key={idx} className="p-4 hover:shadow-xl transition-all duration-500 ease-in-out hover:scale-[1.03] hover:cursor-pointer">
          <CardContent className="flex flex-col items-start gap-4">
            <div className="p-2 rounded-full bg-gray-100 transition-colors duration-500">
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
