import React, { useState, useCallback } from 'react';
import { PieChart, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface PieChartBuilderProps {
  className?: string;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface ChartData {
  title: string;
  data: PieDataItem[];
}

/**
 * Isolated Pie Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const PieChartBuilder: React.FC<PieChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Market Share Distribution',
    data: [
      { name: 'Product A', value: 35, color: '#3B82F6' },
      { name: 'Product B', value: 28, color: '#10B981' },
      { name: 'Product C', value: 22, color: '#F59E0B' },
      { name: 'Product D', value: 15, color: '#EF4444' }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    showLabels: true,
    showLegend: true,
    showPercentage: true,
    innerRadius: 0, // 0 for pie, >0 for donut
    roseType: false // rose/nightingale chart
  });

  // Predefined colors for new items
  const defaultColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const totalValue = chartData.data.reduce((sum, item) => sum + item.value, 0);
      
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
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            try {
              const percentage = ((params.value / totalValue) * 100).toFixed(1);
              return `${params.name}<br/>${params.value} (${percentage}%)`;
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
        legend: chartOptions.showLegend ? {
          orient: 'vertical',
          right: 20,
          top: 'middle',
          textStyle: {
            color: '#374151'
          },
          data: chartData.data.map(item => item.name)
        } : undefined,
        series: [
          {
            name: chartData.title,
            type: 'pie',
            radius: chartOptions.innerRadius > 0 
              ? [`${chartOptions.innerRadius}%`, '70%'] 
              : '70%',
            center: chartOptions.showLegend ? ['40%', '50%'] : ['50%', '50%'],
            data: chartData.data.map(item => ({
              value: item.value,
              name: item.name,
              itemStyle: {
                color: item.color
              }
            })),
            roseType: chartOptions.roseType ? 'area' : undefined,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: chartOptions.showLabels ? {
              show: true,
              formatter: (params: any) => {
                try {
                  if (chartOptions.showPercentage) {
                    const percentage = ((params.value / totalValue) * 100).toFixed(1);
                    return `${params.name}\n${percentage}%`;
                  }
                  return `${params.name}\n${params.value}`;
                } catch (error) {
                  return params.name;
                }
              },
              fontSize: 12,
              color: '#374151'
            } : {
              show: false
            },
            labelLine: {
              show: chartOptions.showLabels
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: (idx: number) => idx * 100
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating pie chart option:', error);
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
  const updateDataItem = useCallback((index: number, field: keyof PieDataItem, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        data: prev.data.map((item, i) => {
          if (i === index) {
            const updatedItem = { ...item, [field]: value };
            // Ensure value is a positive number
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
      const newIndex = chartData.data.length;
      const newColor = defaultColors[newIndex % defaultColors.length];
      
      setChartData(prev => ({
        ...prev,
        data: [
          ...prev.data,
          {
            name: `Item ${newIndex + 1}`,
            value: 10,
            color: newColor
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding data item:', error);
    }
  }, [chartData.data.length]);

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

  // Safe export functionality
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        type: 'pie-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `pie-chart-${Date.now()}.json`;
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
          <h1>Pie Chart Builder</h1>
          <p>Create professional pie and donut charts with customizable data, colors, and display options</p>
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
              <label htmlFor="inner-radius" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Inner Radius: {chartOptions.innerRadius}% (0 = Pie, {'>'} 0 = Donut)
              </label>
              <input
                id="inner-radius"
                type="range"
                min="0"
                max="60"
                value={chartOptions.innerRadius}
                onChange={(e) => setChartOptions(prev => ({ ...prev, innerRadius: parseInt(e.target.value) }))}
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

            {/* Chart Options */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Display Options</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.showLabels}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                  />
                  Show Labels
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.showLegend}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showLegend: e.target.checked }))}
                  />
                  Show Legend
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.showPercentage}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showPercentage: e.target.checked }))}
                  />
                  Show Percentage
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.roseType}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, roseType: e.target.checked }))}
                  />
                  Rose Style
                </label>
              </div>
            </div>

            {/* Data Items */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0' }}>Data Items</label>
                <button
                  onClick={addDataItem}
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
                  Add Item
                </button>
              </div>
              
              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {chartData.data.map((item, index) => (
                  <div key={index} style={{ 
                    border: '2px solid var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '1rem', 
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Item {index + 1}</span>
                      {chartData.data.length > 1 && (
                        <button
                          onClick={() => removeDataItem(index)}
                          style={{
                            background: 'transparent',
                            color: 'var(--error-color)',
                            border: 'none',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateDataItem(index, 'name', e.target.value)}
                        placeholder="Item name"
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
                        type="number"
                        value={item.value}
                        onChange={(e) => updateDataItem(index, 'value', e.target.value)}
                        placeholder="Value"
                        min="0"
                        step="0.1"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '2px solid var(--border-color)',
                          background: 'var(--bg-tertiary)',
                          fontSize: '0.9rem'
                        }}
                      />
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="color"
                          value={item.color}
                          onChange={(e) => updateDataItem(index, 'color', e.target.value)}
                          style={{
                            width: '50px',
                            height: '40px',
                            border: '2px solid var(--border-color)',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {item.color}
                        </span>
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
                  console.error('Pie chart rendering error:', error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default PieChartBuilder;