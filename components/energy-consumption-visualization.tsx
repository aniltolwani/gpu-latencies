'use client'

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Data structure for energy consumption visualization
// Each array represents a column, and each object within the array represents an energy item
// The data is organized in increasing order of magnitude: kWh, MWh, GWh, TWh, PWh
const energyData = [
  // Column 1: kWh (Small scale)
  [
    { label: '1 kWh', blocks: 1, color: 'bg-green-300', scale: true },
    { label: '1 Laptop (Daily Usage)', value: '~0.2 kWh', blocks: 0.2, color: 'bg-green-300' },
    { label: 'Single GPU (H100, per hour)', value: '~0.7 kWh', blocks: 0.7, color: 'bg-green-300' },
    { label: 'GPT-1 Training', value: '100 kWh', blocks: 100, color: 'bg-green-300'},
    { label: '1000 kWh', value: '1000 kWh', blocks: 1000, color: 'bg-blue-300', nextColor: 'bg-blue-300', scale: true, equivalency: true },
  ],
  // Column 2: MWh (Medium scale)
  [
    { label: '1 MWh', blocks: 1, color: 'bg-blue-300', scale: true },
    { label: 'GPT-2 Training', value: '1 MWh', blocks: 1, color: 'bg-blue-300' },
    { label: '1 US Home (Annual)', value: '~10 MWh', blocks: 10, color: 'bg-blue-300' },
    { label: 'Average Academic AI Research Center (100 H100s, per year)', value: '~613 MWh', blocks: 613, color: 'bg-blue-300' },
    { label: '1000 MWh', value: '1000 MWh', blocks: 1000, color: 'bg-blue-300', nextColor: 'bg-yellow-300', scale: true, equivalency: true },
  ],
  // Column 3: GWh (Large scale)
  [
    { label: '1 GWh', blocks: 1, color: 'bg-yellow-300', scale: true },
    { label: 'GPT-3 Training', value: '1.287 GWh', blocks: 1.287, color: 'bg-yellow-300'},
    { label: 'GPT-4 Training (Estimate)', value: '10 GWh', blocks: 10, color: 'bg-yellow-300' },
    { label: 'Small City (Annual)', value: '~20 GWh', blocks: 20, color: 'bg-yellow-300'},
    { label: '1000 GWh', value: '1000 GWh', blocks: 1000, color: 'bg-yellow-300', nextColor: 'bg-red-300', scale: true, equivalency: true },
  ],
  // Column 4: TWh (Massive scale)
  [
    { label: '1 TWh', blocks: 1, color: 'bg-red-300', scale: true },
    { label: 'OpenAI 2025 Cluster (Estimate)', value: '~100 TWh', blocks: 100, color: 'bg-red-300' },
    { label: 'Meta Cluster (350k H100s, Annual)', value: '~2.15 TWh', blocks: 2.15, color: 'bg-red-300' },
    { label: '1000 TWh', value: '1000 TWh', blocks: 1000, color: 'bg-red-300', nextColor: 'bg-purple-300', scale: true, equivalency: true },
  ],
  // Column 5: PWh (Extreme scale)
  [
    { label: '1 PWh', blocks: 1, color: 'bg-purple-300', scale: true },
    { label: 'US Power Grid (Annual)', value: '~4 PWh', blocks: 4.26, color: 'bg-purple-300' },
    { label: 'World Power Grid (Annual)', value: '~30 PWh', blocks: 29.471, color: 'bg-purple-300' },
  ],
];

// Component to render a single colored block
const Block = ({ color }: { color: string }) => (
  <div className={`w-2 h-2 ${color} border border-gray-400 m-[0.5px] inline-block`} />
);

// Component to render a partially filled block
const PartialBlock = ({ fraction, color }: { fraction: number; color: string }) => (
  <div className={`w-2 h-2 border border-gray-400 m-[0.5px] inline-block relative overflow-hidden`}>
    <div
      className={`${color} absolute bottom-0 left-0 right-0`}
      style={{ height: `${fraction * 100}%` }}
    />
  </div>
);

// Component to render a grid of 100 blocks, with a specified number of them colored
const BlockGrid = ({ color, count }: { color: string; count: number }) => (
  <div className="inline-block m-[0.5px] border border-gray-400">
    <div className="grid grid-cols-10 gap-[0.5px] w-[30px] h-[30px]">
      {Array(100).fill(0).map((_, i) => (
        <div key={i} className={`w-[2px] h-[2px] ${i < count ? color : 'bg-gray-100'}`} />
      ))}
    </div>
  </div>
);

// Component to render a single energy item with its label, value, and visual representation
const EnergyItem = ({
  label,
  value,
  blocks,
  color,
  nextColor,
  equivalency,
}: {
  label: string;
  value?: string;
  blocks: number;
  color: string;
  nextColor?: string;
  equivalency?: boolean;
}) => {
  // Calculate the number of full grids, remaining blocks, and fractional part
  const fullGrids = Math.floor(blocks / 100);
  const remainingBlocks = Math.floor(blocks % 100);
  const fractionalPart = blocks % 1;

  // Helper function to determine the appropriate energy unit based on the number of blocks
  const getUnit = (blocks: number) => {
    if (blocks >= 1e12) return 'PWh';
    if (blocks >= 1e9) return 'TWh';
    if (blocks >= 1e6) return 'GWh';
    if (blocks >= 1e3) return 'MWh';
    return 'kWh';
  };

  // Helper function to format the number of blocks to a fixed decimal place
  const formatBlocks = (blocks: number) => {
    if (blocks >= 1e12) return (blocks / 1e12).toFixed(3);
    if (blocks >= 1e9) return (blocks / 1e9).toFixed(3);
    if (blocks >= 1e6) return (blocks / 1e6).toFixed(3);
    if (blocks >= 1e3) return (blocks / 1e3).toFixed(3);
    return blocks.toFixed(3);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mb-6 py-2 border-b border-gray-200 last:border-b-0">
            {/* Render the label and value */}
            <div className="text-xs mb-2 flex items-center justify-between">
              <span className="font-semibold">{label}</span>
              {equivalency && nextColor && (
                <span className="flex items-center">
                  <span className="mx-2">=</span>
                  <Block color={nextColor} />
                </span>
              )}
              {value && !equivalency && <span className="text-gray-500">({value})</span>}
            </div>
            {/* Render the visual representation of energy consumption */}
            <div className="flex flex-wrap items-end">
              {blocks >= 100 ? (
                <>
                  {/* Render full grids */}
                  {Array(Math.ceil(fullGrids / 10)).fill(0).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex flex-wrap w-full mb-1">
                      {Array(Math.min(10, fullGrids - rowIndex * 10)).fill(0).map((_, i) => (
                        <BlockGrid key={i} color={color} count={100} />
                      ))}
                    </div>
                  ))}
                  {/* Render remaining blocks */}
                  {remainingBlocks > 0 && (
                    <BlockGrid color={color} count={remainingBlocks} />
                  )}
                  {/* Render fractional part */}
                  {fractionalPart > 0 && (
                    <PartialBlock fraction={fractionalPart} color={color} />
                  )}
                </>
              ) : (
                // Render individual blocks for small values
                <div className="flex flex-wrap">
                  {Array(Math.floor(blocks)).fill(0).map((_, i) => (
                    <Block key={i} color={color} />
                  ))}
                  {fractionalPart > 0 && (
                    <PartialBlock key="partial" fraction={fractionalPart} color={color} />
                  )}
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label}: {formatBlocks(blocks)} {getUnit(blocks)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Main component for rendering the entire energy consumption visualization
export function EnergyConsumptionVisualizationComponent() {
  return (
    // Main container: white background, centered, with max width
    <div className="p-6 bg-white font-mono text-sm mx-auto max-w-7xl">
      {/* Title of the visualization */}
      <h2 className="text-2xl font-bold mb-8 text-center">
        GPU Napkin Math
      </h2>
      {/* Grid container for energy data columns */}
      {/* Responsive layout: 1 column on small screens, up to 5 columns on extra large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {energyData.map((column, colIndex) => (
          // Individual column container: light gray background with rounded corners and shadow
          <div key={colIndex} className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-sm">
            {column.map((item, itemIndex) => (
              // Render each energy item within the column
              <EnergyItem key={itemIndex} {...item} />
            ))}
          </div>
        ))}
      </div>
      {/* Attribution and source information container */}
      {/* Small, centered text in gray */}
      <div className="mt-8 text-xs text-gray-600 text-center">
        <p>[github.com/chubin/late.nz] [MIT License]</p>
        <p>Adapted from &quot;Jeff Dean&apos;s latency numbers&quot;</p>
        <p>Original: [github.com/colin-scott/interactive_latencies]</p>
      </div>
    </div>
  );
}