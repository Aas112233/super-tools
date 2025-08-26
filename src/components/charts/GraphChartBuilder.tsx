import React, { useState, useCallback } from 'react';
import { Share, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface GraphChartBuilderProps {
  className?: string;
}

interface GraphNode {
  id: string;
  name: string;
  value?: number;
  category?: number;
  symbolSize?: number;
  itemStyle?: { color?: string; };
}

interface GraphLink {
  source: string;
  target: string;
  value?: number;
}

interface ChartData {
  title: string;
  nodes: GraphNode[];
  links: GraphLink[];
  categories: Array<{ name: string; itemStyle?: { color?: string; }; }>;
}

const GraphChartBuilder: React.FC<GraphChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Network Relationship Graph',
    categories: [
      { name: 'Core', itemStyle: { color: '#5470c6' } },
      { name: 'Management', itemStyle: { color: '#91cc75' } },
      { name: 'External', itemStyle: { color: '#fac858' } }
    ],
    nodes: [
      { id: 'CEO', name: 'CEO', value: 50, category: 1, symbolSize: 40 },
      { id: 'CTO', name: 'CTO', value: 40, category: 1, symbolSize: 35 },
      { id: 'Dev1', name: 'Developer 1', value: 25, category: 0, symbolSize: 25 },
      { id: 'Dev2', name: 'Developer 2', value: 25, category: 0, symbolSize: 25 },
      { id: 'Client', name: 'Client', value: 15, category: 2, symbolSize: 20 }
    ],
    links: [
      { source: 'CEO', target: 'CTO', value: 5 },
      { source: 'CTO', target: 'Dev1', value: 3 },
      { source: 'CTO', target: 'Dev2', value: 3 },
      { source: 'Dev1', target: 'Client', value: 2 },
      { source: 'Dev2', target: 'Client', value: 2 }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    layout: 'force' as 'force' | 'circular',
    roam: true,
    showLabels: true,
    edgeLength: 150,
    repulsion: 1000
  });

  const generateChartOption = useCallback((): EChartsOption => {
    try {
      return {
        title: {
          text: chartData.title,
          left: 'center',
          textStyle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.dataType === 'node') {
              return `<strong>${params.data.name}</strong><br/>Value: ${params.data.value || 0}`;
            }
            return `${params.data.source} → ${params.data.target}`;
          }
        },
        legend: {
          data: chartData.categories.map(cat => cat.name),
          top: 40
        },
        series: [{
          type: 'graph',
          layout: chartOptions.layout,
          data: chartData.nodes,
          links: chartData.links,
          categories: chartData.categories,
          roam: chartOptions.roam,
          label: {
            show: chartOptions.showLabels,
            position: 'right',
            fontSize: 12
          },
          force: chartOptions.layout === 'force' ? {
            edgeLength: chartOptions.edgeLength,
            repulsion: chartOptions.repulsion,
            gravity: 0.2
          } : undefined,
          emphasis: {
            focus: 'adjacency',
            lineStyle: { width: 4 }
          }
        }]
      };
    } catch (error) {
      return { title: { text: 'Chart Error' }, series: [] };
    }
  }, [chartData, chartOptions]);

  const addNode = useCallback(() => {
    const newId = `Node_${Date.now()}`;
    setChartData(prev => ({
      ...prev,
      nodes: [...prev.nodes, {
        id: newId,
        name: `Node ${prev.nodes.length + 1}`,
        value: 20,
        category: 0,
        symbolSize: 20
      }]
    }));
  }, []);

  const removeNode = useCallback((index: number) => {
    const nodeToRemove = chartData.nodes[index];
    if (chartData.nodes.length > 2) {
      setChartData(prev => ({
        ...prev,
        nodes: prev.nodes.filter((_, i) => i !== index),
        links: prev.links.filter(link => 
          link.source !== nodeToRemove.id && link.target !== nodeToRemove.id
        )
      }));
    }
  }, [chartData.nodes]);

  const generateSampleData = useCallback((type: 'social' | 'org' | 'tech') => {
    const samples = {
      social: {
        title: 'Social Network',
        nodes: [
          { id: 'You', name: 'You', value: 50, category: 0, symbolSize: 40 },
          { id: 'Friend1', name: 'Best Friend', value: 35, category: 0, symbolSize: 32 },
          { id: 'Family', name: 'Family', value: 30, category: 1, symbolSize: 30 },
          { id: 'Work', name: 'Colleagues', value: 25, category: 2, symbolSize: 25 }
        ],
        links: [
          { source: 'You', target: 'Friend1', value: 5 },
          { source: 'You', target: 'Family', value: 5 },
          { source: 'You', target: 'Work', value: 3 }
        ]
      },
      org: {
        title: 'Organization Chart',
        nodes: [
          { id: 'CEO', name: 'CEO', value: 50, category: 1, symbolSize: 45 },
          { id: 'CTO', name: 'CTO', value: 40, category: 1, symbolSize: 40 },
          { id: 'Dev1', name: 'Developer 1', value: 20, category: 0, symbolSize: 20 },
          { id: 'Dev2', name: 'Developer 2', value: 20, category: 0, symbolSize: 20 }
        ],
        links: [
          { source: 'CEO', target: 'CTO', value: 5 },
          { source: 'CTO', target: 'Dev1', value: 3 },
          { source: 'CTO', target: 'Dev2', value: 3 }
        ]
      },
      tech: {
        title: 'Tech Stack',
        nodes: [
          { id: 'React', name: 'React', value: 40, category: 0, symbolSize: 35 },
          { id: 'Node', name: 'Node.js', value: 35, category: 1, symbolSize: 32 },
          { id: 'DB', name: 'Database', value: 25, category: 2, symbolSize: 25 }
        ],
        links: [
          { source: 'React', target: 'Node', value: 4 },
          { source: 'Node', target: 'DB', value: 3 }
        ]
      }
    };
    setChartData(prev => ({ ...prev, ...samples[type] }));
  }, []);

  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify({ type: 'graph-chart', data: chartData, options: chartOptions }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `graph-chart-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Export failed.');
    }
  }, [chartData, chartOptions]);

  return (
    <EChartsErrorBoundary>
      <div className={`graph-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Share className="w-6 h-6 text-cyan-500" />
            <h2 className="text-xl font-semibold text-gray-800">Graph/Network Chart Builder</h2>
          </div>
          <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <EChartsWrapper option={generateChartOption()} height={500} className="w-full" />
            </div>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={chartData.title}
                  onChange={(e) => setChartData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  placeholder="Chart title"
                />

                <select
                  value={chartOptions.layout}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, layout: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                >
                  <option value="force">Force Layout</option>
                  <option value="circular">Circular Layout</option>
                </select>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={chartOptions.showLabels}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                    className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">Show Labels</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={chartOptions.roam}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, roam: e.target.checked }))}
                    className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">Enable Zoom & Pan</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Templates</h3>
              <div className="space-y-2">
                <button onClick={() => generateSampleData('social')} className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  Social Network
                </button>
                <button onClick={() => generateSampleData('org')} className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                  Organization
                </button>
                <button onClick={() => generateSampleData('tech')} className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600">
                  Tech Stack
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Nodes ({chartData.nodes.length})</h3>
                <button onClick={addNode} className="flex items-center space-x-1 px-3 py-1 bg-cyan-500 text-white text-sm rounded hover:bg-cyan-600">
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {chartData.nodes.map((node, index) => (
                  <div key={node.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <span className="text-sm font-medium">{node.name}</span>
                    {chartData.nodes.length > 2 && (
                      <button onClick={() => removeNode(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default GraphChartBuilder;