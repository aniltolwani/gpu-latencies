'use client'

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const latencyData = [
  [
    { label: '1 ns', blocks: 1, color: 'bg-gray-300', scale: true },
    { label: 'L1 cache reference', value: '1 ns', blocks: 1, color: 'bg-gray-300' },
    { label: 'Branch mispredict', value: '3 ns', blocks: 3, color: 'bg-gray-300' },
    { label: 'L2 cache reference', value: '4 ns', blocks: 4, color: 'bg-gray-300' },
    { label: 'Mutex lock/unlock', value: '16 ns', blocks: 16, color: 'bg-gray-300' },
    { label: '100 ns', blocks: 100, color: 'bg-gray-300', nextColor: 'bg-blue-300', scale: true, equivalency: true },
  ],
  [
    { label: 'Main memory reference', value: '100 ns', blocks: 1, color: 'bg-blue-300' },
    { label: 'Compress 1KB with Snappy', value: '2.0 μs', blocks: 20, color: 'bg-blue-300' },
    { label: 'Send 2K bytes over 1 Gbps network', value: '11 μs', blocks: 110, color: 'bg-blue-300' },
    { label: 'Read 1 MB sequentially from memory', value: '1.177 μs', blocks: 12, color: 'bg-blue-300' },
    { label: '100 μs', blocks: 100, color: 'bg-blue-300', nextColor: 'bg-green-300', scale: true, equivalency: true },
  ],
  [
    { label: 'SSD random read', value: '16.0 μs', blocks: 16, color: 'bg-green-300' },
    { label: 'Round trip within same datacenter', value: '500.0 μs', blocks: 50, color: 'bg-green-300' },
    { label: 'Read 1 MB sequentially from SSD', value: '19.438 μs', blocks: 19, color: 'bg-green-300' },
    { label: '1 ms', blocks: 100, color: 'bg-green-300', nextColor: 'bg-red-300', scale: true, equivalency: true },
  ],
  [
    { label: 'Disk seek', value: '1.894645 ms', blocks: 189, color: 'bg-red-300' },
    { label: 'Read 1 MB sequentially from disk', value: '473.661 μs', blocks: 47, color: 'bg-red-300' },
    { label: 'Send packet CA->Netherlands->CA', value: '150.0 ms', blocks: 150, color: 'bg-red-300' },
  ],
];

const Block = ({ color }: { color: string }) => (
  <div className={`w-2 h-2 ${color} border border-gray-400 m-px inline-block`} />
);

const LatencyItem = ({ label, value, blocks, color, nextColor, scale, equivalency }: { label: string; value?: string; blocks: number; color: string; nextColor?: string; scale?: boolean; equivalency?: boolean }) => {
  const maxDisplayBlocks = 100;
  const displayBlocks = Math.min(blocks, maxDisplayBlocks);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mb-4">
            <div className="text-xs mb-1 flex items-center">
              <span className="mr-1">{label}</span>
              {equivalency && nextColor && (
                <span className="flex items-center">
                  <span className="mx-2">=</span>
                  <Block color={nextColor} />
                </span>
              )}
              {value && !equivalency && <span className="ml-1">({value})</span>}
            </div>
            <div className="flex flex-wrap w-24">
              {Array(displayBlocks).fill(0).map((_, i) => (
                <Block key={i} color={color} />
              ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}: {blocks} {scale ? 'units' : 'ns'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function LatencyVisualizationComponent() {
  return (
    <div className="p-4 bg-white font-mono text-sm">
      <h2 className="text-lg font-bold mb-4">Latency numbers every programmer should know</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {latencyData.map((column, colIndex) => (
          <div key={colIndex} className="space-y-2">
            {column.map((item, itemIndex) => (
              <LatencyItem key={itemIndex} {...item} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-600">
        <p>[github.com/chubin/late.nz] [MIT License]</p>
        <p>Console port of "Jeff Dean's latency numbers"</p>
        <p>from [github.com/colin-scott/interactive_latencies]</p>
      </div>
    </div>
  );
}