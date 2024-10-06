'use client'

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

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
  ],
  // Column 2: MWh (Medium scale)
  [
    { label: '1 MWh', blocks: 1, color: 'bg-blue-300', scale: true },
    { label: 'GPT-2 Training', value: '1 MWh', blocks: 1.2, color: 'bg-blue-300' },
    { label: '1 US Home (Annual)', value: '~10 MWh', blocks: 10, color: 'bg-blue-300' },
    { label: 'Geohotz Tinybox Pro', value: '~70 MWh', blocks: 70, color: 'bg-blue-300' },
  ],
  // Column 3: GWh (Large scale)
  [
    { label: '1 GWh', blocks: 1, color: 'bg-yellow-300', scale: true },
    { label: 'Stanford Natural Language Computing (64 H100, annual) ', value: '~392 MWh', blocks: .392, color: 'bg-blue-300' },
    { label: 'GPT-3 Training', value: '1.287 GWh', blocks: 1.287, color: 'bg-yellow-300'},
    { label: 'GPT-4 Training (Estimate)', value: '10 GWh', blocks: 10, color: 'bg-yellow-300' },
    { label: 'Small City (Annual)', value: '~20 GWh', blocks: 20, color: 'bg-yellow-300'},
  ],
  // Column 4: TWh (Massive scale)
  [
    { label: '1 TWh', blocks: 1, color: 'bg-red-300', scale: true },
    { label: 'Meta Cluster (350k H100s, Annual)', value: '~2.15 TWh', blocks: 2.15, color: 'bg-red-300' },
    { label: 'Nuclear Power Plant (Annual)', value: '~7.88 TWh', blocks: 7.88, color: 'bg-red-300' },
    { label: 'OpenAI 2025 Cluster (Estimate)', value: '~100 TWh', blocks: 100, color: 'bg-red-300' },
  ],
  // Column 5: PWh (Extreme scale)
  [
    { label: '1 PWh', blocks: 1, color: 'bg-purple-300', scale: true },
    { label: 'US Power Grid (Annual)', value: '~4 PWh', blocks: 4.26, color: 'bg-purple-300' },
    { label: 'World Power Grid (Annual)', value: '~30 PWh', blocks: 29.471, color: 'bg-purple-300' },
  ],
];

const colorScheme = {
  kWh: 'from-green-300 to-green-400',
  MWh: 'from-blue-300 to-blue-400',
  GWh: 'from-yellow-300 to-yellow-400',
  TWh: 'from-red-300 to-red-400',
  PWh: 'from-purple-300 to-purple-400',
};

interface BlockProps {
  color: string;
  size?: 'small' | 'large';
}

const Block: React.FC<BlockProps> = ({ color, size = 'small' }) => (
  <div 
    className={`
      ${size === 'small' ? 'w-2.5 h-2.5 md:w-3 md:h-3' : 'w-2 h-2 md:w-4 md:h-4'} 
      bg-gradient-to-br ${color} 
      border border-gray-400 
      m-[3px]
      inline-block 
      transition-all duration-300 ease-in-out 
      hover:scale-110
    `} 
    aria-hidden="true"
  />
);

interface PartialBlockProps {
  fraction: number;
  color: string;
}

const PartialBlock: React.FC<PartialBlockProps> = ({ fraction, color }) => (
  <div 
    className={`w-2.5 h-2.5 md:w-3 md:h-3 border border-gray-400 m-[3px] inline-block relative overflow-hidden transition-all duration-300 ease-in-out hover:scale-110`}
    aria-hidden="true"
  >
    <div
      className={`bg-gradient-to-br ${color} absolute bottom-0 left-0 right-0`}
      style={{ height: `${fraction * 100}%` }}
    />
  </div>
);

interface EnergyItemProps {
  label: string;
  value?: string;
  blocks: number;
  color: string;
  nextColor?: string;
  equivalency?: boolean;
}

const EnergyItem: React.FC<EnergyItemProps> = ({ label, value, blocks, color, nextColor, equivalency }) => {
  const fractionalPart = blocks % 1;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mb-4 py-1.5 border-b border-gray-200 last:border-b-0">
            <div className="text-xs mb-1.5 flex items-center justify-between">
              <span className="font-semibold text-gray-800">{label}</span>
              {equivalency && nextColor && (
                <span className="flex items-center">
                  <span className="mx-1.5">=</span>
                  <Block color={nextColor} />
                </span>
              )}
              {value && !equivalency && <span className="text-gray-600 text-[10px]">({value})</span>}
            </div>
            <div className="flex flex-wrap items-end">
              <div className="flex flex-wrap">
                {Array(Math.floor(blocks)).fill(0).map((_, i) => (
                  <Block key={i} color={color} />
                ))}
                {fractionalPart > 0 && (
                  <PartialBlock key="partial" fraction={fractionalPart} color={color} />
                )}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {label}{value ? `: ${value}` : ''}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Legend = () => (
  <div className="flex flex-wrap justify-center gap-3 mt-7">
    {Object.entries(colorScheme).map(([scale, color]) => (
      <div key={scale} className="flex items-center">
        <Block color={color} size="large" />
        <span className="ml-1.5 text-xs">{scale}</span>
      </div>
    ))}
  </div>
);

export function EnergyConsumptionVisualizationComponent() {
  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-xs mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        GPU &quot;Napkin Math&quot;
      </h1>
      <p className="text-base text-gray-600 text-center mb-6"> 
        How fast is energy consumption in LLMs growing?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {energyData.map((column, colIndex) => (
          <Card key={colIndex} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-gray-100 to-gray-200 p-3">
              <div className="text-xl font-bold mb-1.5 text-center text-gray-700 flex items-center justify-center">
                <span className="mr-1.5">{['kWh', 'MWh', 'GWh', 'TWh', 'PWh'][colIndex]}</span>
                <Block color={colorScheme[['kWh', 'MWh', 'GWh', 'TWh', 'PWh'][colIndex] as keyof typeof colorScheme]} size="large" />
              </div>
              <div className="text-xs font-normal text-gray-600 text-center whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                {colIndex === 0 ? '1 kWh = 1 Block' :
                 colIndex === 1 ? '1 MWh = 1,000 kWh' :
                 colIndex === 2 ? '1 GWh = 1,000 MWh' :
                 colIndex === 3 ? '1 TWh = 1,000 GWh' :
                 '1 PWh = 1,000 TWh'}
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {column.slice(1).map((item, itemIndex) => (
                <EnergyItem 
                  key={itemIndex} 
                  {...item} 
                  color={colorScheme[['kWh', 'MWh', 'GWh', 'TWh', 'PWh'][colIndex] as keyof typeof colorScheme]} 
                  nextColor={colorScheme[['MWh', 'GWh', 'TWh', 'PWh', 'PWh'][colIndex] as keyof typeof colorScheme]}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Legend />
      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>Inspired by <a href="https://github.com/chubin/late.nz" className="text-blue-600 hover:underline">github.com/chubin/late.nz</a> [MIT License]</p>
        <p>And from &quot;Jeff Dean&apos;s latency numbers&quot;</p>
      </div>
    </div>
  );
}