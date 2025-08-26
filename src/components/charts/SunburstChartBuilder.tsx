import React, { useState, useCallback } from 'react';
import { Target, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface SunburstChartBuilderProps {
  className?: string;
}

interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
  itemStyle?: {
    color?: string;
  };
  label?: {
    show?: boolean;
    position?: string;
  };
}

interface ChartData {
  title: string;
  data: SunburstNode[];
}

/**
 * Isolated Sunburst Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const SunburstChartBuilder: React.FC<SunburstChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Company Structure Sunburst',
    data: [
      {
        name: 'Company',
        children: [
          {
            name: 'Engineering',
            value: 120,
            itemStyle: { color: '#5470c6' },
            children: [
              { name: 'Frontend', value: 40, itemStyle: { color: '#91cc75' } },
              { name: 'Backend', value: 50, itemStyle: { color: '#fac858' } },
              { name: 'DevOps', value: 30, itemStyle: { color: '#ee6666' } }
            ]
          },
          {
            name: 'Sales',
            value: 80,
            itemStyle: { color: '#73c0de' },
            children: [
              { name: 'Inside Sales', value: 35, itemStyle: { color: '#3ba272' } },
              { name: 'Field Sales', value: 25, itemStyle: { color: '#fc8452' } },
              { name: 'Sales Support', value: 20, itemStyle: { color: '#9a60b4' } }
            ]
          },
          {
            name: 'Marketing',
            value: 60,
            itemStyle: { color: '#ea7ccc' },
            children: [
              { name: 'Digital Marketing', value: 25, itemStyle: { color: '#5470c6' } },
              { name: 'Content Marketing', value: 20, itemStyle: { color: '#91cc75' } },
              { name: 'Event Marketing', value: 15, itemStyle: { color: '#fac858' } }
            ]
          },
          {
            name: 'Operations',
            value: 40,
            itemStyle: { color: '#ee6666' },
            children: [
              { name: 'HR', value: 15, itemStyle: { color: '#73c0de' } },
              { name: 'Finance', value: 15, itemStyle: { color: '#3ba272' } },
              { name: 'Legal', value: 10, itemStyle: { color: '#fc8452' } }
            ]
          }
        ]
      }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    radius: [0, '90%'] as [number | string, number | string],
    sort: 'desc' as 'desc' | 'asc' | null,
    renderLabelForZeroData: false,
    labelRotate: 'radial' as 'radial' | 'tangential',
    highlightPolicy: 'descendant' as 'descendant' | 'ancestor' | 'self',
    colorScheme: 'default' as 'default' | 'gradient' | 'category',
    showLabels: true,
    nodeClick: true,
    animationDuration: 1000
  });

  // Color schemes
  const colorSchemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
    gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
    category: ['#ff7f50', '#87ceeb', '#da70d6', '#32cd32', '#ffd700', '#ff69b4', '#ba55d3', '#cd5c5c']
  };

  // Apply color scheme to data
  const applyColorScheme = useCallback((nodes: SunburstNode[], colors: string[], depth = 0, startIndex = 0): SunburstNode[] => {
    return nodes.map((node, index) => {
      const colorIndex = (startIndex + index) % colors.length;
      const newNode = {
        ...node,
        itemStyle: { 
          color: colors[colorIndex],
          borderColor: '#ffffff',
          borderWidth: depth === 0 ? 2 : 1
        }
      };
      
      if (node.children) {
        newNode.children = applyColorScheme(node.children, colors, depth + 1, colorIndex * 3);
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
              const path = treePathInfo ? treePathInfo.map((p: any) => p.name).join(' > ') : name;
              
              return `
                <div style="text-align: left;">
                  <strong>${name}</strong><br/>
                  Path: ${path}<br/>
                  ${value ? `Value: ${value}` : 'Category'}
                </div>
              `;
            } catch (error) {
              return `${params.name}${params.value ? `: ${params.value}` : ''}`;
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
            name: 'Sunburst',
            type: 'sunburst',
            data: processedData,
            radius: chartOptions.radius,
            center: ['50%', '50%'],
            sort: chartOptions.sort,
            renderLabelForZeroData: chartOptions.renderLabelForZeroData,
            label: {
              show: chartOptions.showLabels,
              rotate: chartOptions.labelRotate,
              fontSize: 12,
              fontWeight: 'bold',
              color: '#ffffff',
              overflow: 'break'
            },
            emphasis: {
              focus: chartOptions.highlightPolicy,
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            levels: [
              {},
              {
                r0: '15%',
                r: '35%',
                itemStyle: {
                  borderWidth: 2
                },
                label: {
                  fontSize: 14,
                  fontWeight: 'bold'
                }
              },
              {
                r0: '35%',
                r: '70%',
                label: {
                  position: 'outside',
                  padding: 3,
                  silent: false
                },
                itemStyle: {
                  borderWidth: 1
                }
              },
              {
                r0: '70%',
                r: '72%',
                label: {
                  position: 'outside',
                  padding: 3,
                  silent: false,
                  fontSize: 10
                },
                itemStyle: {
                  borderWidth: 1
                }
              }
            ],
            animationDuration: chartOptions.animationDuration,
            animationEasing: 'cubicOut'
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating sunburst chart option:', error);
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
  const updateNodeInTree = useCallback((nodes: SunburstNode[], path: number[], updateFn: (node: SunburstNode) => SunburstNode): SunburstNode[] => {
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
            const numValue = parseFloat(value);
            return { ...node, value: isNaN(numValue) ? undefined : Math.max(0, numValue) };
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
      const newNode: SunburstNode = {
        name: 'New Item',
        value: 10,
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

  const generateSampleData = useCallback((type: 'organization' | 'skills' | 'budget') => {
    try {
      const sampleData = {
        organization: {
          title: 'Organizational Hierarchy',
          data: [
            {
              name: 'CEO',
              children: [
                {
                  name: 'Technology',
                  value: 150,
                  itemStyle: { color: '#5470c6' },
                  children: [
                    { name: 'Development', value: 80, itemStyle: { color: '#91cc75' } },
                    { name: 'QA', value: 40, itemStyle: { color: '#fac858' } },
                    { name: 'DevOps', value: 30, itemStyle: { color: '#ee6666' } }
                  ]
                },
                {
                  name: 'Business',
                  value: 100,
                  itemStyle: { color: '#73c0de' },
                  children: [
                    { name: 'Sales', value: 60, itemStyle: { color: '#3ba272' } },
                    { name: 'Marketing', value: 40, itemStyle: { color: '#fc8452' } }
                  ]
                }
              ]
            }
          ]
        },
        skills: {
          title: 'Skill Development Tree',
          data: [
            {
              name: 'Programming',
              children: [
                {
                  name: 'Frontend',
                  value: 80,
                  itemStyle: { color: '#5470c6' },
                  children: [
                    { name: 'React', value: 40, itemStyle: { color: '#91cc75' } },
                    { name: 'Vue', value: 25, itemStyle: { color: '#fac858' } },
                    { name: 'Angular', value: 15, itemStyle: { color: '#ee6666' } }
                  ]
                },
                {
                  name: 'Backend',
                  value: 70,
                  itemStyle: { color: '#73c0de' },
                  children: [
                    { name: 'Node.js', value: 35, itemStyle: { color: '#3ba272' } },
                    { name: 'Python', value: 25, itemStyle: { color: '#fc8452' } },
                    { name: 'Java', value: 10, itemStyle: { color: '#9a60b4' } }
                  ]
                }
              ]
            }
          ]
        },
        budget: {
          title: 'Budget Allocation',
          data: [
            {
              name: 'Annual Budget',
              children: [
                {
                  name: 'Operations',
                  value: 400,
                  itemStyle: { color: '#5470c6' },
                  children: [
                    { name: 'Salaries', value: 250, itemStyle: { color: '#91cc75' } },
                    { name: 'Office', value: 100, itemStyle: { color: '#fac858' } },
                    { name: 'Utilities', value: 50, itemStyle: { color: '#ee6666' } }
                  ]
                },
                {
                  name: 'Growth',
                  value: 300,
                  itemStyle: { color: '#73c0de' },
                  children: [
                    { name: 'Marketing', value: 150, itemStyle: { color: '#3ba272' } },
                    { name: 'R&D', value: 100, itemStyle: { color: '#fc8452' } },
                    { name: 'Expansion', value: 50, itemStyle: { color: '#9a60b4' } }
                  ]
                }
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
        type: 'sunburst-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `sunburst-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  // Render node editor recursively
  const renderNodeEditor = useCallback((node: SunburstNode, path: number[], depth: number = 0) => {
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
              value={node.value || ''}
              onChange={(e) => updateNode(path, 'value', e.target.value)}
              className="px-1 py-0.5 border border-gray-300 rounded"
              placeholder="Value (optional)"
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
      <div className={`sunburst-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-800">Sunburst Chart Builder</h2>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
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
                  console.error('Sunburst chart rendering error:', error);
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                    placeholder="Enter chart title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <select
                    value={chartOptions.sort || 'none'}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, sort: e.target.value === 'none' ? null : e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                    <option value="none">No Sorting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Scheme
                  </label>
                  <select
                    value={chartOptions.colorScheme}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="gradient">Gradient</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label Rotation
                  </label>
                  <select
                    value={chartOptions.labelRotate}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, labelRotate: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  >
                    <option value="radial">Radial</option>
                    <option value="tangential">Tangential</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highlight Policy
                  </label>
                  <select
                    value={chartOptions.highlightPolicy}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, highlightPolicy: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  >
                    <option value="descendant">Descendants</option>
                    <option value="ancestor">Ancestors</option>
                    <option value="self">Self Only</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showLabels}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Show Labels</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.nodeClick}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, nodeClick: e.target.checked }))}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Enable Node Click</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.renderLabelForZeroData}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, renderLabelForZeroData: e.target.checked }))}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Show Zero Data Labels</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sample Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <button
                  onClick={() => generateSampleData('organization')}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Organization Chart
                </button>
                <button
                  onClick={() => generateSampleData('skills')}
                  className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  Skill Tree
                </button>
                <button
                  onClick={() => generateSampleData('budget')}
                  className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                >
                  Budget Breakdown
                </button>
              </div>
            </div>

            {/* Hierarchy Structure Editor */}
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

export default SunburstChartBuilder;