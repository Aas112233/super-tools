import React, { useState, useCallback } from 'react';
import { Zap, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface ScatterPlotBuilderProps {
  className?: string;
}

interface DataPoint {
  x: number;
  y: number;
}

interface Dataset {
  name: string;
  data: DataPoint[];
  color: string;
  size: number;
}

interface ChartData {
  title: string;
  datasets: Dataset[];
  xAxisLabel: string;
  yAxisLabel: string;
}

/**
 * Isolated Scatter Plot Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const ScatterPlotBuilder: React.FC<ScatterPlotBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Correlation Analysis',
    datasets: [
      {
        name: 'Dataset 1',
        data: [
          { x: 10, y: 8 }, { x: 20, y: 7 }, { x: 30, y: 6 }, 
          { x: 40, y: 9 }, { x: 50, y: 5 }, { x: 60, y: 8 },
          { x: 70, y: 7 }, { x: 80, y: 6 }, { x: 90, y: 9 }
        ],
        color: '#3B82F6',
        size: 8
      },
      {
        name: 'Dataset 2',
        data: [
          { x: 15, y: 12 }, { x: 25, y: 11 }, { x: 35, y: 10 }, 
          { x: 45, y: 13 }, { x: 55, y: 9 }, { x: 65, y: 12 },
          { x: 75, y: 11 }, { x: 85, y: 10 }, { x: 95, y: 13 }
        ],
        color: '#10B981',
        size: 8
      }
    ],
    xAxisLabel: 'X Variable',
    yAxisLabel: 'Y Variable'
  });

  const [chartOptions, setChartOptions] = useState({
    showGrid: true,
    showTrendline: false,
    pointShape: 'circle' as 'circle' | 'diamond' | 'square' | 'triangle',
    opacity: 0.8
  });

  // Predefined colors for new datasets
  const defaultColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const symbolMap = {
        circle: 'circle',
        diamond: 'diamond',
        square: 'rect',
        triangle: 'triangle'
      };

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
              const [x, y] = params.value;
              return `${params.seriesName}<br/>X: ${x}<br/>Y: ${y}`;
            } catch (error) {
              return `${params.seriesName}: ${params.value}`;
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
          data: chartData.datasets.map(dataset => dataset.name),
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
          type: 'value',
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
        series: chartData.datasets.map(dataset => ({
          name: dataset.name,
          type: 'scatter',
          data: dataset.data.map(point => [point.x, point.y]),
          symbol: symbolMap[chartOptions.pointShape],
          symbolSize: dataset.size,
          itemStyle: {
            color: dataset.color,
            opacity: chartOptions.opacity
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          },
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        })),
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating scatter plot option:', error);
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
  const updateDataset = useCallback((datasetIndex: number, field: string, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        datasets: prev.datasets.map((dataset, i) => {
          if (i === datasetIndex) {
            return { ...dataset, [field]: value };
          }
          return dataset;
        })
      }));
    } catch (error) {
      console.error('Error updating dataset:', error);
    }
  }, []);

  const updateDataPoint = useCallback((datasetIndex: number, pointIndex: number, field: 'x' | 'y', value: string) => {
    try {
      const numValue = parseFloat(value) || 0;
      setChartData(prev => ({
        ...prev,
        datasets: prev.datasets.map((dataset, i) => {
          if (i === datasetIndex) {
            return {
              ...dataset,
              data: dataset.data.map((point, j) => {
                if (j === pointIndex) {
                  return { ...point, [field]: numValue };
                }
                return point;
              })
            };
          }
          return dataset;
        })
      }));
    } catch (error) {
      console.error('Error updating data point:', error);
    }
  }, []);

  const addDataset = useCallback(() => {
    try {
      const newIndex = chartData.datasets.length;
      const newColor = defaultColors[newIndex % defaultColors.length];
      
      setChartData(prev => ({
        ...prev,
        datasets: [
          ...prev.datasets,
          {
            name: `Dataset ${newIndex + 1}`,
            data: [{ x: 0, y: 0 }],
            color: newColor,
            size: 8
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding dataset:', error);
    }
  }, [chartData.datasets.length]);

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

  const addDataPoint = useCallback((datasetIndex: number) => {
    try {
      setChartData(prev => ({
        ...prev,
        datasets: prev.datasets.map((dataset, i) => {
          if (i === datasetIndex) {
            return {
              ...dataset,
              data: [...dataset.data, { x: 0, y: 0 }]
            };
          }
          return dataset;
        })
      }));
    } catch (error) {
      console.error('Error adding data point:', error);
    }
  }, []);

  const removeDataPoint = useCallback((datasetIndex: number, pointIndex: number) => {
    try {
      setChartData(prev => ({
        ...prev,
        datasets: prev.datasets.map((dataset, i) => {
          if (i === datasetIndex && dataset.data.length > 1) {
            return {
              ...dataset,
              data: dataset.data.filter((_, j) => j !== pointIndex)
            };
          }
          return dataset;
        })
      }));
    } catch (error) {
      console.error('Error removing data point:', error);
    }
  }, []);

  // Safe export functionality
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        type: 'scatter-plot',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `scatter-plot-${Date.now()}.json`;
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
          <h1>Scatter Plot Builder</h1>
          <p>Create professional scatter plots to analyze correlations between variables with customizable data points and styling</p>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label htmlFor="x-axis" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  X-Axis Label
                </label>
                <input
                  id="x-axis"
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
                <label htmlFor="y-axis" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Y-Axis Label
                </label>
                <input
                  id="y-axis"
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
                <label htmlFor="point-shape" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Point Shape
                </label>
                <select
                  id="point-shape"
                  value={chartOptions.pointShape}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, pointShape: e.target.value as any }))}
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
                  <option value="circle">Circle</option>
                  <option value="diamond">Diamond</option>
                  <option value="square">Square</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>
              <div>
                <label htmlFor="opacity" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Opacity: {Math.round(chartOptions.opacity * 100)}%
                </label>
                <input
                  id="opacity"
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={chartOptions.opacity}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={chartOptions.showGrid}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, showGrid: e.target.checked }))}
                />
                Show Grid Lines
              </label>
            </div>

            {/* Datasets */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0' }}>Datasets</label>
                <button
                  onClick={addDataset}
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
                  Add Dataset
                </button>
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {chartData.datasets.map((dataset, datasetIndex) => (
                  <div key={datasetIndex} style={{ 
                    border: '2px solid var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '1rem', 
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <input
                        type="text"
                        value={dataset.name}
                        onChange={(e) => updateDataset(datasetIndex, 'name', e.target.value)}
                        placeholder="Dataset name"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          flex: 1
                        }}
                      />
                      {chartData.datasets.length > 1 && (
                        <button
                          onClick={() => removeDataset(datasetIndex)}
                          style={{
                            background: 'transparent',
                            color: 'var(--error-color)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="color"
                          value={dataset.color}
                          onChange={(e) => updateDataset(datasetIndex, 'color', e.target.value)}
                          style={{
                            width: '40px',
                            height: '30px',
                            border: '2px solid var(--border-color)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Color</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        <input
                          type="range"
                          min="4"
                          max="20"
                          value={dataset.size}
                          onChange={(e) => updateDataset(datasetIndex, 'size', parseInt(e.target.value))}
                          style={{ flex: 1 }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '40px' }}>
                          {dataset.size}px
                        </span>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Data Points</span>
                        <button
                          onClick={() => addDataPoint(datasetIndex)}
                          style={{
                            background: 'transparent',
                            color: 'var(--accent-color)',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'grid', gap: '0.5rem' }}>
                        {dataset.data.map((point, pointIndex) => (
                          <div key={pointIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="number"
                              value={point.x}
                              onChange={(e) => updateDataPoint(datasetIndex, pointIndex, 'x', e.target.value)}
                              placeholder="X"
                              step="0.1"
                              style={{
                                width: '60px',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-tertiary)',
                                fontSize: '0.8rem'
                              }}
                            />
                            <input
                              type="number"
                              value={point.y}
                              onChange={(e) => updateDataPoint(datasetIndex, pointIndex, 'y', e.target.value)}
                              placeholder="Y"
                              step="0.1"
                              style={{
                                width: '60px',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-tertiary)',
                                fontSize: '0.8rem'
                              }}
                            />
                            {dataset.data.length > 1 && (
                              <button
                                onClick={() => removeDataPoint(datasetIndex, pointIndex)}
                                style={{
                                  background: 'transparent',
                                  color: 'var(--error-color)',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
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
                  console.error('Scatter plot rendering error:', error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default ScatterPlotBuilder;