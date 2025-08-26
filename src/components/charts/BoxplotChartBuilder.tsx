import React, { useState, useCallback } from 'react';
import { BarChart3, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface BoxplotChartBuilderProps {
  className?: string;
}

interface BoxplotDataSet {
  name: string;
  data: number[];
  color: string;
}

interface ChartData {
  title: string;
  datasets: BoxplotDataSet[];
  xAxisLabel: string;
  yAxisLabel: string;
}

/**
 * Isolated Boxplot Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const BoxplotChartBuilder: React.FC<BoxplotChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Statistical Distribution Analysis',
    xAxisLabel: 'Categories',
    yAxisLabel: 'Values',
    datasets: [
      {
        name: 'Group A',
        data: [120, 132, 101, 134, 90, 230, 210, 85, 88, 134, 145, 156, 167, 178, 189, 190],
        color: '#5470c6'
      },
      {
        name: 'Group B', 
        data: [220, 182, 191, 234, 290, 330, 310, 185, 188, 234, 245, 256, 267, 278, 289, 290],
        color: '#91cc75'
      },
      {
        name: 'Group C',
        data: [150, 172, 121, 164, 190, 200, 180, 165, 168, 174, 175, 186, 197, 198, 199, 200],
        color: '#fac858'
      }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    showOutliers: true,
    orientation: 'vertical' as 'vertical' | 'horizontal',
    boxWidth: 0.7,
    showGrid: true,
    showMean: false,
    colorScheme: 'default' as 'default' | 'pastel' | 'vibrant'
  });

  // Color schemes
  const colorSchemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
    pastel: ['#FFB5B5', '#B5D6FF', '#B5FFB5', '#FFFFB5', '#FFB5FF', '#B5FFFF'],
    vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
  };

  // Calculate boxplot statistics
  const calculateBoxplotStats = useCallback((data: number[]) => {
    try {
      const sorted = [...data].sort((a, b) => a - b);
      const n = sorted.length;
      
      if (n === 0) return [0, 0, 0, 0, 0];
      
      const q1Index = Math.floor(n * 0.25);
      const q2Index = Math.floor(n * 0.5);
      const q3Index = Math.floor(n * 0.75);
      
      const min = sorted[0];
      const q1 = sorted[q1Index];
      const median = n % 2 === 0 ? (sorted[q2Index - 1] + sorted[q2Index]) / 2 : sorted[q2Index];
      const q3 = sorted[q3Index];
      const max = sorted[n - 1];
      
      return [min, q1, median, q3, max];
    } catch (error) {
      console.error('Error calculating boxplot stats:', error);
      return [0, 0, 0, 0, 0];
    }
  }, []);

  // Calculate outliers
  const calculateOutliers = useCallback((data: number[]) => {
    try {
      const sorted = [...data].sort((a, b) => a - b);
      const n = sorted.length;
      
      if (n === 0) return [];
      
      const q1Index = Math.floor(n * 0.25);
      const q3Index = Math.floor(n * 0.75);
      const q1 = sorted[q1Index];
      const q3 = sorted[q3Index];
      const iqr = q3 - q1;
      
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      
      return data.filter(value => value < lowerBound || value > upperBound);
    } catch (error) {
      console.error('Error calculating outliers:', error);
      return [];
    }
  }, []);

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const colors = colorSchemes[chartOptions.colorScheme];
      
      // Prepare boxplot data
      const boxplotData = chartData.datasets.map((dataset, index) => {
        const stats = calculateBoxplotStats(dataset.data);
        return stats;
      });

      // Prepare outliers data
      const outliersData: number[][] = [];
      if (chartOptions.showOutliers) {
        chartData.datasets.forEach((dataset, datasetIndex) => {
          const outliers = calculateOutliers(dataset.data);
          outliers.forEach(outlier => {
            outliersData.push([datasetIndex, outlier]);
          });
        });
      }

      const series: any[] = [
        {
          name: 'Boxplot',
          type: 'boxplot',
          data: boxplotData,
          tooltip: {
            formatter: (param: any) => {
              try {
                const datasetIndex = param.dataIndex;
                const dataset = chartData.datasets[datasetIndex];
                const [min, q1, median, q3, max] = param.data;
                
                return `
                  <div style="text-align: left;">
                    <strong>${dataset.name}</strong><br/>
                    Max: ${max}<br/>
                    Q3: ${q3}<br/>
                    Median: ${median}<br/>
                    Q1: ${q1}<br/>
                    Min: ${min}<br/>
                    IQR: ${(q3 - q1).toFixed(2)}
                  </div>
                `;
              } catch (error) {
                return 'Data unavailable';
              }
            }
          },
          itemStyle: {
            borderWidth: 2
          },
          emphasis: {
            itemStyle: {
              borderWidth: 3,
              shadowBlur: 5,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          },
          animationDuration: 1200,
          animationEasing: 'cubicOut'
        }
      ];

      // Add outliers series if enabled
      if (chartOptions.showOutliers && outliersData.length > 0) {
        series.push({
          name: 'Outliers',
          type: 'scatter',
          data: outliersData,
          symbolSize: 6,
          itemStyle: {
            color: '#ee6666',
            opacity: 0.8
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              shadowBlur: 5,
              shadowColor: 'rgba(238, 102, 102, 0.5)'
            }
          },
          tooltip: {
            formatter: (param: any) => {
              try {
                const [datasetIndex, value] = param.data;
                const dataset = chartData.datasets[datasetIndex];
                return `<strong>${dataset.name}</strong><br/>Outlier: ${value}`;
              } catch (error) {
                return 'Outlier';
              }
            }
          }
        });
      }

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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          textStyle: {
            color: '#374151'
          }
        },
        legend: {
          data: ['Boxplot', ...(chartOptions.showOutliers ? ['Outliers'] : [])],
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
          type: 'category',
          data: chartData.datasets.map(d => d.name),
          name: chartData.xAxisLabel,
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
          type: 'value',
          name: chartData.yAxisLabel,
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
        backgroundColor: '#FEFEFE',
        color: colors
      };
    } catch (error) {
      console.error('Error generating boxplot chart option:', error);
      return {
        title: {
          text: 'Chart Error',
          left: 'center'
        },
        series: []
      };
    }
  }, [chartData, chartOptions, calculateBoxplotStats, calculateOutliers]);

  // Safe data update handlers
  const updateDataset = useCallback((index: number, field: keyof BoxplotDataSet, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        datasets: prev.datasets.map((dataset, i) => {
          if (i === index) {
            if (field === 'data' && typeof value === 'string') {
              const newData = value.split(',')
                .map((val: string) => parseFloat(val.trim()))
                .filter((val: number) => !isNaN(val));
              return { ...dataset, data: newData };
            }
            return { ...dataset, [field]: value };
          }
          return dataset;
        })
      }));
    } catch (error) {
      console.error('Error updating dataset:', error);
    }
  }, []);

  const addDataset = useCallback(() => {
    try {
      const colors = colorSchemes[chartOptions.colorScheme];
      const newColor = colors[chartData.datasets.length % colors.length];
      
      setChartData(prev => ({
        ...prev,
        datasets: [
          ...prev.datasets,
          {
            name: `Group ${String.fromCharCode(65 + prev.datasets.length)}`,
            data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 200) + 100),
            color: newColor
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding dataset:', error);
    }
  }, [chartData.datasets.length, chartOptions.colorScheme]);

  const removeDataset = useCallback((index: number) => {
    try {
      if (chartData.datasets.length > 1) {
        setChartData(prev => ({
          ...prev,
          datasets: prev.datasets.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      console.error('Error removing dataset:', error);
    }
  }, [chartData.datasets.length]);

  const generateSampleData = useCallback((type: 'scores' | 'performance' | 'measurements') => {
    try {
      const sampleData = {
        scores: {
          title: 'Test Scores Distribution',
          xAxisLabel: 'Classes',
          yAxisLabel: 'Scores',
          datasets: [
            { name: 'Math', data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 40) + 60), color: '#5470c6' },
            { name: 'Science', data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 35) + 65), color: '#91cc75' },
            { name: 'English', data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 70), color: '#fac858' }
          ]
        },
        performance: {
          title: 'Employee Performance Metrics',
          xAxisLabel: 'Departments',
          yAxisLabel: 'Performance Score',
          datasets: [
            { name: 'Sales', data: Array.from({ length: 25 }, () => Math.floor(Math.random() * 50) + 50), color: '#ee6666' },
            { name: 'Marketing', data: Array.from({ length: 25 }, () => Math.floor(Math.random() * 45) + 55), color: '#73c0de' },
            { name: 'Engineering', data: Array.from({ length: 25 }, () => Math.floor(Math.random() * 40) + 60), color: '#3ba272' }
          ]
        },
        measurements: {
          title: 'Laboratory Measurements',
          xAxisLabel: 'Samples',
          yAxisLabel: 'Measurement Values',
          datasets: [
            { name: 'Sample A', data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 20) + 80), color: '#fc8452' },
            { name: 'Sample B', data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 25) + 75), color: '#9a60b4' },
            { name: 'Sample C', data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 30) + 70), color: '#ea7ccc' }
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
        type: 'boxplot-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `boxplot-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  return (
    <EChartsErrorBoundary>
      <div className={`boxplot-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-800">Boxplot Chart Builder</h2>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
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
                  console.error('Boxplot chart rendering error:', error);
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Y-axis label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Scheme
                  </label>
                  <select
                    value={chartOptions.colorScheme}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="pastel">Pastel</option>
                    <option value="vibrant">Vibrant</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showOutliers}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showOutliers: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Show Outliers</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showGrid}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showGrid: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                  onClick={() => generateSampleData('scores')}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Test Scores
                </button>
                <button
                  onClick={() => generateSampleData('performance')}
                  className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  Performance Metrics
                </button>
                <button
                  onClick={() => generateSampleData('measurements')}
                  className="w-full px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                >
                  Lab Measurements
                </button>
              </div>
            </div>

            {/* Datasets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Datasets</h3>
                <button
                  onClick={addDataset}
                  className="flex items-center space-x-1 px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Dataset</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {chartData.datasets.map((dataset, index) => (
                  <div key={index} className="border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Dataset {index + 1}</span>
                      {chartData.datasets.length > 1 && (
                        <button
                          onClick={() => removeDataset(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={dataset.name}
                        onChange={(e) => updateDataset(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Dataset name"
                      />
                      
                      <textarea
                        value={dataset.data.join(', ')}
                        onChange={(e) => updateDataset(index, 'data', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        rows={3}
                        placeholder="Data values (comma separated)"
                      />
                      
                      <input
                        type="color"
                        value={dataset.color}
                        onChange={(e) => updateDataset(index, 'color', e.target.value)}
                        className="w-full h-8 rounded border border-gray-300"
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

export default BoxplotChartBuilder;