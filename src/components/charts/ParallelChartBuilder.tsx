import React, { useState, useCallback } from 'react';
import { BarChart3, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface ParallelChartBuilderProps {
  className?: string;
}

interface ParallelDimension {
  name: string;
  type?: 'value' | 'category';
  min?: number;
  max?: number;
  categories?: string[];
}

interface ParallelDataPoint {
  [key: string]: number | string;
}

interface ChartData {
  title: string;
  dimensions: ParallelDimension[];
  data: ParallelDataPoint[];
}

/**
 * Isolated Parallel Coordinates Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const ParallelChartBuilder: React.FC<ParallelChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Multi-Dimensional Data Analysis',
    dimensions: [
      { name: 'Price', type: 'value', min: 0, max: 100 },
      { name: 'Quality', type: 'value', min: 0, max: 10 },
      { name: 'Performance', type: 'value', min: 0, max: 100 },
      { name: 'Features', type: 'value', min: 0, max: 20 },
      { name: 'Brand', type: 'category', categories: ['Apple', 'Samsung', 'Google', 'Huawei', 'OnePlus'] }
    ],
    data: [
      { Price: 80, Quality: 8.5, Performance: 85, Features: 15, Brand: 'Apple' },
      { Price: 65, Quality: 7.8, Performance: 82, Features: 14, Brand: 'Samsung' },
      { Price: 50, Quality: 7.2, Performance: 78, Features: 12, Brand: 'Google' },
      { Price: 45, Quality: 6.8, Performance: 75, Features: 11, Brand: 'Huawei' },
      { Price: 70, Quality: 8.0, Performance: 88, Features: 16, Brand: 'OnePlus' },
      { Price: 85, Quality: 9.0, Performance: 90, Features: 18, Brand: 'Apple' },
      { Price: 60, Quality: 7.5, Performance: 80, Features: 13, Brand: 'Samsung' },
      { Price: 55, Quality: 7.0, Performance: 76, Features: 10, Brand: 'Google' },
      { Price: 40, Quality: 6.5, Performance: 70, Features: 9, Brand: 'Huawei' },
      { Price: 75, Quality: 8.2, Performance: 85, Features: 17, Brand: 'OnePlus' }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    smooth: false,
    realtime: true,
    colorBy: 'data' as 'data' | 'series',
    colorScheme: 'default' as 'default' | 'gradient' | 'category',
    lineOpacity: 0.4,
    lineWidth: 2,
    brushLink: 'all' as 'all' | 'none' | string,
    showAxisName: true,
    parallelIndex: 0
  });

  // Color schemes
  const colorSchemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
    gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
    category: ['#ff7f50', '#87ceeb', '#da70d6', '#32cd32', '#ffd700', '#ff69b4', '#ba55d3', '#cd5c5c']
  };

  // Generate parallel coordinates configuration
  const generateParallelConfig = useCallback(() => {
    try {
      return chartData.dimensions.map((dim, index) => {
        const config: any = {
          dim: index,
          name: dim.name,
          nameLocation: 'start',
          nameTextStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#374151'
          }
        };

        if (dim.type === 'category' && dim.categories) {
          config.type = 'category';
          config.data = dim.categories;
        } else {
          config.type = 'value';
          config.min = dim.min || 0;
          config.max = dim.max || 100;
          config.axisLabel = {
            formatter: (value: number) => value.toFixed(1)
          };
        }

        return config;
      });
    } catch (error) {
      console.error('Error generating parallel config:', error);
      return [];
    }
  }, [chartData.dimensions]);

  // Convert data for parallel coordinates
  const convertDataForParallel = useCallback(() => {
    try {
      return chartData.data.map(item => {
        return chartData.dimensions.map(dim => {
          const value = item[dim.name];
          if (dim.type === 'category' && dim.categories) {
            const index = dim.categories.indexOf(value as string);
            return index >= 0 ? index : 0;
          }
          return typeof value === 'number' ? value : 0;
        });
      });
    } catch (error) {
      console.error('Error converting data:', error);
      return [];
    }
  }, [chartData]);

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const colors = colorSchemes[chartOptions.colorScheme];
      const parallelData = convertDataForParallel();

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
              const dataIndex = params.dataIndex;
              const item = chartData.data[dataIndex];
              if (!item) return 'Data unavailable';

              let result = '<div style="text-align: left;"><strong>Data Point</strong><br/>';
              chartData.dimensions.forEach(dim => {
                const value = item[dim.name];
                result += `${dim.name}: ${value}<br/>`;
              });
              result += '</div>';
              return result;
            } catch (error) {
              return 'Data unavailable';
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          textStyle: {
            color: '#374151'
          }
        },
        parallel: {
          left: '5%',
          right: '18%',
          bottom: '10%',
          top: '20%',
          parallelAxisDefault: {
            type: 'value',
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
              color: '#374151',
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: '#94A3B8'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#94A3B8'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#6B7280'
            }
          }
        },
        parallelAxis: generateParallelConfig(),
        visualMap: {
          show: true,
          min: 0,
          max: Math.max(...parallelData.flat()),
          dimension: 0,
          inRange: {
            color: colors
          },
          textStyle: {
            color: '#374151'
          },
          right: 10,
          top: 'middle'
        },
        series: [
          {
            name: 'Parallel Coordinates',
            type: 'parallel',
            lineStyle: {
              width: chartOptions.lineWidth,
              opacity: chartOptions.lineOpacity
            },
            data: parallelData,
            smooth: chartOptions.smooth,
            realtime: chartOptions.realtime,
            emphasis: {
              lineStyle: {
                width: chartOptions.lineWidth + 2,
                opacity: 1
              }
            },
            animationDuration: 1000,
            animationEasing: 'cubicOut'
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating parallel chart option:', error);
      return {
        title: {
          text: 'Chart Error',
          left: 'center'
        },
        series: []
      };
    }
  }, [chartData, chartOptions, generateParallelConfig, convertDataForParallel]);

  // Safe data update handlers
  const updateDimension = useCallback((index: number, field: keyof ParallelDimension, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        dimensions: prev.dimensions.map((dim, i) => {
          if (i === index) {
            if (field === 'categories' && typeof value === 'string') {
              const categories = value.split(',').map(cat => cat.trim()).filter(cat => cat);
              return { ...dim, categories };
            } else if (field === 'min' || field === 'max') {
              return { ...dim, [field]: parseFloat(value) || 0 };
            } else {
              return { ...dim, [field]: value };
            }
          }
          return dim;
        })
      }));
    } catch (error) {
      console.error('Error updating dimension:', error);
    }
  }, []);

  const addDimension = useCallback(() => {
    try {
      setChartData(prev => ({
        ...prev,
        dimensions: [
          ...prev.dimensions,
          {
            name: `Dimension ${prev.dimensions.length + 1}`,
            type: 'value',
            min: 0,
            max: 100
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding dimension:', error);
    }
  }, []);

  const removeDimension = useCallback((index: number) => {
    try {
      if (chartData.dimensions.length > 2) {
        setChartData(prev => ({
          ...prev,
          dimensions: prev.dimensions.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      console.error('Error removing dimension:', error);
    }
  }, [chartData.dimensions.length]);

  const addDataPoint = useCallback(() => {
    try {
      const newPoint: ParallelDataPoint = {};
      chartData.dimensions.forEach(dim => {
        if (dim.type === 'category' && dim.categories) {
          newPoint[dim.name] = dim.categories[0] || 'Unknown';
        } else {
          const min = dim.min || 0;
          const max = dim.max || 100;
          newPoint[dim.name] = Math.floor(Math.random() * (max - min) + min);
        }
      });

      setChartData(prev => ({
        ...prev,
        data: [...prev.data, newPoint]
      }));
    } catch (error) {
      console.error('Error adding data point:', error);
    }
  }, [chartData.dimensions]);

  const removeDataPoint = useCallback((index: number) => {
    try {
      if (chartData.data.length > 1) {
        setChartData(prev => ({
          ...prev,
          data: prev.data.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      console.error('Error removing data point:', error);
    }
  }, [chartData.data.length]);

  const generateSampleData = useCallback((type: 'products' | 'employees' | 'stocks') => {
    try {
      const sampleData = {
        products: {
          title: 'Product Comparison Analysis',
          dimensions: [
            { name: 'Price', type: 'value', min: 0, max: 100 },
            { name: 'Quality', type: 'value', min: 0, max: 10 },
            { name: 'Performance', type: 'value', min: 0, max: 100 },
            { name: 'Features', type: 'value', min: 0, max: 20 },
            { name: 'Brand', type: 'category', categories: ['Apple', 'Samsung', 'Google', 'Huawei', 'OnePlus'] }
          ],
          data: Array.from({ length: 15 }, () => ({
            Price: Math.floor(Math.random() * 100),
            Quality: Math.floor(Math.random() * 10),
            Performance: Math.floor(Math.random() * 100),
            Features: Math.floor(Math.random() * 20),
            Brand: ['Apple', 'Samsung', 'Google', 'Huawei', 'OnePlus'][Math.floor(Math.random() * 5)]
          }))
        },
        employees: {
          title: 'Employee Performance Analysis',
          dimensions: [
            { name: 'Experience', type: 'value', min: 0, max: 20 },
            { name: 'Performance', type: 'value', min: 0, max: 100 },
            { name: 'Salary', type: 'value', min: 30, max: 150 },
            { name: 'Education', type: 'value', min: 1, max: 5 },
            { name: 'Department', type: 'category', categories: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'] }
          ],
          data: Array.from({ length: 20 }, () => ({
            Experience: Math.floor(Math.random() * 20),
            Performance: Math.floor(Math.random() * 100),
            Salary: Math.floor(Math.random() * 120) + 30,
            Education: Math.floor(Math.random() * 5) + 1,
            Department: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'][Math.floor(Math.random() * 5)]
          }))
        },
        stocks: {
          title: 'Stock Analysis Dashboard',
          dimensions: [
            { name: 'Price', type: 'value', min: 0, max: 500 },
            { name: 'Volume', type: 'value', min: 0, max: 1000 },
            { name: 'PE Ratio', type: 'value', min: 0, max: 50 },
            { name: 'Dividend', type: 'value', min: 0, max: 10 },
            { name: 'Sector', type: 'category', categories: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'] }
          ],
          data: Array.from({ length: 25 }, () => ({
            Price: Math.floor(Math.random() * 500),
            Volume: Math.floor(Math.random() * 1000),
            'PE Ratio': Math.floor(Math.random() * 50),
            Dividend: Math.floor(Math.random() * 10),
            Sector: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'][Math.floor(Math.random() * 5)]
          }))
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
        type: 'parallel-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `parallel-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  return (
    <EChartsErrorBoundary>
      <div className={`parallel-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Parallel Coordinates Builder</h2>
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
                  console.error('Parallel chart rendering error:', error);
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line Opacity: {chartOptions.lineOpacity}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={chartOptions.lineOpacity}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, lineOpacity: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line Width: {chartOptions.lineWidth}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={chartOptions.lineWidth}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, lineWidth: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.smooth}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, smooth: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Smooth Lines</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.realtime}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, realtime: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Real-time Brush</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sample Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <button
                  onClick={() => generateSampleData('products')}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Product Analysis
                </button>
                <button
                  onClick={() => generateSampleData('employees')}
                  className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  Employee Performance
                </button>
                <button
                  onClick={() => generateSampleData('stocks')}
                  className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                >
                  Stock Analysis
                </button>
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Dimensions</h3>
                <button
                  onClick={addDimension}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {chartData.dimensions.map((dim, index) => (
                  <div key={index} className="border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Dimension {index + 1}</span>
                      {chartData.dimensions.length > 2 && (
                        <button
                          onClick={() => removeDimension(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={dim.name}
                        onChange={(e) => updateDimension(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Dimension name"
                      />
                      
                      <select
                        value={dim.type}
                        onChange={(e) => updateDimension(index, 'type', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="value">Numeric</option>
                        <option value="category">Category</option>
                      </select>

                      {dim.type === 'category' ? (
                        <textarea
                          value={dim.categories?.join(', ') || ''}
                          onChange={(e) => updateDimension(index, 'categories', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          rows={2}
                          placeholder="Category1, Category2, Category3"
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-1">
                          <input
                            type="number"
                            value={dim.min || 0}
                            onChange={(e) => updateDimension(index, 'min', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Min"
                          />
                          <input
                            type="number"
                            value={dim.max || 100}
                            onChange={(e) => updateDimension(index, 'max', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Max"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Points */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Data Points ({chartData.data.length})</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={addDataPoint}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 max-h-20 overflow-y-auto">
                <div className="font-medium mb-1">Sample Data:</div>
                {chartData.data.slice(0, 3).map((item, index) => (
                  <div key={index} className="mb-1">
                    {Object.entries(item).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  </div>
                ))}
                {chartData.data.length > 3 && <div>... and {chartData.data.length - 3} more</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default ParallelChartBuilder;