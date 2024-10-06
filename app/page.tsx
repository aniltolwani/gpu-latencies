'use client';

import { EnergyConsumptionVisualizationComponent } from "@/components/latency-visualization";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-lg font-bold mb-6 font-mono">GPU Napkin Math</h1>
      <EnergyConsumptionVisualizationComponent />
    </main> 
  );
}
