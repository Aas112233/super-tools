import React, { useState, useCallback } from 'react';
import { Grid3x3, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface HeatmapChartBuilderProps {
  className?: string;
}

interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
}

interface ChartData {
  title: string;
  xAxisLabels: string[];
  yAxisLabels: string[];
  data: HeatmapDataPoint[];
  xAxisLabel: string;
  yAxisLabel: string;
}

/**
 * Isolated Heatmap Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const HeatmapChartBuilder: React.FC<HeatmapChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Correlation Heatmap',
    xAxisLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yAxisLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    data: [
      { x: 0, y: 0, value: 10 }, { x: 1, y: 0, value: 15 }, { x: 2, y: 0, value: 20 },
      { x: 3, y: 0, value: 25 }, { x: 4, y: 0, value: 30 }, { x: 5, y: 0, value: 8 }, { x: 6, y: 0, value: 5 },
      { x: 0, y: 1, value: 12 }, { x: 1, y: 1, value: 18 }, { x: 2, y: 1, value: 22 },
      { x: 3, y: 1, value: 28 }, { x: 4, y: 1, value: 32 }, { x: 5, y: 1, value: 10 }, { x: 6, y: 1, value: 7 },
      { x: 0, y: 2, value: 14 }, { x: 1, y: 2, value: 20 }, { x: 2, y: 2, value: 24 },
      { x: 3, y: 2, value: 30 }, { x: 4, y: 2, value: 35 }, { x: 5, y: 2, value: 12 }, { x: 6, y: 2, value: 9 },
      { x: 0, y: 3, value: 16 }, { x: 1, y: 3, value: 22 }, { x: 2, y: 3, value: 26 },
      { x: 3, y: 3, value: 32 }, { x: 4, y: 3, value: 38 }, { x: 5, y: 3, value: 14 }, { x: 6, y: 3, value: 11 },
      { x: 0, y: 4, value: 18 }, { x: 1, y: 4, value: 24 }, { x: 2, y: 4, value: 28 },
      { x: 3, y: 4, value: 34 }, { x: 4, y: 4, value: 40 }, { x: 5, y: 4, value: 16 }, { x: 6, y: 4, value: 13 }
    ],
    xAxisLabel: 'Days',
    yAxisLabel: 'Weeks'
  });

  const [chartOptions, setChartOptions] = useState({
    colorScheme: 'Blues' as 'Blues' | 'Reds' | 'Greens' | 'Purples' | 'Oranges' | 'Viridis',
    showLabels: true,
    showGrid: true,
    cellBorderWidth: 1,
    minOpacity: 0.1,
    maxOpacity: 1
  });

  const [xLabelsInput, setXLabelsInput] = useState(chartData.xAxisLabels.join(', '));
  const [yLabelsInput, setYLabelsInput] = useState(chartData.yAxisLabels.join(', '));

  // Color schemes
  const colorSchemes = {
    Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
    Viridis: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b']
  };

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const maxValue = Math.max(...chartData.data.map(d => d.value));
      const minValue = Math.min(...chartData.data.map(d => d.value));
      const colorScale = colorSchemes[chartOptions.colorScheme];

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
              const [x, y, value] = params.value;
              const xLabel = chartData.xAxisLabels[x] || `X${x}`;
              const yLabel = chartData.yAxisLabels[y] || `Y${y}`;
              return `${xLabel} × ${yLabel}<br/>Value: ${value}`;
            } catch (error) {
              return `Value: ${params.value[2]}`;
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          textStyle: {
            color: '#374151'
          }
        },
        grid: {
          left: '3%',
          right: '15%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.xAxisLabels,
          name: chartData.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 30,
          splitArea: {
            show: chartOptions.showGrid
          },
          axisLine: {
            lineStyle: {
              color: '#6B7280'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: chartData.yAxisLabels,
          name: chartData.yAxisLabel,
          nameLocation: 'middle',
          nameGap: 50,
          splitArea: {
            show: chartOptions.showGrid
          },
          axisLine: {
            lineStyle: {
              color: '#6B7280'
            }
          }
        },
        visualMap: {
          min: minValue,
          max: maxValue,
          calculable: true,
          orient: 'vertical',
          right: '5%',
          top: 'middle',
          inRange: {
            color: colorScale
          },
          textStyle: {
            color: '#374151'
          }
        },
        series: [
          {
            name: 'Heatmap',
            type: 'heatmap',
            data: chartData.data.map(point => [point.x, point.y, point.value]),
            label: {
              show: chartOptions.showLabels,
              color: '#374151',
              fontSize: 10
            },
            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: chartOptions.cellBorderWidth
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animationDuration: 1000,
            animationEasing: 'cubicOut'
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating heatmap chart option:', error);
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
  const handleXLabelsUpdate = useCallback((value: string) => {
    try {
      setXLabelsInput(value);
      const newLabels = value.split(',').map(label => label.trim()).filter(label => label);
      if (newLabels.length > 0) {
        setChartData(prev => ({ ...prev, xAxisLabels: newLabels }));
      }
    } catch (error) {
      console.error('Error updating X labels:', error);
    }
  }, []);

  const handleYLabelsUpdate = useCallback((value: string) => {
    try {
      setYLabelsInput(value);
      const newLabels = value.split(',').map(label => label.trim()).filter(label => label);
      if (newLabels.length > 0) {
        setChartData(prev => ({ ...prev, yAxisLabels: newLabels }));
      }
    } catch (error) {
      console.error('Error updating Y labels:', error);
    }
  }, []);

  const updateDataPoint = useCallback((index: number, field: 'x' | 'y' | 'value', value: string) => {
    try {
      const numValue = field === 'value' ? parseFloat(value) || 0 : parseInt(value) || 0;
      setChartData(prev => ({
        ...prev,
        data: prev.data.map((point, i) => {
          if (i === index) {
            return { ...point, [field]: numValue };
          }
          return point;
        })
      }));
    } catch (error) {
      console.error('Error updating data point:', error);
    }
  }, []);

  const addDataPoint = useCallback(() => {
    try {
      setChartData(prev => ({
        ...prev,
        data: [...prev.data, { x: 0, y: 0, value: 0 }]
      }));
    } catch (error) {
      console.error('Error adding data point:', error);
    }
  }, []);

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

  const generateRandomData = useCallback(() => {
    try {
      const newData: HeatmapDataPoint[] = [];
      for (let x = 0; x < chartData.xAxisLabels.length; x++) {
        for (let y = 0; y < chartData.yAxisLabels.length; y++) {
          newData.push({
            x,
            y,
            value: Math.floor(Math.random() * 50) + 1
          });
        }
      }
      setChartData(prev => ({ ...prev, data: newData }));
    } catch (error) {
      console.error('Error generating random data:', error);
    }
  }, [chartData.xAxisLabels.length, chartData.yAxisLabels.length]);

  // Safe export functionality
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        type: 'heatmap-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `heatmap-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, chartOptions]);

  return (
    <EChartsErrorBoundary>
      <div className="tool-container">
        <div className="tool-header">
          <h1>Heatmap Chart Builder</h1>
          <p>Create professional heatmaps to visualize data density and correlations with customizable color schemes</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem'
        }} className="chart-grid-container">
          {/* Input Section */}
          <div className="input-section">
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="chart-title" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Chart Title
              </label>
              <input
                id="chart-title"
                type="text"
                value={chartData.title}
                onChange={(e) => setChartData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter chart title"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="x-labels" style={{ display: 'block', marginBottom: '0.5rem' }}>
                X-Axis Labels (comma-separated)
              </label>
              <textarea
                id="x-labels"
                value={xLabelsInput}
                onChange={(e) => handleXLabelsUpdate(e.target.value)}
                placeholder="Mon, Tue, Wed, Thu, Fri"
                rows={2}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="y-labels" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Y-Axis Labels (comma-separated)
              </label>
              <textarea
                id="y-labels"
                value={yLabelsInput}
                onChange={(e) => handleYLabelsUpdate(e.target.value)}
                placeholder="Week 1, Week 2, Week 3"
                rows={2}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label htmlFor="x-axis-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  X-Axis Label
                </label>
                <input
                  id="x-axis-label"
                  type="text"
                  value={chartData.xAxisLabel}
                  onChange={(e) => setChartData(prev => ({ ...prev, xAxisLabel: e.target.value }))}
                  placeholder="X-axis label"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label htmlFor="y-axis-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Y-Axis Label
                </label>
                <input
                  id="y-axis-label"
                  type="text"
                  value={chartData.yAxisLabel}
                  onChange={(e) => setChartData(prev => ({ ...prev, yAxisLabel: e.target.value }))}
                  placeholder="Y-axis label"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label htmlFor="color-scheme" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Color Scheme
                </label>
                <select
                  id="color-scheme"
                  value={chartOptions.colorScheme}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    appearance: 'none'
                  }}
                >
                  <option value="Blues">Blues</option>
                  <option value="Reds">Reds</option>
                  <option value="Greens">Greens</option>
                  <option value="Purples">Purples</option>
                  <option value="Oranges">Oranges</option>
                  <option value="Viridis">Viridis</option>
                </select>
              </div>
              <div>
                <label htmlFor="border-width" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Border Width: {chartOptions.cellBorderWidth}px
                </label>
                <input
                  id="border-width"
                  type="range"
                  min="0"
                  max="5"
                  value={chartOptions.cellBorderWidth}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, cellBorderWidth: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-tertiary)'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Display Options</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.showLabels}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                  />
                  Show Value Labels
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.showGrid}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showGrid: e.target.checked }))}
                  />
                  Show Grid
                </label>
              </div>
            </div>

            {/* Data Points */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0' }}>Data Points</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={generateRandomData}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--text-muted)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Random
                  </button>
                  <button
                    onClick={addDataPoint}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--accent-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </div>
              
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {chartData.data.map((point, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'var(--bg-tertiary)'
                  }}>
                    <input
                      type="number"
                      value={point.x}
                      onChange={(e) => updateDataPoint(index, 'x', e.target.value)}
                      placeholder="X"
                      min="0"
                      style={{
                        width: '50px',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'white',
                        fontSize: '0.8rem'
                      }}
                    />
                    <input
                      type="number"
                      value={point.y}
                      onChange={(e) => updateDataPoint(index, 'y', e.target.value)}
                      placeholder="Y"
                      min="0"
                      style={{
                        width: '50px',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'white',
                        fontSize: '0.8rem'
                      }}
                    />
                    <input
                      type="number"
                      value={point.value}
                      onChange={(e) => updateDataPoint(index, 'value', e.target.value)}
                      placeholder="Value"
                      step="0.1"
                      style={{
                        width: '70px',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'white',
                        fontSize: '0.8rem',
                        flex: 1
                      }}
                    />
                    {chartData.data.length > 1 && (
                      <button
                        onClick={() => removeDataPoint(index)}
                        style={{
                          background: 'transparent',
                          color: 'var(--error-color)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={handleExport}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, var(--accent-color) 0%, #6366f1 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flex: 1
                }}
              >
                <Download size={20} />
                Export Chart
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="output-section">
            <label>Chart Preview</label>
            <div style={{
              background: 'white',
              border: '2px dashed var(--border-color)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '1.5rem',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <EChartsWrapper
                option={generateChartOption()}
                height={400}
                className="w-full"
                onError={(error) => {
                  console.error('Heatmap chart rendering error:', error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default HeatmapChartBuilder;