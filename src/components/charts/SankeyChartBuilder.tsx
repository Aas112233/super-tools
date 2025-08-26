import React, { useState, useCallback } from 'react';
import { Share, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface SankeyChartBuilderProps {
  className?: string;
}

interface SankeyNode {
  name: string;
  id: string;
  value?: number;
  itemStyle?: {
    color?: string;
  };
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface ChartData {
  title: string;
  nodes: SankeyNode[];
  links: SankeyLink[];
}

/**
 * Isolated Sankey Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const SankeyChartBuilder: React.FC<SankeyChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Energy Flow Diagram',
    nodes: [
      { name: 'Coal', id: 'coal', itemStyle: { color: '#8B4513' } },
      { name: 'Natural Gas', id: 'gas', itemStyle: { color: '#4169E1' } },
      { name: 'Nuclear', id: 'nuclear', itemStyle: { color: '#FFD700' } },
      { name: 'Renewables', id: 'renewables', itemStyle: { color: '#32CD32' } },
      { name: 'Electricity', id: 'electricity', itemStyle: { color: '#FF6347' } },
      { name: 'Industry', id: 'industry', itemStyle: { color: '#708090' } },
      { name: 'Residential', id: 'residential', itemStyle: { color: '#20B2AA' } },
      { name: 'Transportation', id: 'transport', itemStyle: { color: '#FF69B4' } }
    ],
    links: [
      { source: 'coal', target: 'electricity', value: 35 },
      { source: 'gas', target: 'electricity', value: 25 },
      { source: 'nuclear', target: 'electricity', value: 20 },
      { source: 'renewables', target: 'electricity', value: 20 },
      { source: 'electricity', target: 'industry', value: 40 },
      { source: 'electricity', target: 'residential', value: 35 },
      { source: 'electricity', target: 'transport', value: 25 },
      { source: 'gas', target: 'industry', value: 15 },
      { source: 'gas', target: 'residential', value: 10 }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    layout: 'horizontal' as 'horizontal' | 'vertical',
    nodeWidth: 20,
    nodeGap: 8,
    layoutIterations: 32,
    showLabels: true,
    labelPosition: 'right' as 'left' | 'right' | 'top' | 'bottom',
    linkCurvature: 0.5,
    colorScheme: 'default' as 'default' | 'gradient' | 'category'
  });

  // Predefined color schemes for nodes
  const colorSchemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
    gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
    category: ['#ff7f50', '#87ceeb', '#da70d6', '#32cd32', '#ffd700', '#ff69b4', '#ba55d3', '#cd5c5c']
  };

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const processedNodes = chartData.nodes.map((node, index) => ({
        ...node,
        itemStyle: {
          color: chartOptions.colorScheme === 'default' 
            ? node.itemStyle?.color || colorSchemes.default[index % colorSchemes.default.length]
            : colorSchemes[chartOptions.colorScheme][index % colorSchemes[chartOptions.colorScheme].length]
        }
      }));

      return {
        title: {
          text: chartData.title,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1E293B'
          }
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: (params: any) => {
            try {
              if (params.dataType === 'node') {
                return `<strong>${params.name}</strong><br/>
                        Node Value: ${params.value || 'N/A'}`;
              } else if (params.dataType === 'edge') {
                return `<strong>${params.data.source}</strong> → <strong>${params.data.target}</strong><br/>
                        Flow: ${params.data.value}`;
              }
              return params.name;
            } catch (error) {
              return params.name || 'Unknown';
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          textStyle: {
            color: '#374151'
          }
        },
        series: [
          {
            type: 'sankey',
            data: processedNodes,
            links: chartData.links,
            orient: chartOptions.layout === 'horizontal' ? 'horizontal' : 'vertical',
            nodeWidth: chartOptions.nodeWidth,
            nodeGap: chartOptions.nodeGap,
            layoutIterations: chartOptions.layoutIterations,
            focusNodeAdjacency: 'allEdges',
            label: {
              show: chartOptions.showLabels,
              position: chartOptions.labelPosition,
              fontSize: 12,
              fontWeight: 'bold',
              color: '#374151'
            },
            lineStyle: {
              curveness: chartOptions.linkCurvature,
              opacity: 0.7
            },
            itemStyle: {
              borderWidth: 1,
              borderColor: '#ffffff'
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                opacity: 0.8
              },
              itemStyle: {
                borderWidth: 2,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
              }
            },
            animationDuration: 1500,
            animationEasing: 'cubicOut'
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating sankey chart option:', error);
      return {
        title: {
          text: 'Chart Error',
          left: 'center'
        },
        series: []
      };
    }
  }, [chartData, chartOptions]);

  // Safe data update handlers
  const updateNode = useCallback((index: number, field: keyof SankeyNode, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        nodes: prev.nodes.map((node, i) => {
          if (i === index) {
            if (field === 'itemStyle' && typeof value === 'string') {
              return { ...node, itemStyle: { color: value } };
            }
            return { ...node, [field]: value };
          }
          return node;
        })
      }));
    } catch (error) {
      console.error('Error updating node:', error);
    }
  }, []);

  const updateLink = useCallback((index: number, field: keyof SankeyLink, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        links: prev.links.map((link, i) => {
          if (i === index) {
            const updatedLink = { ...link, [field]: value };
            if (field === 'value') {
              updatedLink.value = Math.max(0, parseFloat(value) || 0);
            }
            return updatedLink;
          }
          return link;
        })
      }));
    } catch (error) {
      console.error('Error updating link:', error);
    }
  }, []);

  const addNode = useCallback(() => {
    try {
      const newId = `node_${Date.now()}`;
      setChartData(prev => ({
        ...prev,
        nodes: [
          ...prev.nodes,
          {
            name: `Node ${prev.nodes.length + 1}`,
            id: newId,
            itemStyle: { color: colorSchemes.default[prev.nodes.length % colorSchemes.default.length] }
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding node:', error);
    }
  }, []);

  const removeNode = useCallback((index: number) => {
    try {
      const nodeToRemove = chartData.nodes[index];
      if (nodeToRemove && chartData.nodes.length > 2) {
        setChartData(prev => ({
          ...prev,
          nodes: prev.nodes.filter((_, i) => i !== index),
          links: prev.links.filter(link => 
            link.source !== nodeToRemove.id && link.target !== nodeToRemove.id
          )
        }));
      }
    } catch (error) {
      console.error('Error removing node:', error);
    }
  }, [chartData.nodes]);

  const addLink = useCallback(() => {
    try {
      if (chartData.nodes.length >= 2) {
        setChartData(prev => ({
          ...prev,
          links: [
            ...prev.links,
            {
              source: prev.nodes[0].id,
              target: prev.nodes[1].id,
              value: 10
            }
          ]
        }));
      }
    } catch (error) {
      console.error('Error adding link:', error);
    }
  }, [chartData.nodes]);

  const removeLink = useCallback((index: number) => {
    try {
      if (chartData.links.length > 1) {
        setChartData(prev => ({
          ...prev,
          links: prev.links.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      console.error('Error removing link:', error);
    }
  }, [chartData.links.length]);

  const generateSampleData = useCallback((type: 'energy' | 'website' | 'budget') => {
    try {
      const sampleData = {
        energy: {
          title: 'Energy Flow Diagram',
          nodes: [
            { name: 'Coal', id: 'coal', itemStyle: { color: '#8B4513' } },
            { name: 'Natural Gas', id: 'gas', itemStyle: { color: '#4169E1' } },
            { name: 'Nuclear', id: 'nuclear', itemStyle: { color: '#FFD700' } },
            { name: 'Renewables', id: 'renewables', itemStyle: { color: '#32CD32' } },
            { name: 'Electricity', id: 'electricity', itemStyle: { color: '#FF6347' } },
            { name: 'Industry', id: 'industry', itemStyle: { color: '#708090' } },
            { name: 'Residential', id: 'residential', itemStyle: { color: '#20B2AA' } },
            { name: 'Transportation', id: 'transport', itemStyle: { color: '#FF69B4' } }
          ],
          links: [
            { source: 'coal', target: 'electricity', value: 35 },
            { source: 'gas', target: 'electricity', value: 25 },
            { source: 'nuclear', target: 'electricity', value: 20 },
            { source: 'renewables', target: 'electricity', value: 20 },
            { source: 'electricity', target: 'industry', value: 40 },
            { source: 'electricity', target: 'residential', value: 35 },
            { source: 'electricity', target: 'transport', value: 25 },
            { source: 'gas', target: 'industry', value: 15 },
            { source: 'gas', target: 'residential', value: 10 }
          ]
        },
        website: {
          title: 'Website Traffic Flow',
          nodes: [
            { name: 'Google', id: 'google', itemStyle: { color: '#4285F4' } },
            { name: 'Facebook', id: 'facebook', itemStyle: { color: '#1877F2' } },
            { name: 'Direct', id: 'direct', itemStyle: { color: '#34A853' } },
            { name: 'Homepage', id: 'homepage', itemStyle: { color: '#EA4335' } },
            { name: 'Product Page', id: 'product', itemStyle: { color: '#FBBC04' } },
            { name: 'Checkout', id: 'checkout', itemStyle: { color: '#9C27B0' } },
            { name: 'Purchase', id: 'purchase', itemStyle: { color: '#4CAF50' } }
          ],
          links: [
            { source: 'google', target: 'homepage', value: 500 },
            { source: 'facebook', target: 'homepage', value: 200 },
            { source: 'direct', target: 'homepage', value: 300 },
            { source: 'homepage', target: 'product', value: 600 },
            { source: 'product', target: 'checkout', value: 200 },
            { source: 'checkout', target: 'purchase', value: 150 }
          ]
        },
        budget: {
          title: 'Budget Allocation Flow',
          nodes: [
            { name: 'Revenue', id: 'revenue', itemStyle: { color: '#2E7D32' } },
            { name: 'Operating Costs', id: 'operating', itemStyle: { color: '#F57C00' } },
            { name: 'Marketing', id: 'marketing', itemStyle: { color: '#7B1FA2' } },
            { name: 'R&D', id: 'rd', itemStyle: { color: '#1976D2' } },
            { name: 'Profit', id: 'profit', itemStyle: { color: '#388E3C' } },
            { name: 'Taxes', id: 'taxes', itemStyle: { color: '#D32F2F' } }
          ],
          links: [
            { source: 'revenue', target: 'operating', value: 400 },
            { source: 'revenue', target: 'marketing', value: 200 },
            { source: 'revenue', target: 'rd', value: 150 },
            { source: 'revenue', target: 'profit', value: 200 },
            { source: 'revenue', target: 'taxes', value: 50 }
          ]
        }
      };
      
      setChartData(sampleData[type]);
    } catch (error) {
      console.error('Error generating sample data:', error);
    }
  }, []);

  // Safe export functionality
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        type: 'sankey-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `sankey-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  return (
    <EChartsErrorBoundary>
      <div className={`sankey-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Share className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Sankey Diagram Builder</h2>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <EChartsWrapper
                option={generateChartOption()}
                height={500}
                className="w-full"
                onError={(error) => {
                  console.error('Sankey chart rendering error:', error);
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {/* Chart Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Chart Settings
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chart Title
                  </label>
                  <input
                    type="text"
                    value={chartData.title}
                    onChange={(e) => setChartData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter chart title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layout
                  </label>
                  <select
                    value={chartOptions.layout}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, layout: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Scheme
                  </label>
                  <select
                    value={chartOptions.colorScheme}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="gradient">Gradient</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label Position
                  </label>
                  <select
                    value={chartOptions.labelPosition}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, labelPosition: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Node Width: {chartOptions.nodeWidth}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={chartOptions.nodeWidth}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, nodeWidth: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Node Gap: {chartOptions.nodeGap}px
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={chartOptions.nodeGap}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, nodeGap: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Curvature: {chartOptions.linkCurvature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={chartOptions.linkCurvature}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, linkCurvature: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={chartOptions.showLabels}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show Labels</span>
                </label>
              </div>
            </div>

            {/* Sample Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <button
                  onClick={() => generateSampleData('energy')}
                  className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  Energy Flow
                </button>
                <button
                  onClick={() => generateSampleData('website')}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Website Traffic
                </button>
                <button
                  onClick={() => generateSampleData('budget')}
                  className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                >
                  Budget Allocation
                </button>
              </div>
            </div>

            {/* Nodes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Nodes</h3>
                <button
                  onClick={addNode}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Node</span>
                </button>
              </div>
              
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {chartData.nodes.map((node, index) => (
                  <div key={node.id} className="border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Node {index + 1}</span>
                      {chartData.nodes.length > 2 && (
                        <button
                          onClick={() => removeNode(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={node.name}
                        onChange={(e) => updateNode(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Node name"
                      />
                      
                      <input
                        type="text"
                        value={node.id}
                        onChange={(e) => updateNode(index, 'id', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Node ID"
                      />
                      
                      <input
                        type="color"
                        value={node.itemStyle?.color || '#5470c6'}
                        onChange={(e) => updateNode(index, 'itemStyle', e.target.value)}
                        className="w-full h-8 rounded border border-gray-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Links</h3>
                <button
                  onClick={addLink}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Link</span>
                </button>
              </div>
              
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {chartData.links.map((link, index) => (
                  <div key={index} className="border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Link {index + 1}</span>
                      {chartData.links.length > 1 && (
                        <button
                          onClick={() => removeLink(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <select
                        value={link.source}
                        onChange={(e) => updateLink(index, 'source', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {chartData.nodes.map(node => (
                          <option key={node.id} value={node.id}>{node.name}</option>
                        ))}
                      </select>
                      
                      <select
                        value={link.target}
                        onChange={(e) => updateLink(index, 'target', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {chartData.nodes.map(node => (
                          <option key={node.id} value={node.id}>{node.name}</option>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        value={link.value}
                        onChange={(e) => updateLink(index, 'value', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Flow value"
                        min="0"
                        step="1"
                      />
                    </div>
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

export default SankeyChartBuilder;