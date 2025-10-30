import { Card, CardContent } from "./UI/card";
import {
  SatelliteDish,
  Cpu,
  CloudUpload,
  BadgeCheck,
  QrCode,
  LineChart,
} from "lucide-react";

const comingSoonFeatures = [
  {
    icon: <SatelliteDish className="w-6 h-6 text-indigo-600" />,
    title: "IoT Integration",
    description: "Real-time data from sensors to track temperature, humidity, and location during transit.",
  },
  {
    icon: <Cpu className="w-6 h-6 text-rose-600" />,
    title: "AI-Powered Insights",
    description: "Predict delays, optimize routes, and flag anomalies using smart analytics.",
  },
  {
    icon: <CloudUpload className="w-6 h-6 text-sky-600" />,
    title: "CSV/ERP Sync",
    description: "Easily import/export supply chain data and sync with enterprise systems.",
  },
  {
    icon: <BadgeCheck className="w-6 h-6 text-emerald-600" />,
    title: "ESG Compliance Tracking",
    description: "Monitor and report on sustainability metrics across your supply chain.",
  },
  {
    icon: <QrCode className="w-6 h-6 text-purple-600" />,
    title: "QR Code Scanner",
    description: "Scan and verify product authenticity on the go using QR-based identity tracking.",
  },
  {
    icon: <LineChart className="w-6 h-6 text-yellow-500" />,
    title: "Advanced Analytics Dashboard",
    description: "Visualize product movement, performance, and partner reliability in real time.",
  },
];

export default function ComingSoonFeatures() {
  return (
    <section id="features">
      <h2 className="text-3xl font-bold text-center mb-10">🚧 Coming Soon Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {comingSoonFeatures.map((feature, idx) => (
          <Card key={idx} className="p-4 hover:shadow-xl transition-all duration-500 ease-in-out hover:scale-[1.03] hover:cursor-pointer">
            <CardContent className="flex flex-col items-start gap-4">
              <div className="p-2 rounded-full bg-gray-100 transition-colors duration-500">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
