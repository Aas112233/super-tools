import React, { useState, useCallback } from 'react';
import { BarChart2, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface PictorialBarChartBuilderProps {
  className?: string;
}

interface PictorialBarDataItem {
  name: string;
  value: number;
  color: string;
  symbol: string;
  symbolSize?: number;
  symbolRepeat?: boolean | number;
  symbolClip?: boolean;
}

interface ChartData {
  title: string;
  data: PictorialBarDataItem[];
  xAxisLabel: string;
  yAxisLabel: string;
}

/**
 * Isolated Pictorial Bar Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const PictorialBarChartBuilder: React.FC<PictorialBarChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Creative Data Visualization',
    xAxisLabel: 'Categories',
    yAxisLabel: 'Values',
    data: [
      {
        name: 'Apples',
        value: 120,
        color: '#ff6b6b',
        symbol: 'circle',
        symbolSize: 20,
        symbolRepeat: true,
        symbolClip: false
      },
      {
        name: 'Oranges',
        value: 200,
        color: '#feca57',
        symbol: 'rect',
        symbolSize: 18,
        symbolRepeat: true,
        symbolClip: false
      },
      {
        name: 'Bananas',
        value: 150,
        color: '#48dbfb',
        symbol: 'roundRect',
        symbolSize: 16,
        symbolRepeat: true,
        symbolClip: false
      },
      {
        name: 'Grapes',
        value: 80,
        color: '#0abde3',
        symbol: 'triangle',
        symbolSize: 22,
        symbolRepeat: true,
        symbolClip: false
      },
      {
        name: 'Strawberries',
        value: 90,
        color: '#ee5a6f',
        symbol: 'diamond',
        symbolSize: 20,
        symbolRepeat: true,
        symbolClip: false
      }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    orientation: 'vertical' as 'vertical' | 'horizontal',
    showLabels: true,
    showGrid: true,
    animationDuration: 1000,
    symbolRepeatDirection: 'start' as 'start' | 'end',
    barGap: '20%',
    barCategoryGap: '40%'
  });

  // Available symbols for pictorial bars
  const availableSymbols = [
    { value: 'circle', label: 'Circle' },
    { value: 'rect', label: 'Rectangle' },
    { value: 'roundRect', label: 'Rounded Rectangle' },
    { value: 'triangle', label: 'Triangle' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'pin', label: 'Pin' },
    { value: 'arrow', label: 'Arrow' },
    { value: 'none', label: 'None' }
  ];

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const isHorizontal = chartOptions.orientation === 'horizontal';
      
      // Create series for pictorial bars
      const series = chartData.data.map((item, index) => ({
        name: item.name,
        type: 'pictorialBar' as const,
        data: [
          {
            value: item.value,
            name: item.name,
            itemStyle: {
              color: item.color
            }
          }
        ],
        symbol: item.symbol,
        symbolSize: item.symbolSize || 20,
        symbolRepeat: item.symbolRepeat,
        symbolClip: item.symbolClip,
        symbolMargin: '10%',
        symbolRepeatDirection: chartOptions.symbolRepeatDirection,
        barGap: chartOptions.barGap,
        barCategoryGap: chartOptions.barCategoryGap,
        animationDuration: chartOptions.animationDuration,
        animationDelay: index * 100,
        emphasis: {
          itemStyle: {
            opacity: 0.8,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }));

      const option: EChartsOption = {
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
              const { name, value, color } = params;
              return `
                <div style="text-align: left;">
                  <strong>${name}</strong><br/>
                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>
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
        legend: {
          data: chartData.data.map(item => item.name),
          top: 40,
          textStyle: {
            color: '#374151'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true,
          show: chartOptions.showGrid,
          borderColor: '#E5E7EB'
        },
        xAxis: {
          type: isHorizontal ? 'value' : 'category',
          data: isHorizontal ? undefined : chartData.data.map(item => item.name),
          name: isHorizontal ? chartData.yAxisLabel : chartData.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 30,
          axisLine: {
            lineStyle: {
              color: '#6B7280'
            }
          },
          splitLine: {
            show: chartOptions.showGrid,
            lineStyle: {
              color: '#E5E7EB',
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: isHorizontal ? 'category' : 'value',
          data: isHorizontal ? chartData.data.map(item => item.name) : undefined,
          name: isHorizontal ? chartData.xAxisLabel : chartData.yAxisLabel,
          nameLocation: 'middle',
          nameGap: 50,
          axisLine: {
            lineStyle: {
              color: '#6B7280'
            }
          },
          splitLine: {
            show: chartOptions.showGrid,
            lineStyle: {
              color: '#E5E7EB',
              type: 'dashed'
            }
          }
        },
        series: series,
        backgroundColor: '#FEFEFE'
      };

      return option;
    } catch (error) {
      console.error('Error generating pictorial bar chart option:', error);
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
  const updateDataItem = useCallback((index: number, field: keyof PictorialBarDataItem, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        data: prev.data.map((item, i) => {
          if (i === index) {
            if (field === 'value') {
              return { ...item, value: Math.max(0, parseFloat(value) || 0) };
            } else if (field === 'symbolSize') {
              return { ...item, symbolSize: Math.max(5, parseInt(value) || 20) };
            } else if (field === 'symbolRepeat') {
              if (typeof value === 'boolean') {
                return { ...item, symbolRepeat: value };
              } else {
                return { ...item, symbolRepeat: Math.max(1, parseInt(value) || 1) };
              }
            }
            return { ...item, [field]: value };
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
      const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#0abde3', '#ee5a6f', '#ff9ff3', '#54a0ff', '#5f27cd'];
      const symbols = ['circle', 'rect', 'roundRect', 'triangle', 'diamond'];
      
      setChartData(prev => ({
        ...prev,
        data: [
          ...prev.data,
          {
            name: `Item ${prev.data.length + 1}`,
            value: Math.floor(Math.random() * 200) + 50,
            color: colors[prev.data.length % colors.length],
            symbol: symbols[prev.data.length % symbols.length],
            symbolSize: 20,
            symbolRepeat: true,
            symbolClip: false
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding data item:', error);
    }
  }, []);

  const removeDataItem = useCallback((index: number) => {
    try {
      if (chartData.data.length > 1) {
        setChartData(prev => ({
          ...prev,
          data: prev.data.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      console.error('Error removing data item:', error);
    }
  }, [chartData.data.length]);

  const generateSampleData = useCallback((type: 'fruits' | 'devices' | 'social') => {
    try {
      const sampleData = {
        fruits: {
          title: 'Fruit Sales Visualization',
          xAxisLabel: 'Fruit Types',
          yAxisLabel: 'Sales (kg)',
          data: [
            { name: 'Apples', value: 120, color: '#ff6b6b', symbol: 'circle', symbolSize: 20, symbolRepeat: true, symbolClip: false },
            { name: 'Oranges', value: 200, color: '#feca57', symbol: 'circle', symbolSize: 18, symbolRepeat: true, symbolClip: false },
            { name: 'Bananas', value: 150, color: '#48dbfb', symbol: 'roundRect', symbolSize: 16, symbolRepeat: true, symbolClip: false },
            { name: 'Grapes', value: 80, color: '#0abde3', symbol: 'triangle', symbolSize: 22, symbolRepeat: true, symbolClip: false },
            { name: 'Strawberries', value: 90, color: '#ee5a6f', symbol: 'diamond', symbolSize: 20, symbolRepeat: true, symbolClip: false }
          ]
        },
        devices: {
          title: 'Device Usage Statistics',
          xAxisLabel: 'Device Types',
          yAxisLabel: 'Users (thousands)',
          data: [
            { name: 'Smartphones', value: 350, color: '#1e90ff', symbol: 'rect', symbolSize: 25, symbolRepeat: true, symbolClip: false },
            { name: 'Tablets', value: 180, color: '#32cd32', symbol: 'roundRect', symbolSize: 22, symbolRepeat: true, symbolClip: false },
            { name: 'Laptops', value: 220, color: '#ff69b4', symbol: 'rect', symbolSize: 20, symbolRepeat: true, symbolClip: false },
            { name: 'Desktops', value: 90, color: '#ffa500', symbol: 'rect', symbolSize: 24, symbolRepeat: true, symbolClip: false },
            { name: 'Smart TVs', value: 130, color: '#9370db', symbol: 'roundRect', symbolSize: 26, symbolRepeat: true, symbolClip: false }
          ]
        },
        social: {
          title: 'Social Media Engagement',
          xAxisLabel: 'Platforms',
          yAxisLabel: 'Engagement (millions)',
          data: [
            { name: 'Facebook', value: 280, color: '#1877f2', symbol: 'circle', symbolSize: 24, symbolRepeat: true, symbolClip: false },
            { name: 'Instagram', value: 220, color: '#e4405f', symbol: 'diamond', symbolSize: 22, symbolRepeat: true, symbolClip: false },
            { name: 'Twitter', value: 180, color: '#1da1f2', symbol: 'triangle', symbolSize: 20, symbolRepeat: true, symbolClip: false },
            { name: 'LinkedIn', value: 120, color: '#0077b5', symbol: 'rect', symbolSize: 18, symbolRepeat: true, symbolClip: false },
            { name: 'TikTok', value: 300, color: '#ff0050', symbol: 'pin', symbolSize: 26, symbolRepeat: true, symbolClip: false }
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
        type: 'pictorial-bar-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `pictorial-bar-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  return (
    <EChartsErrorBoundary>
      <div className={`pictorial-bar-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart2 className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-semibold text-gray-800">Pictorial Bar Chart Builder</h2>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
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
                  console.error('Pictorial bar chart rendering error:', error);
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    placeholder="Enter chart title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X-Axis Label
                  </label>
                  <input
                    type="text"
                    value={chartData.xAxisLabel}
                    onChange={(e) => setChartData(prev => ({ ...prev, xAxisLabel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    placeholder="X-axis label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Y-Axis Label
                  </label>
                  <input
                    type="text"
                    value={chartData.yAxisLabel}
                    onChange={(e) => setChartData(prev => ({ ...prev, yAxisLabel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    placeholder="Y-axis label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orientation
                  </label>
                  <select
                    value={chartOptions.orientation}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, orientation: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  >
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symbol Repeat Direction
                  </label>
                  <select
                    value={chartOptions.symbolRepeatDirection}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, symbolRepeatDirection: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showLabels}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">Show Labels</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showGrid}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showGrid: e.target.checked }))}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">Show Grid</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sample Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <button
                  onClick={() => generateSampleData('fruits')}
                  className="w-full px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Fruit Sales
                </button>
                <button
                  onClick={() => generateSampleData('devices')}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Device Usage
                </button>
                <button
                  onClick={() => generateSampleData('social')}
                  className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                >
                  Social Media
                </button>
              </div>
            </div>

            {/* Data Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Data Items</h3>
                <button
                  onClick={addDataItem}
                  className="flex items-center space-x-1 px-3 py-1 bg-pink-500 text-white text-sm rounded hover:bg-pink-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Item</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {chartData.data.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Item {index + 1}</span>
                      {chartData.data.length > 1 && (
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
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="Item name"
                      />
                      
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => updateDataItem(index, 'value', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="Value"
                        min="0"
                        step="1"
                      />
                      
                      <select
                        value={item.symbol}
                        onChange={(e) => updateDataItem(index, 'symbol', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                      >
                        {availableSymbols.map(symbol => (
                          <option key={symbol.value} value={symbol.value}>{symbol.label}</option>
                        ))}
                      </select>
                      
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={item.symbolSize || 20}
                          onChange={(e) => updateDataItem(index, 'symbolSize', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                          placeholder="Size"
                          min="5"
                          max="50"
                        />
                        <input
                          type="color"
                          value={item.color}
                          onChange={(e) => updateDataItem(index, 'color', e.target.value)}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={!!item.symbolRepeat}
                            onChange={(e) => updateDataItem(index, 'symbolRepeat', e.target.checked)}
                            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                          />
                          <span className="text-xs text-gray-700">Repeat</span>
                        </label>
                        
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={!!item.symbolClip}
                            onChange={(e) => updateDataItem(index, 'symbolClip', e.target.checked)}
                            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                          />
                          <span className="text-xs text-gray-700">Clip</span>
                        </label>
                      </div>
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

export default PictorialBarChartBuilder;