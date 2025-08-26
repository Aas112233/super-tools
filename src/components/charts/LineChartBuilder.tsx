import React, { useState, useCallback } from 'react';
import { TrendingUp, Download, Settings } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface LineChartBuilderProps {
  className?: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    name: string;
    values: number[];
    color: string;
  }[];
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
}

/**
 * Isolated Line Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const LineChartBuilder: React.FC<LineChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        name: 'Sales',
        values: [120, 200, 150, 80, 70, 110],
        color: '#3B82F6'
      },
      {
        name: 'Revenue',
        values: [100, 180, 130, 90, 85, 125],
        color: '#10B981'
      }
    ],
    title: 'Sales & Revenue Trends',
    xAxisLabel: 'Months',
    yAxisLabel: 'Amount (in thousands)'
  });

  const [chartOptions, setChartOptions] = useState({
    smooth: true,
    showArea: false,
    showPoints: true,
    gridLines: true
  });

  const [labelsInput, setLabelsInput] = useState(chartData.labels.join(', '));

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
          trigger: 'axis',
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
          show: chartOptions.gridLines,
          borderColor: '#E5E7EB'
        },
        xAxis: {
          type: 'category',
          data: chartData.labels,
          name: chartData.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 30,
          axisLine: {
            lineStyle: {
              color: '#6B7280'
            }
          },
          axisTick: {
            alignWithLabel: true
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
            show: chartOptions.gridLines,
            lineStyle: {
              color: '#E5E7EB',
              type: 'dashed'
            }
          }
        },
        series: chartData.datasets.map(dataset => ({
          name: dataset.name,
          type: 'line',
          data: dataset.values,
          smooth: chartOptions.smooth,
          symbol: chartOptions.showPoints ? 'circle' : 'none',
          symbolSize: 6,
          lineStyle: {
            color: dataset.color,
            width: 3
          },
          itemStyle: {
            color: dataset.color
          },
          areaStyle: chartOptions.showArea ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: dataset.color + '40'
                },
                {
                  offset: 1,
                  color: dataset.color + '10'
                }
              ]
            }
          } : undefined,
          emphasis: {
            focus: 'series',
            lineStyle: {
              width: 4
            }
          },
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        })),
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating line chart option:', error);
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
  const handleLabelsUpdate = useCallback((value: string) => {
    try {
      setLabelsInput(value);
      const newLabels = value.split(',').map(label => label.trim()).filter(label => label);
      if (newLabels.length > 0) {
        setChartData(prev => ({ ...prev, labels: newLabels }));
      }
    } catch (error) {
      console.error('Error updating labels:', error);
    }
  }, []);

  const handleDatasetUpdate = useCallback((index: number, field: string, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        datasets: prev.datasets.map((dataset, i) => {
          if (i === index) {
            if (field === 'values' && typeof value === 'string') {
              const newValues = value.split(',')
                .map((val: string) => parseFloat(val.trim()))
                .filter((val: number) => !isNaN(val));
              return { ...dataset, values: newValues };
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
      const colors = ['#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];
      const newColor = colors[chartData.datasets.length % colors.length];
      
      setChartData(prev => ({
        ...prev,
        datasets: [
          ...prev.datasets,
          {
            name: `Dataset ${prev.datasets.length + 1}`,
            values: new Array(prev.labels.length).fill(0),
            color: newColor
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

  // Safe export functionality
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        type: 'line-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `line-chart-${Date.now()}.json`;
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
          <h1>Line Chart Builder</h1>
          <p>Create professional line charts with multiple data series, customizable colors, and smooth animations</p>
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
              <label htmlFor="chart-labels" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Categories (comma-separated)
              </label>
              <input
                id="chart-labels"
                type="text"
                value={labelsInput}
                onChange={(e) => handleLabelsUpdate(e.target.value)}
                placeholder="Jan, Feb, Mar, Apr, May"
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

            {/* Chart Options */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Chart Options</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.smooth}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, smooth: e.target.checked }))}
                  />
                  Smooth Lines
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.showArea}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showArea: e.target.checked }))}
                  />
                  Show Area
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.showPoints}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showPoints: e.target.checked }))}
                  />
                  Show Points
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.gridLines}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, gridLines: e.target.checked }))}
                  />
                  Grid Lines
                </label>
              </div>
            </div>

            {/* Datasets */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0' }}>Data Series</label>
                <button
                  onClick={addDataset}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--accent-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Add Series
                </button>
              </div>
              
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {chartData.datasets.map((dataset, index) => (
                  <div key={index} style={{ 
                    border: '2px solid var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '1rem', 
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Series {index + 1}</span>
                      {chartData.datasets.length > 1 && (
                        <button
                          onClick={() => removeDataset(index)}
                          style={{
                            background: 'transparent',
                            color: 'var(--error-color)',
                            border: 'none',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={dataset.name}
                        onChange={(e) => handleDatasetUpdate(index, 'name', e.target.value)}
                        placeholder="Series name"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '2px solid var(--border-color)',
                          background: 'var(--bg-tertiary)',
                          fontSize: '0.9rem'
                        }}
                      />
                      
                      <input
                        type="text"
                        value={dataset.values.join(', ')}
                        onChange={(e) => handleDatasetUpdate(index, 'values', e.target.value)}
                        placeholder="Values (comma separated)"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '2px solid var(--border-color)',
                          background: 'var(--bg-tertiary)',
                          fontSize: '0.9rem'
                        }}
                      />
                      
                      <input
                        type="color"
                        value={dataset.color}
                        onChange={(e) => handleDatasetUpdate(index, 'color', e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          border: '2px solid var(--border-color)',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      />
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
                  console.error('Line chart rendering error:', error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default LineChartBuilder;