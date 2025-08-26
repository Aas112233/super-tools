import React, { useState, useCallback } from 'react';
import { TreePine, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface TreeChartBuilderProps {
  className?: string;
}

interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
  collapsed?: boolean;
  itemStyle?: {
    color?: string;
  };
  label?: {
    position?: string;
    distance?: number;
  };
}

interface ChartData {
  title: string;
  data: TreeNode[];
}

/**
 * Isolated Tree Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const TreeChartBuilder: React.FC<TreeChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Organizational Structure',
    data: [
      {
        name: 'CEO',
        value: 100,
        itemStyle: { color: '#5470c6' },
        children: [
          {
            name: 'CTO',
            value: 80,
            itemStyle: { color: '#91cc75' },
            children: [
              {
                name: 'Frontend Team',
                value: 40,
                itemStyle: { color: '#fac858' },
                children: [
                  { name: 'React Developer', value: 20, itemStyle: { color: '#ee6666' } },
                  { name: 'Vue Developer', value: 15, itemStyle: { color: '#73c0de' } },
                  { name: 'UI/UX Designer', value: 18, itemStyle: { color: '#3ba272' } }
                ]
              },
              {
                name: 'Backend Team',
                value: 45,
                itemStyle: { color: '#fc8452' },
                children: [
                  { name: 'Node.js Developer', value: 25, itemStyle: { color: '#9a60b4' } },
                  { name: 'Python Developer', value: 22, itemStyle: { color: '#ea7ccc' } }
                ]
              }
            ]
          },
          {
            name: 'CFO',
            value: 60,
            itemStyle: { color: '#5470c6' },
            children: [
              {
                name: 'Accounting',
                value: 30,
                itemStyle: { color: '#91cc75' },
                children: [
                  { name: 'Accountant 1', value: 15, itemStyle: { color: '#fac858' } },
                  { name: 'Accountant 2', value: 12, itemStyle: { color: '#ee6666' } }
                ]
              },
              {
                name: 'Finance',
                value: 25,
                itemStyle: { color: '#73c0de' },
                children: [
                  { name: 'Financial Analyst', value: 20, itemStyle: { color: '#3ba272' } }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    layout: 'orthogonal' as 'orthogonal' | 'radial',
    orient: 'vertical' as 'vertical' | 'horizontal',
    symbolSize: 7,
    showLabels: true,
    labelPosition: 'left' as 'left' | 'right' | 'top' | 'bottom' | 'inside' | 'outside',
    edgeShape: 'curve' as 'curve' | 'polyline',
    roam: true,
    expandAndCollapse: true,
    animationDuration: 750
  });

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
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
              const { name, value, data } = params;
              const hasChildren = data.children && data.children.length > 0;
              
              return `
                <div style="text-align: left;">
                  <strong>${name}</strong><br/>
                  ${value ? `Value: ${value}<br/>` : ''}
                  ${hasChildren ? `Children: ${data.children.length}` : 'Leaf Node'}
                </div>
              `;
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
            type: 'tree',
            data: chartData.data,
            left: '10%',
            right: '10%',
            top: '15%',
            bottom: '10%',
            symbol: 'circle',
            symbolSize: chartOptions.symbolSize,
            orient: chartOptions.orient,
            layout: chartOptions.layout,
            edgeShape: chartOptions.edgeShape,
            roam: chartOptions.roam,
            expandAndCollapse: chartOptions.expandAndCollapse,
            initialTreeDepth: 3,
            label: {
              show: chartOptions.showLabels,
              position: chartOptions.labelPosition,
              fontSize: 12,
              fontWeight: 'bold',
              color: '#374151',
              distance: 10
            },
            leaves: {
              label: {
                position: chartOptions.labelPosition,
                fontSize: 11,
                color: '#6B7280'
              }
            },
            lineStyle: {
              color: '#94A3B8',
              width: 2,
              curveness: chartOptions.edgeShape === 'curve' ? 0.5 : 0
            },
            emphasis: {
              focus: 'descendant',
              lineStyle: {
                width: 3,
                color: '#4F46E5'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
              }
            },
            animationDuration: chartOptions.animationDuration,
            animationEasing: 'cubicOut',
            animationDurationUpdate: chartOptions.animationDuration / 2
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating tree chart option:', error);
      return {
        title: {
          text: 'Chart Error',
          left: 'center'
        },
        series: []
      };
    }
  }, [chartData, chartOptions]);

  // Helper function to find and update a node in the tree
  const updateNodeInTree = useCallback((nodes: TreeNode[], targetPath: number[], updateFn: (node: TreeNode) => TreeNode): TreeNode[] => {
    if (targetPath.length === 0) return nodes;
    
    return nodes.map((node, index) => {
      if (index === targetPath[0]) {
        if (targetPath.length === 1) {
          return updateFn(node);
        } else {
          return {
            ...node,
            children: node.children ? updateNodeInTree(node.children, targetPath.slice(1), updateFn) : []
          };
        }
      }
      return node;
    });
  }, []);

  // Helper function to add a node to the tree
  const addNodeToTree = useCallback((nodes: TreeNode[], targetPath: number[], newNode: TreeNode): TreeNode[] => {
    if (targetPath.length === 0) {
      return [...nodes, newNode];
    }
    
    return nodes.map((node, index) => {
      if (index === targetPath[0]) {
        if (targetPath.length === 1) {
          return {
            ...node,
            children: [...(node.children || []), newNode]
          };
        } else {
          return {
            ...node,
            children: node.children ? addNodeToTree(node.children, targetPath.slice(1), newNode) : []
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
            return { ...node, value: parseFloat(value) || 0 };
          } else {
            return { ...node, [field]: value };
          }
        })
      }));
    } catch (error) {
      console.error('Error updating node:', error);
    }
  }, [updateNodeInTree]);

  const addChildNode = useCallback((path: number[]) => {
    try {
      const newNode: TreeNode = {
        name: 'New Node',
        value: 10,
        itemStyle: { color: '#94A3B8' }
      };
      
      setChartData(prev => ({
        ...prev,
        data: addNodeToTree(prev.data, path, newNode)
      }));
    } catch (error) {
      console.error('Error adding child node:', error);
    }
  }, [addNodeToTree]);

  const generateSampleData = useCallback((type: 'company' | 'family' | 'filesystem') => {
    try {
      const sampleData = {
        company: {
          title: 'Company Organizational Chart',
          data: [
            {
              name: 'CEO',
              value: 100,
              itemStyle: { color: '#5470c6' },
              children: [
                {
                  name: 'CTO',
                  value: 80,
                  itemStyle: { color: '#91cc75' },
                  children: [
                    { name: 'Engineering', value: 60, itemStyle: { color: '#fac858' } },
                    { name: 'DevOps', value: 20, itemStyle: { color: '#ee6666' } }
                  ]
                },
                {
                  name: 'CMO',
                  value: 70,
                  itemStyle: { color: '#73c0de' },
                  children: [
                    { name: 'Marketing', value: 40, itemStyle: { color: '#3ba272' } },
                    { name: 'Sales', value: 30, itemStyle: { color: '#fc8452' } }
                  ]
                }
              ]
            }
          ]
        },
        family: {
          title: 'Family Tree',
          data: [
            {
              name: 'Grandparents',
              value: 90,
              itemStyle: { color: '#5470c6' },
              children: [
                {
                  name: 'Parent 1',
                  value: 60,
                  itemStyle: { color: '#91cc75' },
                  children: [
                    { name: 'Child 1', value: 25, itemStyle: { color: '#fac858' } },
                    { name: 'Child 2', value: 22, itemStyle: { color: '#ee6666' } }
                  ]
                },
                {
                  name: 'Parent 2',
                  value: 58,
                  itemStyle: { color: '#73c0de' },
                  children: [
                    { name: 'Child 3', value: 24, itemStyle: { color: '#3ba272' } }
                  ]
                }
              ]
            }
          ]
        },
        filesystem: {
          title: 'File System Structure',
          data: [
            {
              name: 'Root',
              value: 1000,
              itemStyle: { color: '#5470c6' },
              children: [
                {
                  name: 'Documents',
                  value: 400,
                  itemStyle: { color: '#91cc75' },
                  children: [
                    { name: 'Reports', value: 200, itemStyle: { color: '#fac858' } },
                    { name: 'Presentations', value: 150, itemStyle: { color: '#ee6666' } }
                  ]
                },
                {
                  name: 'Projects',
                  value: 600,
                  itemStyle: { color: '#73c0de' },
                  children: [
                    { name: 'Web Apps', value: 300, itemStyle: { color: '#3ba272' } },
                    { name: 'Mobile Apps', value: 250, itemStyle: { color: '#fc8452' } }
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
        type: 'tree-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `tree-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  // Render node editor recursively
  const renderNodeEditor = useCallback((node: TreeNode, path: number[], depth: number = 0) => {
    const indent = depth * 20;
    
    return (
      <div key={path.join('-')} style={{ marginLeft: `${indent}px` }} className="border-l border-gray-200 pl-2 mb-2">
        <div className="bg-gray-50 rounded p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{node.name}</span>
            <button
              onClick={() => addChildNode(path)}
              className="text-green-500 hover:text-green-700"
            >
              <Plus className="w-3 h-3" />
            </button>
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
              value={node.value || 0}
              onChange={(e) => updateNode(path, 'value', e.target.value)}
              className="px-1 py-0.5 border border-gray-300 rounded"
              placeholder="Value"
              step="1"
            />
            <input
              type="color"
              value={node.itemStyle?.color || '#5470c6'}
              onChange={(e) => updateNode(path, 'color', e.target.value)}
              className="w-full h-6 rounded border border-gray-300"
            />
          </div>
        </div>
        
        {node.children && node.children.map((child, index) => 
          renderNodeEditor(child, [...path, index], depth + 1)
        )}
      </div>
    );
  }, [updateNode, addChildNode]);

  return (
    <EChartsErrorBoundary>
      <div className={`tree-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TreePine className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">Tree Chart Builder</h2>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
                  console.error('Tree chart rendering error:', error);
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="orthogonal">Orthogonal</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orientation
                  </label>
                  <select
                    value={chartOptions.orient}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, orient: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edge Shape
                  </label>
                  <select
                    value={chartOptions.edgeShape}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, edgeShape: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="curve">Curved</option>
                    <option value="polyline">Straight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label Position
                  </label>
                  <select
                    value={chartOptions.labelPosition}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, labelPosition: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="inside">Inside</option>
                    <option value="outside">Outside</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symbol Size: {chartOptions.symbolSize}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={chartOptions.symbolSize}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, symbolSize: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showLabels}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Show Labels</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.roam}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, roam: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Enable Zoom & Pan</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.expandAndCollapse}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, expandAndCollapse: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Expand/Collapse</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sample Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <button
                  onClick={() => generateSampleData('company')}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Company Structure
                </button>
                <button
                  onClick={() => generateSampleData('family')}
                  className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                >
                  Family Tree
                </button>
                <button
                  onClick={() => generateSampleData('filesystem')}
                  className="w-full px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                >
                  File System
                </button>
              </div>
            </div>

            {/* Tree Structure Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Tree Structure</h3>
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

export default TreeChartBuilder;