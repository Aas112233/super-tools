import React, { useState, useCallback } from 'react';
import { Grid3x3, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface TreemapChartBuilderProps {
  className?: string;
}

interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
  itemStyle?: {
    color?: string;
  };
}

interface ChartData {
  title: string;
  data: TreemapNode[];
}

/**
 * Isolated Treemap Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const TreemapChartBuilder: React.FC<TreemapChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Market Segmentation Analysis',
    data: [
      {
        name: 'Technology',
        value: 0,
        children: [
          { name: 'Software', value: 450, itemStyle: { color: '#5470c6' } },
          { name: 'Hardware', value: 320, itemStyle: { color: '#91cc75' } },
          { name: 'AI/ML', value: 280, itemStyle: { color: '#fac858' } },
          { name: 'Cloud', value: 200, itemStyle: { color: '#ee6666' } }
        ]
      },
      {
        name: 'Finance',
        value: 0,
        children: [
          { name: 'Banking', value: 380, itemStyle: { color: '#73c0de' } },
          { name: 'Insurance', value: 290, itemStyle: { color: '#3ba272' } },
          { name: 'Investment', value: 240, itemStyle: { color: '#fc8452' } }
        ]
      },
      {
        name: 'Healthcare',
        value: 0,
        children: [
          { name: 'Pharmaceuticals', value: 350, itemStyle: { color: '#9a60b4' } },
          { name: 'Medical Devices', value: 220, itemStyle: { color: '#ea7ccc' } },
          { name: 'Telemedicine', value: 180, itemStyle: { color: '#5470c6' } }
        ]
      },
      {
        name: 'Retail',
        value: 0,
        children: [
          { name: 'E-commerce', value: 300, itemStyle: { color: '#91cc75' } },
          { name: 'Physical Stores', value: 180, itemStyle: { color: '#fac858' } },
          { name: 'Logistics', value: 150, itemStyle: { color: '#ee6666' } }
        ]
      }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    layout: 'squarified' as 'squarified' | 'binary' | 'slice' | 'dice' | 'sliceAndDice',
    showLabels: true,
    labelPosition: 'inside' as 'inside' | 'outside',
    colorScheme: 'default' as 'default' | 'gradient' | 'category',
    borderWidth: 2,
    borderColor: '#ffffff',
    roam: false,
    nodeClick: 'zoomToNode' as 'zoomToNode' | 'link' | false,
    showBreadcrumb: true
  });

  // Color schemes
  const colorSchemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
    gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
    category: ['#ff7f50', '#87ceeb', '#da70d6', '#32cd32', '#ffd700', '#ff69b4', '#ba55d3', '#cd5c5c']
  };

  // Apply color scheme to data
  const applyColorScheme = useCallback((nodes: TreemapNode[], colors: string[], startIndex = 0): TreemapNode[] => {
    return nodes.map((node, index) => {
      const colorIndex = (startIndex + index) % colors.length;
      const newNode = {
        ...node,
        itemStyle: { color: colors[colorIndex] }
      };
      
      if (node.children) {
        newNode.children = applyColorScheme(node.children, colors, colorIndex * 4);
      }
      
      return newNode;
    });
  }, []);

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const colors = colorSchemes[chartOptions.colorScheme];
      const processedData = chartOptions.colorScheme !== 'default' 
        ? applyColorScheme(chartData.data, colors)
        : chartData.data;

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
          formatter: (params: any) => {
            try {
              const { name, value, treePathInfo } = params;
              const path = treePathInfo.map((p: any) => p.name).join(' > ');
              
              return `
                <div style="text-align: left;">
                  <strong>${name}</strong><br/>
                  Path: ${path}<br/>
                  Value: ${value.toLocaleString()}
                </div>
              `;
            } catch (error) {
              return `${params.name}: ${params.value}`;
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
            name: 'Treemap',
            type: 'treemap',
            data: processedData,
            left: '2%',
            right: '2%',
            top: '15%',
            bottom: '5%',
            squareRatio: chartOptions.layout === 'squarified' ? 0.5 * (1 + Math.sqrt(5)) : undefined,
            leafDepth: 2,
            roam: chartOptions.roam,
            nodeClick: chartOptions.nodeClick,
            label: {
              show: chartOptions.showLabels,
              position: chartOptions.labelPosition,
              fontSize: 12,
              fontWeight: 'bold',
              color: '#ffffff',
              overflow: 'truncate'
            },
            upperLabel: {
              show: true,
              height: 30,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 'bold'
            },
            itemStyle: {
              borderColor: chartOptions.borderColor,
              borderWidth: chartOptions.borderWidth,
              gapWidth: 2
            },
            emphasis: {
              itemStyle: {
                borderWidth: chartOptions.borderWidth + 1,
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
              },
              label: {
                fontSize: 14
              }
            },
            breadcrumb: {
              show: chartOptions.showBreadcrumb,
              height: 25,
              bottom: 0,
              left: 'center',
              itemStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
                shadowColor: 'rgba(150, 150, 150, 1)',
                shadowBlur: 3,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                textStyle: {
                  color: '#333'
                }
              }
            },
            animationDuration: 1500,
            animationEasing: 'cubicOut'
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating treemap chart option:', error);
      return {
        title: {
          text: 'Chart Error',
          left: 'center'
        },
        series: []
      };
    }
  }, [chartData, chartOptions, applyColorScheme]);

  // Helper function to update node in tree structure
  const updateNodeInTree = useCallback((nodes: TreemapNode[], path: number[], updateFn: (node: TreemapNode) => TreemapNode): TreemapNode[] => {
    if (path.length === 0) return nodes;
    
    return nodes.map((node, index) => {
      if (index === path[0]) {
        if (path.length === 1) {
          return updateFn(node);
        } else {
          return {
            ...node,
            children: node.children ? updateNodeInTree(node.children, path.slice(1), updateFn) : []
          };
        }
      }
      return node;
    });
  }, []);

  // Safe data update handlers
  const updateNode = useCallback((path: number[], field: string, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        data: updateNodeInTree(prev.data, path, (node) => {
          if (field === 'color') {
            return { ...node, itemStyle: { ...node.itemStyle, color: value } };
          } else if (field === 'value') {
            return { ...node, value: Math.max(0, parseFloat(value) || 0) };
          } else {
            return { ...node, [field]: value };
          }
        })
      }));
    } catch (error) {
      console.error('Error updating node:', error);
    }
  }, [updateNodeInTree]);

  const addNode = useCallback((path: number[]) => {
    try {
      const colors = colorSchemes[chartOptions.colorScheme];
      const newNode: TreemapNode = {
        name: 'New Item',
        value: 100,
        itemStyle: { color: colors[Math.floor(Math.random() * colors.length)] }
      };
      
      setChartData(prev => ({
        ...prev,
        data: updateNodeInTree(prev.data, path, (node) => ({
          ...node,
          children: [...(node.children || []), newNode]
        }))
      }));
    } catch (error) {
      console.error('Error adding node:', error);
    }
  }, [updateNodeInTree, chartOptions.colorScheme]);

  const removeNode = useCallback((path: number[]) => {
    try {
      if (path.length === 0) return;
      
      const parentPath = path.slice(0, -1);
      const nodeIndex = path[path.length - 1];
      
      setChartData(prev => ({
        ...prev,
        data: updateNodeInTree(prev.data, parentPath, (node) => ({
          ...node,
          children: node.children ? node.children.filter((_, i) => i !== nodeIndex) : []
        }))
      }));
    } catch (error) {
      console.error('Error removing node:', error);
    }
  }, [updateNodeInTree]);

  const generateSampleData = useCallback((type: 'market' | 'portfolio' | 'filesystem') => {
    try {
      const sampleData = {
        market: {
          title: 'Market Share Analysis',
          data: [
            {
              name: 'Mobile',
              value: 0,
              children: [
                { name: 'iOS', value: 350, itemStyle: { color: '#5470c6' } },
                { name: 'Android', value: 500, itemStyle: { color: '#91cc75' } },
                { name: 'Others', value: 80, itemStyle: { color: '#fac858' } }
              ]
            },
            {
              name: 'Desktop',
              value: 0,
              children: [
                { name: 'Windows', value: 400, itemStyle: { color: '#ee6666' } },
                { name: 'macOS', value: 200, itemStyle: { color: '#73c0de' } },
                { name: 'Linux', value: 100, itemStyle: { color: '#3ba272' } }
              ]
            }
          ]
        },
        portfolio: {
          title: 'Investment Portfolio',
          data: [
            {
              name: 'Stocks',
              value: 0,
              children: [
                { name: 'Tech Stocks', value: 300, itemStyle: { color: '#5470c6' } },
                { name: 'Healthcare', value: 200, itemStyle: { color: '#91cc75' } },
                { name: 'Finance', value: 150, itemStyle: { color: '#fac858' } }
              ]
            },
            {
              name: 'Bonds',
              value: 0,
              children: [
                { name: 'Government', value: 180, itemStyle: { color: '#ee6666' } },
                { name: 'Corporate', value: 120, itemStyle: { color: '#73c0de' } }
              ]
            },
            {
              name: 'Real Estate',
              value: 0,
              children: [
                { name: 'Commercial', value: 100, itemStyle: { color: '#3ba272' } },
                { name: 'Residential', value: 80, itemStyle: { color: '#fc8452' } }
              ]
            }
          ]
        },
        filesystem: {
          title: 'Disk Usage Analysis',
          data: [
            {
              name: 'Documents',
              value: 0,
              children: [
                { name: 'Work Files', value: 1200, itemStyle: { color: '#5470c6' } },
                { name: 'Personal', value: 800, itemStyle: { color: '#91cc75' } },
                { name: 'Archive', value: 400, itemStyle: { color: '#fac858' } }
              ]
            },
            {
              name: 'Media',
              value: 0,
              children: [
                { name: 'Photos', value: 2000, itemStyle: { color: '#ee6666' } },
                { name: 'Videos', value: 3500, itemStyle: { color: '#73c0de' } },
                { name: 'Music', value: 800, itemStyle: { color: '#3ba272' } }
              ]
            }
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
        type: 'treemap-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `treemap-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  // Render node editor recursively
  const renderNodeEditor = useCallback((node: TreemapNode, path: number[], depth: number = 0) => {
    const indent = depth * 15;
    
    return (
      <div key={path.join('-')} style={{ marginLeft: `${indent}px` }} className="border-l border-gray-200 pl-2 mb-2">
        <div className="bg-gray-50 rounded p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{node.name}</span>
            <div className="flex space-x-1">
              <button
                onClick={() => addNode(path)}
                className="text-green-500 hover:text-green-700"
              >
                <Plus className="w-3 h-3" />
              </button>
              {depth > 0 && (
                <button
                  onClick={() => removeNode(path)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-1 text-xs">
            <input
              type="text"
              value={node.name}
              onChange={(e) => updateNode(path, 'name', e.target.value)}
              className="px-1 py-0.5 border border-gray-300 rounded"
              placeholder="Node name"
            />
            <input
              type="number"
              value={node.value}
              onChange={(e) => updateNode(path, 'value', e.target.value)}
              className="px-1 py-0.5 border border-gray-300 rounded"
              placeholder="Value"
              step="1"
              min="0"
            />
            <input
              type="color"
              value={node.itemStyle?.color || '#5470c6'}
              onChange={(e) => updateNode(path, 'color', e.target.value)}
              className="w-full h-6 rounded border border-gray-300 col-span-2"
            />
          </div>
        </div>
        
        {node.children && node.children.map((child, index) => 
          renderNodeEditor(child, [...path, index], depth + 1)
        )}
      </div>
    );
  }, [updateNode, addNode, removeNode]);

  return (
    <EChartsErrorBoundary>
      <div className={`treemap-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Grid3x3 className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Treemap Chart Builder</h2>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
                  console.error('Treemap chart rendering error:', error);
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Enter chart title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layout Algorithm
                  </label>
                  <select
                    value={chartOptions.layout}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, layout: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="squarified">Squarified</option>
                    <option value="binary">Binary</option>
                    <option value="slice">Slice</option>
                    <option value="dice">Dice</option>
                    <option value="sliceAndDice">Slice & Dice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Scheme
                  </label>
                  <select
                    value={chartOptions.colorScheme}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="gradient">Gradient</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Node Click Action
                  </label>
                  <select
                    value={chartOptions.nodeClick.toString()}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, nodeClick: e.target.value === 'false' ? false : e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="zoomToNode">Zoom to Node</option>
                    <option value="link">Open Link</option>
                    <option value="false">No Action</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Width: {chartOptions.borderWidth}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={chartOptions.borderWidth}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, borderWidth: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showLabels}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Show Labels</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showBreadcrumb}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showBreadcrumb: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Show Breadcrumb</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.roam}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, roam: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Enable Zoom & Pan</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sample Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <button
                  onClick={() => generateSampleData('market')}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Market Share
                </button>
                <button
                  onClick={() => generateSampleData('portfolio')}
                  className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  Investment Portfolio
                </button>
                <button
                  onClick={() => generateSampleData('filesystem')}
                  className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                >
                  Disk Usage
                </button>
              </div>
            </div>

            {/* Tree Structure Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Hierarchy Structure</h3>
              <div className="max-h-80 overflow-y-auto">
                {chartData.data.map((node, index) => renderNodeEditor(node, [index]))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default TreemapChartBuilder;