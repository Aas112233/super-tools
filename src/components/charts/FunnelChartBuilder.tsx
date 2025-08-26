import React, { useState, useCallback } from 'react';
import { Target, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface FunnelChartBuilderProps {
  className?: string;
}

interface FunnelDataItem {
  name: string;
  value: number;
}

interface ChartData {
  title: string;
  data: FunnelDataItem[];
  unit: string;
}

/**
 * Isolated Funnel Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const FunnelChartBuilder: React.FC<FunnelChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Sales Conversion Funnel',
    data: [
      { name: 'Website Visitors', value: 10000 },
      { name: 'Product Views', value: 5000 },
      { name: 'Add to Cart', value: 2500 },
      { name: 'Checkout Started', value: 1000 },
      { name: 'Payment Completed', value: 750 },
      { name: 'Order Confirmed', value: 600 }
    ],
    unit: 'users'
  });

  const [chartOptions, setChartOptions] = useState({
    sort: 'descending' as 'descending' | 'ascending' | 'none',
    gap: 2,
    showLabels: true,
    showPercentage: true,
    labelPosition: 'inside' as 'inside' | 'outside',
    colorScheme: 'gradient' as 'gradient' | 'sequential' | 'custom',
    funnelAlign: 'center' as 'left' | 'center' | 'right',
    width: 80,
    height: 80
  });

  // Predefined color schemes
  const colorSchemes = {
    gradient: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452'],
    sequential: ['#1890ff', '#1473cc', '#0d5da6', '#074480', '#032d5a', '#001729'],
    custom: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
  };

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const processedData = [...chartData.data];
      
      // Sort data based on option
      if (chartOptions.sort === 'descending') {
        processedData.sort((a, b) => b.value - a.value);
      } else if (chartOptions.sort === 'ascending') {
        processedData.sort((a, b) => a.value - b.value);
      }

      const maxValue = Math.max(...processedData.map(item => item.value));
      const colors = colorSchemes[chartOptions.colorScheme];

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
              const percentage = ((params.value / maxValue) * 100).toFixed(1);
              const prevValue = params.dataIndex > 0 ? processedData[params.dataIndex - 1].value : params.value;
              const conversionRate = params.dataIndex > 0 ? ((params.value / prevValue) * 100).toFixed(1) : '100.0';
              
              return `
                <div style="text-align: left;">
                  <strong>${params.name}</strong><br/>
                  Value: ${params.value.toLocaleString()} ${chartData.unit}<br/>
                  Percentage: ${percentage}%<br/>
                  ${params.dataIndex > 0 ? `Conversion: ${conversionRate}%` : ''}
                </div>
              `;
            } catch (error) {
              return `${params.name}: ${params.value} ${chartData.unit}`;
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          textStyle: {
            color: '#374151'
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'middle',
          textStyle: {
            color: '#374151'
          }
        },
        series: [
          {
            name: 'Funnel',
            type: 'funnel',
            left: '10%',
            top: '15%',
            width: `${chartOptions.width}%`,
            height: `${chartOptions.height}%`,
            funnelAlign: chartOptions.funnelAlign,
            gap: chartOptions.gap,
            data: processedData.map((item, index) => ({
              value: item.value,
              name: item.name,
              itemStyle: {
                color: colors[index % colors.length]
              }
            })),
            label: {
              show: chartOptions.showLabels,
              position: chartOptions.labelPosition,
              formatter: (params: any) => {
                try {
                  if (chartOptions.showPercentage) {
                    const percentage = ((params.value / maxValue) * 100).toFixed(1);
                    return `${params.name}\\n${params.value.toLocaleString()} (${percentage}%)`;
                  }
                  return `${params.name}\\n${params.value.toLocaleString()}`;
                } catch (error) {
                  return params.name;
                }
              },
              fontSize: 12,
              color: chartOptions.labelPosition === 'inside' ? 'white' : '#374151',
              fontWeight: 'bold'
            },
            labelLine: {
              show: chartOptions.labelPosition === 'outside',
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: 1,
              opacity: 0.9
            },
            emphasis: {
              itemStyle: {
                opacity: 1,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animationDuration: 1500,
            animationEasing: 'cubicOut'
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating funnel chart option:', error);
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
  const updateDataItem = useCallback((index: number, field: keyof FunnelDataItem, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        data: prev.data.map((item, i) => {
          if (i === index) {
            const updatedItem = { ...item, [field]: value };
            if (field === 'value') {
              updatedItem.value = Math.max(0, parseFloat(value) || 0);
            }
            return updatedItem;
          }
          return item;
        })
      }));
    } catch (error) {
      console.error('Error updating data item:', error);
    }
  }, []);

  const addDataItem = useCallback(() => {
    try {
      setChartData(prev => ({
        ...prev,
        data: [
          ...prev.data,
          { name: `Stage ${prev.data.length + 1}`, value: 100 }
        ]
      }));
    } catch (error) {
      console.error('Error adding data item:', error);
    }
  }, []);

  const removeDataItem = useCallback((index: number) => {
    try {
      if (chartData.data.length > 2) {
        setChartData(prev => ({
          ...prev,
          data: prev.data.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      console.error('Error removing data item:', error);
    }
  }, [chartData.data.length]);

  const generateSampleData = useCallback((type: 'sales' | 'marketing' | 'ecommerce') => {
    try {
      const sampleData = {
        sales: {
          title: 'Sales Pipeline',
          data: [
            { name: 'Leads Generated', value: 1000 },
            { name: 'Qualified Leads', value: 500 },
            { name: 'Proposals Sent', value: 200 },
            { name: 'Negotiations', value: 100 },
            { name: 'Closed Deals', value: 50 }
          ],
          unit: 'leads'
        },
        marketing: {
          title: 'Marketing Funnel',
          data: [
            { name: 'Ad Impressions', value: 50000 },
            { name: 'Ad Clicks', value: 2500 },
            { name: 'Landing Page Views', value: 2000 },
            { name: 'Sign-ups', value: 400 },
            { name: 'Paying Customers', value: 80 }
          ],
          unit: 'users'
        },
        ecommerce: {
          title: 'E-commerce Funnel',
          data: [
            { name: 'Store Visits', value: 20000 },
            { name: 'Product Views', value: 8000 },
            { name: 'Add to Cart', value: 3000 },
            { name: 'Checkout', value: 1500 },
            { name: 'Purchase', value: 1200 }
          ],
          unit: 'sessions'
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
        type: 'funnel-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `funnel-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  return (
    <EChartsErrorBoundary>
      <div className={`funnel-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800">Funnel Chart Builder</h2>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
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
                height={400}
                className="w-full"
                onError={(error) => {
                  console.error('Funnel chart rendering error:', error);
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="Enter chart title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={chartData.unit}
                    onChange={(e) => setChartData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="e.g., users, leads, sessions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <select
                    value={chartOptions.sort}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, sort: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="descending">Descending</option>
                    <option value="ascending">Ascending</option>
                    <option value="none">Custom Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Scheme
                  </label>
                  <select
                    value={chartOptions.colorScheme}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="gradient">Gradient</option>
                    <option value="sequential">Sequential</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alignment
                  </label>
                  <select
                    value={chartOptions.funnelAlign}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, funnelAlign: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label Position
                  </label>
                  <select
                    value={chartOptions.labelPosition}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, labelPosition: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="inside">Inside</option>
                    <option value="outside">Outside</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gap: {chartOptions.gap}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={chartOptions.gap}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, gap: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showLabels}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Show Labels</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showPercentage}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showPercentage: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Show Percentages</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sample Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <button
                  onClick={() => generateSampleData('sales')}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Sales Pipeline
                </button>
                <button
                  onClick={() => generateSampleData('marketing')}
                  className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  Marketing Funnel
                </button>
                <button
                  onClick={() => generateSampleData('ecommerce')}
                  className="w-full px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                >
                  E-commerce Funnel
                </button>
              </div>
            </div>

            {/* Data Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Funnel Stages</h3>
                <button
                  onClick={addDataItem}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Stage</span>
                </button>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {chartData.data.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Stage {index + 1}</span>
                      {chartData.data.length > 2 && (
                        <button
                          onClick={() => removeDataItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateDataItem(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Stage name"
                      />
                      
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => updateDataItem(index, 'value', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Value"
                        min="0"
                        step="1"
                      />
                      
                      {index > 0 && (
                        <div className="text-xs text-gray-500">
                          Conversion: {((item.value / chartData.data[index - 1].value) * 100).toFixed(1)}%
                        </div>
                      )}
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

export default FunnelChartBuilder;