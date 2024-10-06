'use client';

import { EnergyConsumptionVisualizationComponent } from "@/components/energy-consumption-visualization";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 border-4 ">
      <div>
        <EnergyConsumptionVisualizationComponent />
      </div>
    </main> 
  );
}
