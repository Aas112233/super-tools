import React, { useState, useCallback } from 'react';
import { Radar, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface RadarChartBuilderProps {
  className?: string;
}

interface RadarIndicator {
  name: string;
  max: number;
  min?: number;
}

interface RadarDataset {
  name: string;
  data: number[];
  color: string;
  areaStyle?: boolean;
}

interface ChartData {
  title: string;
  indicators: RadarIndicator[];
  datasets: RadarDataset[];
}

/**
 * Isolated Radar Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const RadarChartBuilder: React.FC<RadarChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Multi-Dimensional Analysis',
    indicators: [
      { name: 'Sales', max: 100, min: 0 },
      { name: 'Marketing', max: 100, min: 0 },
      { name: 'Development', max: 100, min: 0 },
      { name: 'Customer Support', max: 100, min: 0 },
      { name: 'Administration', max: 100, min: 0 },
      { name: 'Technology', max: 100, min: 0 }
    ],
    datasets: [
      {
        name: 'Current Performance',
        data: [85, 70, 90, 60, 75, 88],
        color: '#3B82F6',
        areaStyle: true
      },
      {
        name: 'Target Performance',
        data: [90, 85, 95, 80, 85, 95],
        color: '#10B981',
        areaStyle: false
      }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    showGrid: true,
    shape: 'polygon' as 'polygon' | 'circle',
    splitNumber: 5,
    centerX: 50,
    centerY: 50,
    radius: 70
  });

  // Predefined colors for new datasets
  const defaultColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

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
          trigger: 'item',
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
        radar: {
          indicator: chartData.indicators.map(indicator => ({
            name: indicator.name,
            max: indicator.max,
            min: indicator.min || 0
          })),
          shape: chartOptions.shape,
          splitNumber: chartOptions.splitNumber,
          center: [`${chartOptions.centerX}%`, `${chartOptions.centerY}%`],
          radius: `${chartOptions.radius}%`,
          splitArea: {
            show: chartOptions.showGrid,
            areaStyle: {
              color: [
                'rgba(59, 130, 246, 0.05)',
                'rgba(59, 130, 246, 0.1)',
                'rgba(59, 130, 246, 0.05)',
                'rgba(59, 130, 246, 0.1)',
                'rgba(59, 130, 246, 0.05)'
              ]
            }
          },
          splitLine: {
            show: chartOptions.showGrid,
            lineStyle: {
              color: '#E5E7EB',
              width: 1
            }
          },
          axisLine: {
            show: chartOptions.showGrid,
            lineStyle: {
              color: '#9CA3AF'
            }
          }
        },
        series: [
          {
            name: 'Performance Comparison',
            type: 'radar',
            data: chartData.datasets.map(dataset => ({
              value: dataset.data,
              name: dataset.name,
              itemStyle: {
                color: dataset.color
              },
              lineStyle: {
                color: dataset.color,
                width: 2
              },
              areaStyle: dataset.areaStyle ? {
                color: dataset.color + '20'
              } : undefined,
              emphasis: {
                lineStyle: {
                  width: 3
                },
                areaStyle: dataset.areaStyle ? {
                  color: dataset.color + '40'
                } : undefined
              }
            })),
            animationDuration: 1000,
            animationEasing: 'cubicOut'
          }
        ],
        backgroundColor: '#FEFEFE'
      };
    } catch (error) {
      console.error('Error generating radar chart option:', error);
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
  const updateIndicator = useCallback((index: number, field: keyof RadarIndicator, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        indicators: prev.indicators.map((indicator, i) => {
          if (i === index) {
            const updatedIndicator = { ...indicator, [field]: value };
            if (field === 'max' || field === 'min') {
              updatedIndicator[field] = Math.max(0, parseFloat(value) || 0);
            }
            return updatedIndicator;
          }
          return indicator;
        })
      }));
    } catch (error) {
      console.error('Error updating indicator:', error);
    }
  }, []);

  const addIndicator = useCallback(() => {
    try {
      setChartData(prev => ({
        ...prev,
        indicators: [
          ...prev.indicators,
          { name: `Indicator ${prev.indicators.length + 1}`, max: 100, min: 0 }
        ],
        datasets: prev.datasets.map(dataset => ({
          ...dataset,
          data: [...dataset.data, 50] // Add default value for new indicator
        }))
      }));
    } catch (error) {
      console.error('Error adding indicator:', error);
    }
  }, []);

  const removeIndicator = useCallback((index: number) => {
    try {
      if (chartData.indicators.length > 3) {
        setChartData(prev => ({
          ...prev,
          indicators: prev.indicators.filter((_, i) => i !== index),
          datasets: prev.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.filter((_, i) => i !== index)
          }))
        }));
      }
    } catch (error) {
      console.error('Error removing indicator:', error);
    }
  }, [chartData.indicators.length]);

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

  const updateDatasetValue = useCallback((datasetIndex: number, valueIndex: number, value: string) => {
    try {
      const numValue = parseFloat(value) || 0;
      setChartData(prev => ({
        ...prev,
        datasets: prev.datasets.map((dataset, i) => {
          if (i === datasetIndex) {
            return {
              ...dataset,
              data: dataset.data.map((val, j) => j === valueIndex ? numValue : val)
            };
          }
          return dataset;
        })
      }));
    } catch (error) {
      console.error('Error updating dataset value:', error);
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
            data: new Array(prev.indicators.length).fill(50),
            color: newColor,
            areaStyle: false
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding dataset:', error);
    }
  }, [chartData.datasets.length, chartData.indicators.length]);

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
        type: 'radar-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `radar-chart-${Date.now()}.json`;
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
          <h1>Radar Chart Builder</h1>
          <p>Create professional radar charts for multi-dimensional data analysis with customizable indicators and datasets</p>
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
                <label htmlFor="radar-shape" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Radar Shape
                </label>
                <select
                  id="radar-shape"
                  value={chartOptions.shape}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, shape: e.target.value as any }))}
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
                  <option value="polygon">Polygon</option>
                  <option value="circle">Circle</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', paddingTop: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={chartOptions.showGrid}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, showGrid: e.target.checked }))}
                  />
                  Show Grid Lines
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label htmlFor="split-number" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Split Number: {chartOptions.splitNumber}
                </label>
                <input
                  id="split-number"
                  type="range"
                  min="3"
                  max="10"
                  value={chartOptions.splitNumber}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, splitNumber: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-tertiary)'
                  }}
                />
              </div>
              <div>
                <label htmlFor="radius" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Radius: {chartOptions.radius}%
                </label>
                <input
                  id="radius"
                  type="range"
                  min="30"
                  max="90"
                  value={chartOptions.radius}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
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

            {/* Indicators */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0' }}>Indicators</label>
                <button
                  onClick={addIndicator}
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
                  Add Indicator
                </button>
              </div>
              
              <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {chartData.indicators.map((indicator, index) => (
                  <div key={index} style={{ 
                    border: '2px solid var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '1rem', 
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Indicator {index + 1}</span>
                      {chartData.indicators.length > 3 && (
                        <button
                          onClick={() => removeIndicator(index)}
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
                    
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={indicator.name}
                        onChange={(e) => updateIndicator(index, 'name', e.target.value)}
                        placeholder="Indicator name"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '2px solid var(--border-color)',
                          background: 'var(--bg-tertiary)',
                          fontSize: '0.9rem'
                        }}
                      />
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                          type="number"
                          value={indicator.min || 0}
                          onChange={(e) => updateIndicator(index, 'min', e.target.value)}
                          placeholder="Min"
                          min="0"
                          style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color)',
                            background: 'var(--bg-tertiary)',
                            fontSize: '0.9rem'
                          }}
                        />
                        <input
                          type="number"
                          value={indicator.max}
                          onChange={(e) => updateIndicator(index, 'max', e.target.value)}
                          placeholder="Max"
                          min="1"
                          style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '2px solid var(--border-color)',
                            background: 'var(--bg-tertiary)',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
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
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <input
                          type="checkbox"
                          checked={dataset.areaStyle}
                          onChange={(e) => updateDataset(datasetIndex, 'areaStyle', e.target.checked)}
                        />
                        Area Fill
                      </label>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Data Values</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto' }}>
                        {dataset.data.map((value, valueIndex) => (
                          <div key={valueIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {chartData.indicators[valueIndex]?.name}:
                            </span>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => updateDatasetValue(datasetIndex, valueIndex, e.target.value)}
                              min="0"
                              step="0.1"
                              style={{
                                width: '60px',
                                padding: '0.25rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-tertiary)',
                                fontSize: '0.8rem'
                              }}
                            />
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
                  console.error('Radar chart rendering error:', error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default RadarChartBuilder;