import React, { useState, useCallback } from 'react';
import { LineChart, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface CandlestickChartBuilderProps {
  className?: string;
}

interface CandlestickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface ChartData {
  title: string;
  data: CandlestickDataPoint[];
  symbol: string;
}

/**
 * Isolated Candlestick Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const CandlestickChartBuilder: React.FC<CandlestickChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Stock Price Analysis',
    symbol: 'AAPL',
    data: [
      { date: '2024-01-01', open: 150, high: 155, low: 148, close: 152, volume: 1000000 },
      { date: '2024-01-02', open: 152, high: 158, low: 151, close: 156, volume: 1200000 },
      { date: '2024-01-03', open: 156, high: 160, low: 154, close: 157, volume: 800000 },
      { date: '2024-01-04', open: 157, high: 159, low: 153, close: 154, volume: 900000 },
      { date: '2024-01-05', open: 154, high: 156, low: 150, close: 151, volume: 1100000 },
      { date: '2024-01-08', open: 151, high: 153, low: 148, close: 149, volume: 1300000 },
      { date: '2024-01-09', open: 149, high: 152, low: 147, close: 150, volume: 1000000 },
      { date: '2024-01-10', open: 150, high: 154, low: 149, close: 153, volume: 950000 }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    showVolume: true,
    colorScheme: 'traditional' as 'traditional' | 'modern' | 'monochrome',
    candleWidth: 'auto' as 'auto' | 'fixed',
    showGrid: true,
    showMA: false,
    maLength: 20
  });

  // Color schemes for candlesticks
  const colorSchemes = {
    traditional: {
      up: '#00DA3C',
      down: '#EC0000',
      upBorder: '#008F28',
      downBorder: '#8A0000'
    },
    modern: {
      up: '#26C6DA',
      down: '#EF5350',
      upBorder: '#00ACC1',
      downBorder: '#E53935'
    },
    monochrome: {
      up: '#606060',
      down: '#303030',
      upBorder: '#404040',
      downBorder: '#202020'
    }
  };

  // Calculate moving average
  const calculateMA = useCallback((data: CandlestickDataPoint[], length: number) => {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < length - 1) {
        result.push(NaN);
      } else {
        const sum = data.slice(i - length + 1, i + 1).reduce((acc, curr) => acc + curr.close, 0);
        result.push(sum / length);
      }
    }
    return result;
  }, []);

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const colors = colorSchemes[chartOptions.colorScheme];
      const dates = chartData.data.map(d => d.date);
      const candleData = chartData.data.map(d => [d.open, d.close, d.low, d.high]);
      const volumeData = chartData.data.map(d => d.volume || 0);
      const maData = chartOptions.showMA ? calculateMA(chartData.data, chartOptions.maLength) : [];

      const series: any[] = [
        {
          name: chartData.symbol,
          type: 'candlestick',
          data: candleData,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: colors.up,
            color0: colors.down,
            borderColor: colors.upBorder,
            borderColor0: colors.downBorder,
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              borderWidth: 2
            }
          },
          barMaxWidth: chartOptions.candleWidth === 'fixed' ? 10 : undefined,
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        }
      ];

      if (chartOptions.showMA && maData.length > 0) {
        series.push({
          name: `MA${chartOptions.maLength}`,
          type: 'line',
          data: maData,
          xAxisIndex: 0,
          yAxisIndex: 0,
          smooth: true,
          lineStyle: {
            color: '#FF6B6B',
            width: 2,
            opacity: 0.8
          },
          symbol: 'none',
          animationDuration: 1500
        });
      }

      if (chartOptions.showVolume) {
        series.push({
          name: 'Volume',
          type: 'bar',
          data: volumeData,
          xAxisIndex: 0,
          yAxisIndex: 1,
          itemStyle: {
            color: (params: any) => {
              const dataIndex = params.dataIndex;
              if (dataIndex < chartData.data.length) {
                const current = chartData.data[dataIndex];
                return current.close >= current.open ? colors.up + '60' : colors.down + '60';
              }
              return colors.up + '60';
            }
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8
            }
          },
          animationDuration: 800
        });
      }

      return {
        title: {
          text: chartData.title,
          subtext: `Symbol: ${chartData.symbol}`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1E293B'
          },
          subtextStyle: {
            color: '#64748B'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: (params: any) => {
            try {
              if (!params || params.length === 0) return '';
              
              const date = params[0].axisValue;
              let result = `<strong>${date}</strong><br/>`;
              
              params.forEach((param: any) => {
                if (param.seriesName === chartData.symbol && param.data) {
                  const [open, close, low, high] = param.data;
                  const change = ((close - open) / open * 100).toFixed(2);
                  const changeColor = close >= open ? colors.up : colors.down;
                  
                  result += `
                    <div style="margin: 5px 0;">
                      <strong>${param.seriesName}</strong><br/>
                      Open: ${open}<br/>
                      High: ${high}<br/>
                      Low: ${low}<br/>
                      Close: ${close}<br/>
                      <span style="color: ${changeColor}">Change: ${change}%</span>
                    </div>
                  `;
                } else if (param.seriesName === 'Volume') {
                  result += `Volume: ${param.data.toLocaleString()}<br/>`;
                } else if (param.seriesName.startsWith('MA')) {
                  result += `${param.seriesName}: ${param.data.toFixed(2)}<br/>`;
                }
              });
              
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
        legend: {
          data: [
            chartData.symbol,
            ...(chartOptions.showMA ? [`MA${chartOptions.maLength}`] : []),
            ...(chartOptions.showVolume ? ['Volume'] : [])
          ],
          top: 40,
          textStyle: {
            color: '#374151'
          }
        },
        grid: [
          {
            id: 'price',
            left: '3%',
            right: '4%',
            top: '15%',
            height: chartOptions.showVolume ? '50%' : '75%',
            show: chartOptions.showGrid,
            borderColor: '#E5E7EB'
          },
          ...(chartOptions.showVolume ? [{
            id: 'volume',
            left: '3%',
            right: '4%',
            top: '70%',
            height: '20%',
            show: chartOptions.showGrid,
            borderColor: '#E5E7EB'
          }] : [])
        ],
        xAxis: [
          {
            type: 'category',
            data: dates,
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#6B7280'
              }
            },
            splitLine: {
              show: false
            },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
          }
        ],
        yAxis: [
          {
            scale: true,
            splitArea: {
              show: chartOptions.showGrid
            },
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
          ...(chartOptions.showVolume ? [{
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
          }] : [])
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100
          },
          {
            show: true,
            xAxisIndex: [0],
            type: 'slider',
            top: '90%',
            start: 0,
            end: 100
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating candlestick chart option:', error);
      return {
        title: {
          text: 'Chart Error',
          left: 'center'
        },
        series: []
      };
    }
  }, [chartData, chartOptions, colorSchemes, calculateMA]);

  // Safe data update handlers
  const updateDataPoint = useCallback((index: number, field: keyof CandlestickDataPoint, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        data: prev.data.map((item, i) => {
          if (i === index) {
            const updatedItem = { ...item, [field]: value };
            if (field !== 'date') {
              const numValue = parseFloat(value) || 0;
              updatedItem[field] = numValue;
            }
            return updatedItem;
          }
          return item;
        })
      }));
    } catch (error) {
      console.error('Error updating data point:', error);
    }
  }, []);

  const addDataPoint = useCallback(() => {
    try {
      const lastPoint = chartData.data[chartData.data.length - 1];
      const nextDate = new Date(lastPoint.date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      setChartData(prev => ({
        ...prev,
        data: [
          ...prev.data,
          {
            date: nextDate.toISOString().split('T')[0],
            open: lastPoint.close,
            high: lastPoint.close + 5,
            low: lastPoint.close - 5,
            close: lastPoint.close + Math.random() * 10 - 5,
            volume: Math.floor(Math.random() * 1000000) + 500000
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding data point:', error);
    }
  }, [chartData.data]);

  const removeDataPoint = useCallback((index: number) => {
    try {
      if (chartData.data.length > 2) {
        setChartData(prev => ({
          ...prev,
          data: prev.data.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      console.error('Error removing data point:', error);
    }
  }, [chartData.data.length]);

  const generateSampleData = useCallback((type: 'bullish' | 'bearish' | 'volatile') => {
    try {
      const baseDate = new Date('2024-01-01');
      const data: CandlestickDataPoint[] = [];
      let currentPrice = 150;
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        
        let trend = 0;
        if (type === 'bullish') trend = Math.random() * 2;
        else if (type === 'bearish') trend = -Math.random() * 2;
        else trend = (Math.random() - 0.5) * 4; // volatile
        
        const open = currentPrice;
        const volatility = Math.random() * 8 + 2;
        const high = open + Math.random() * volatility;
        const low = open - Math.random() * volatility;
        const close = open + trend + (Math.random() - 0.5) * 4;
        
        data.push({
          date: date.toISOString().split('T')[0],
          open: Math.round(open * 100) / 100,
          high: Math.round(Math.max(high, open, close) * 100) / 100,
          low: Math.round(Math.min(low, open, close) * 100) / 100,
          close: Math.round(close * 100) / 100,
          volume: Math.floor(Math.random() * 1000000) + 500000
        });
        
        currentPrice = close;
      }
      
      setChartData(prev => ({ ...prev, data }));
    } catch (error) {
      console.error('Error generating sample data:', error);
    }
  }, []);

  // Safe export functionality
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        type: 'candlestick-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `candlestick-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  return (
    <EChartsErrorBoundary>
      <div className={`candlestick-chart-builder ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <LineChart className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">Candlestick Chart Builder</h2>
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
                  console.error('Candlestick chart rendering error:', error);
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
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={chartData.symbol}
                    onChange={(e) => setChartData(prev => ({ ...prev, symbol: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="Stock symbol (e.g., AAPL)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Scheme
                  </label>
                  <select
                    value={chartOptions.colorScheme}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="traditional">Traditional (Green/Red)</option>
                    <option value="modern">Modern (Cyan/Red)</option>
                    <option value="monochrome">Monochrome</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Candle Width
                  </label>
                  <select
                    value={chartOptions.candleWidth}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, candleWidth: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="auto">Auto</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showVolume}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showVolume: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Show Volume</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showGrid}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showGrid: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Show Grid</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartOptions.showMA}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showMA: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Show Moving Average</span>
                  </label>
                </div>

                {chartOptions.showMA && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MA Length: {chartOptions.maLength}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={chartOptions.maLength}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, maLength: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sample Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Market Scenarios</h3>
              <div className="space-y-2">
                <button
                  onClick={() => generateSampleData('bullish')}
                  className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  Bullish Trend
                </button>
                <button
                  onClick={() => generateSampleData('bearish')}
                  className="w-full px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Bearish Trend
                </button>
                <button
                  onClick={() => generateSampleData('volatile')}
                  className="w-full px-3 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                >
                  Volatile Market
                </button>
              </div>
            </div>

            {/* Data Points */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Data Points</h3>
                <button
                  onClick={addDataPoint}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {chartData.data.map((point, index) => (
                  <div key={index} className="border border-gray-200 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{point.date}</span>
                      {chartData.data.length > 2 && (
                        <button
                          onClick={() => removeDataPoint(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <input
                        type="number"
                        value={point.open}
                        onChange={(e) => updateDataPoint(index, 'open', e.target.value)}
                        className="px-1 py-0.5 border border-gray-300 rounded"
                        placeholder="Open"
                        step="0.01"
                      />
                      <input
                        type="number"
                        value={point.high}
                        onChange={(e) => updateDataPoint(index, 'high', e.target.value)}
                        className="px-1 py-0.5 border border-gray-300 rounded"
                        placeholder="High"
                        step="0.01"
                      />
                      <input
                        type="number"
                        value={point.low}
                        onChange={(e) => updateDataPoint(index, 'low', e.target.value)}
                        className="px-1 py-0.5 border border-gray-300 rounded"
                        placeholder="Low"
                        step="0.01"
                      />
                      <input
                        type="number"
                        value={point.close}
                        onChange={(e) => updateDataPoint(index, 'close', e.target.value)}
                        className="px-1 py-0.5 border border-gray-300 rounded"
                        placeholder="Close"
                        step="0.01"
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

export default CandlestickChartBuilder;