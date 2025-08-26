import React, { useState, useCallback } from 'react';
import { BarChart3, Download, Copy, Settings } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface BarChartBuilderProps {
  className?: string;
}

interface ChartData {
  labels: string[];
  values: number[];
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
}

/**
 * Isolated Bar Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const BarChartBuilder: React.FC<BarChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [120, 200, 150, 80, 70, 110],
    title: 'Monthly Sales Data',
    xAxisLabel: 'Months',
    yAxisLabel: 'Sales (in thousands)'
  });

  const [colors, setColors] = useState({
    primary: '#3B82F6',
    background: '#F8FAFC',
    text: '#1E293B'
  });

  const [labelsInput, setLabelsInput] = useState(chartData.labels.join(', '));
  const [valuesInput, setValuesInput] = useState(chartData.values.join(', '));

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      return {
        title: {
          text: chartData.title,
          left: 'center',
          textStyle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: colors.primary,
          borderWidth: 1,
          textStyle: {
            color: colors.text
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.labels,
          name: chartData.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 30,
          axisLine: {
            lineStyle: {
              color: colors.text
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
              color: colors.text
            }
          }
        },
        series: [
          {
            name: chartData.yAxisLabel,
            type: 'bar',
            data: chartData.values,
            itemStyle: {
              color: colors.primary,
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                color: '#2563EB'
              }
            },
            animationDuration: 1000,
            animationEasing: 'cubicOut'
          }
        ],
        backgroundColor: colors.background
      };
    } catch (error) {
      console.error('Error generating chart option:', error);
      // Return a safe fallback option
      return {
        title: {
          text: 'Chart Error',
          left: 'center'
        },
        series: []
      };
    }
  }, [chartData, colors]);

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

  const handleValuesUpdate = useCallback((value: string) => {
    try {
      setValuesInput(value);
      const newValues = value.split(',')
        .map(val => parseFloat(val.trim()))
        .filter(val => !isNaN(val));
      if (newValues.length > 0) {
        setChartData(prev => ({ ...prev, values: newValues }));
      }
    } catch (error) {
      console.error('Error updating values:', error);
    }
  }, []);

  // Safe export functionality
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        type: 'bar-chart',
        data: chartData,
        colors: colors,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `bar-chart-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Export failed. Please try again.');
    }
  }, [chartData, colors]);

  return (
    <EChartsErrorBoundary>
      <div className="tool-container">
        <div className="tool-header">
          <h1>Bar Chart Builder</h1>
          <p>Create professional bar charts with customizable data, colors, and labels</p>
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="chart-values" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Values (comma-separated)
              </label>
              <input
                id="chart-values"
                type="text"
                value={valuesInput}
                onChange={(e) => handleValuesUpdate(e.target.value)}
                placeholder="120, 200, 150, 80, 70"
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="bar-color" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Bar Color
              </label>
              <input
                id="bar-color"
                type="color"
                value={colors.primary}
                onChange={(e) => setColors(prev => ({ ...prev, primary: e.target.value }))}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  background: 'var(--bg-tertiary)',
                  cursor: 'pointer'
                }}
              />
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
                  gap: '0.5rem'
                }}
              >
                <Download size={20} />
                Export Chart
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="output-section">
            <label>Chart Preview</label>
            <div style={{
              padding: '1rem',
              background: 'white',
              border: '2px dashed var(--border-color)',
              borderRadius: '16px',
              minHeight: '400px'
            }}>
              <EChartsWrapper
                option={generateChartOption()}
                height={350}
                className="w-full"
                onError={(error) => {
                  console.error('Bar chart rendering error:', error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default BarChartBuilder;