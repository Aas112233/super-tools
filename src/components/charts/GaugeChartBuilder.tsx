import React, { useState, useCallback } from 'react';
import { Gauge, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface GaugeChartBuilderProps {
  className?: string;
}

interface GaugeData {
  name: string;
  value: number;
}

interface ChartData {
  title: string;
  gauges: GaugeData[];
  min: number;
  max: number;
  unit: string;
}

/**
 * Isolated Gauge Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const GaugeChartBuilder: React.FC<GaugeChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'KPI Dashboard',
    gauges: [
      { name: 'Performance', value: 85 },
      { name: 'Quality', value: 92 },
      { name: 'Efficiency', value: 78 }
    ],
    min: 0,
    max: 100,
    unit: '%'
  });

  const [chartOptions, setChartOptions] = useState({
    showProgress: true,
    showPointer: true,
    showTitle: true,
    showDetail: true,
    splitNumber: 10,
    gaugeSize: 75,
    colorScheme: 'gradient' as 'gradient' | 'segments' | 'solid',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    backgroundColor: '#F8FAFC'
  });

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const generateColors = () => {
        switch (chartOptions.colorScheme) {
          case 'gradient':
            return [
              [0.2, '#ff4d4f'],
              [0.4, '#ff7a45'],
              [0.6, '#ffa940'],
              [0.8, '#52c41a'],
              [1, '#1890ff']
            ];
          case 'segments':
            return [
              [0.2, '#EF4444'],
              [0.4, '#F59E0B'],
              [0.6, '#EAB308'],
              [0.8, '#22C55E'],
              [1, '#3B82F6']
            ];
          case 'solid':
            return chartOptions.primaryColor;
          default:
            return chartOptions.primaryColor;
        }
      };

      const gaugeRadius = chartOptions.gaugeSize;
      const gaugeCount = chartData.gauges.length;
      const cols = Math.ceil(Math.sqrt(gaugeCount));
      const rows = Math.ceil(gaugeCount / cols);

      return {
        title: {
          text: chartData.title,
          left: 'center',
          top: 20,
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1E293B'
          }
        },
        series: chartData.gauges.map((gauge, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const centerX = (100 / cols) * (col + 0.5);
          const centerY = (100 / rows) * (row + 0.5);

          return {
            name: gauge.name,
            type: 'gauge',
            center: [`${centerX}%`, `${centerY}%`],
            radius: `${gaugeRadius / Math.max(cols, rows)}%`,
            min: chartData.min,
            max: chartData.max,
            splitNumber: chartOptions.splitNumber,
            axisLine: {
              lineStyle: {
                color: generateColors(),
                width: 8
              }
            },
            axisLabel: {
              distance: 25,
              color: '#374151',
              fontSize: 10,
              formatter: (value: number) => {
                return `${value}${chartData.unit}`;
              }
            },
            axisTick: {
              distance: -8,
              splitNumber: 5,
              lineStyle: {
                color: '#6B7280',
                width: 1
              }
            },
            splitLine: {
              distance: -15,
              lineStyle: {
                color: '#6B7280',
                width: 2
              }
            },
            pointer: {
              show: chartOptions.showPointer,
              length: '75%',
              width: 3,
              itemStyle: {
                color: '#374151'
              }
            },
            progress: {
              show: chartOptions.showProgress,
              overlap: false,
              roundCap: true,
              clip: false
            },
            title: {
              show: chartOptions.showTitle,
              offsetCenter: [0, '85%'],
              fontSize: 12,
              color: '#374151',
              fontWeight: 'bold'
            },
            detail: {
              show: chartOptions.showDetail,
              offsetCenter: [0, '95%'],
              valueAnimation: true,
              fontSize: 14,
              color: chartOptions.primaryColor,
              fontWeight: 'bold',
              formatter: (value: number) => {
                return `${value}${chartData.unit}`;
              }
            },
            data: [
              {
                value: gauge.value,
                name: gauge.name,
                title: {
                  show: chartOptions.showTitle
                },
                detail: {
                  show: chartOptions.showDetail
                }
              }
            ],
            animationDuration: 2000,
            animationEasing: 'elasticOut'
          };
        }),
        backgroundColor: chartOptions.backgroundColor
      };
    } catch (error) {
      console.error('Error generating gauge chart option:', error);
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
  const updateGauge = useCallback((index: number, field: keyof GaugeData, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        gauges: prev.gauges.map((gauge, i) => {
          if (i === index) {
            const updatedGauge = { ...gauge, [field]: value };
            if (field === 'value') {
              updatedGauge.value = Math.max(prev.min, Math.min(prev.max, parseFloat(value) || 0));
            }
            return updatedGauge;
          }
          return gauge;
        })
      }));
    } catch (error) {
      console.error('Error updating gauge:', error);
    }
  }, []);

  const addGauge = useCallback(() => {
    try {
      setChartData(prev => ({
        ...prev,
        gauges: [
          ...prev.gauges,
          { name: `Metric ${prev.gauges.length + 1}`, value: 50 }
        ]
      }));
    } catch (error) {
      console.error('Error adding gauge:', error);
    }
  }, []);

  const removeGauge = useCallback((index: number) => {
    try {
      if (chartData.gauges.length > 1) {
        setChartData(prev => ({
          ...prev,
          gauges: prev.gauges.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      console.error('Error removing gauge:', error);
    }
  }, [chartData.gauges.length]);

  const generateRandomValues = useCallback(() => {
    try {
      setChartData(prev => ({
        ...prev,
        gauges: prev.gauges.map(gauge => ({
          ...gauge,
          value: Math.floor(Math.random() * (prev.max - prev.min) + prev.min)
        }))
      }));
    } catch (error) {
      console.error('Error generating random values:', error);
    }
  }, []);

  // Safe export functionality
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        type: 'gauge-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `gauge-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  return (
    <EChartsErrorBoundary>
      <div className={`gauge-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Gauge className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Gauge Chart Builder</h2>
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
                height={400}
                className="w-full"
                onError={(error) => {
                  console.error('Gauge chart rendering error:', error);
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter chart title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Value
                    </label>
                    <input
                      type="number"
                      value={chartData.min}
                      onChange={(e) => setChartData(prev => ({ ...prev, min: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Value
                    </label>
                    <input
                      type="number"
                      value={chartData.max}
                      onChange={(e) => setChartData(prev => ({ ...prev, max: parseFloat(e.target.value) || 100 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={chartData.unit}
                    onChange={(e) => setChartData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g., %, $, units"
                  />
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
                    <option value="gradient">Gradient</option>
                    <option value="segments">Segments</option>
                    <option value="solid">Solid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gauge Size: {chartOptions.gaugeSize}%
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    value={chartOptions.gaugeSize}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, gaugeSize: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Split Number: {chartOptions.splitNumber}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={chartOptions.splitNumber}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, splitNumber: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showProgress}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showProgress: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Progress</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showPointer}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showPointer: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Pointer</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showTitle}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showTitle: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Titles</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showDetail}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showDetail: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Values</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Gauges */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Metrics</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={generateRandomValues}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                  >
                    Random
                  </button>
                  <button
                    onClick={addGauge}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {chartData.gauges.map((gauge, index) => (
                  <div key={index} className="border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Metric {index + 1}</span>
                      {chartData.gauges.length > 1 && (
                        <button
                          onClick={() => removeGauge(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={gauge.name}
                        onChange={(e) => updateGauge(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Metric name"
                      />
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={gauge.value}
                          onChange={(e) => updateGauge(index, 'value', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min={chartData.min}
                          max={chartData.max}
                          step="0.1"
                        />
                        <span className="text-xs text-gray-500">{chartData.unit}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${((gauge.value - chartData.min) / (chartData.max - chartData.min)) * 100}%`
                          }}
                        />
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

export default GaugeChartBuilder;