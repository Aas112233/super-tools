import React, { useState, useCallback } from 'react';
import { Calendar, Download, Settings, Plus, Trash2 } from 'lucide-react';
import { EChartsOption } from 'echarts';
import EChartsWrapper from './EChartsWrapper';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface CalendarChartBuilderProps {
  className?: string;
}

interface CalendarDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface ChartData {
  title: string;
  data: CalendarDataPoint[];
  year: number;
  metric: string;
}

/**
 * Isolated Calendar Chart Builder Component
 * Completely safe implementation that won't affect other parts of the application
 */
const CalendarChartBuilder: React.FC<CalendarChartBuilderProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Daily Activity Calendar',
    year: 2024,
    metric: 'Steps',
    data: [
      { date: '2024-01-01', value: 8500, label: 'New Year' },
      { date: '2024-01-15', value: 12000, label: 'High Activity' },
      { date: '2024-02-14', value: 6000, label: 'Valentine\'s Day' },
      { date: '2024-03-01', value: 9500 },
      { date: '2024-03-15', value: 11000 },
      { date: '2024-04-01', value: 7500 },
      { date: '2024-04-15', value: 10500 },
      { date: '2024-05-01', value: 8000 },
      { date: '2024-05-15', value: 9000 },
      { date: '2024-06-01', value: 11500 },
      { date: '2024-06-15', value: 10000 },
      { date: '2024-07-04', value: 13000, label: 'Independence Day' },
      { date: '2024-08-01', value: 9500 },
      { date: '2024-09-01', value: 8500 },
      { date: '2024-10-31', value: 7000, label: 'Halloween' },
      { date: '2024-11-01', value: 8000 },
      { date: '2024-12-25', value: 5000, label: 'Christmas' }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    colorScheme: 'viridis' as 'viridis' | 'blues' | 'reds' | 'greens' | 'custom',
    cellSize: 'auto' as 'auto' | 'small' | 'medium' | 'large',
    showLabels: false,
    showSplitLine: true,
    orientation: 'horizontal' as 'horizontal' | 'vertical',
    monthLabelPosition: 'start' as 'start' | 'end',
    dayLabelPosition: 'start' as 'start' | 'end'
  });

  // Color schemes
  const colorSchemes = {
    viridis: ['#440154', '#31688e', '#35b779', '#fde725'],
    blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'],
    reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
    greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#005a32'],
    custom: ['#E8F4FD', '#B3D9F7', '#7FB8E3', '#4A96CF', '#1E74B0', '#165288', '#0E3A5F']
  };

  // Cell size mapping
  const cellSizes = {
    auto: 'auto' as const,
    small: [15, 15] as [number, number],
    medium: [20, 20] as [number, number],
    large: [25, 25] as [number, number]
  };

  // Generate ECharts option safely
  const generateChartOption = useCallback((): EChartsOption => {
    try {
      const colors = colorSchemes[chartOptions.colorScheme];
      const cellSize = cellSizes[chartOptions.cellSize];
      
      // Process data for calendar format
      const calendarData = chartData.data.map(item => [item.date, item.value]);
      
      // Calculate value range for color mapping
      const values = chartData.data.map(item => item.value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      return {
        title: {
          text: chartData.title,
          subtext: `${chartData.metric} - ${chartData.year}`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1E293B'
          },
          subtextStyle: {
            color: '#64748B',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            try {
              const date = new Date(params.value[0]);
              const value = params.value[1];
              const dataPoint = chartData.data.find(d => d.date === params.value[0]);
              const label = dataPoint?.label;
              
              const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              
              return `
                <div style="text-align: left;">
                  <strong>${formattedDate}</strong><br/>
                  ${chartData.metric}: ${value.toLocaleString()}
                  ${label ? `<br/><em>${label}</em>` : ''}
                </div>
              `;
            } catch (error) {
              return `${params.value[0]}: ${params.value[1]}`;
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          textStyle: {
            color: '#374151'
          }
        },
        visualMap: {
          min: minValue,
          max: maxValue,
          type: 'continuous',
          orient: 'horizontal',
          left: 'center',
          bottom: '10%',
          inRange: {
            color: colors
          },
          textStyle: {
            color: '#374151'
          }
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: cellSize,
          range: chartData.year.toString(),
          splitLine: {
            show: chartOptions.showSplitLine,
            lineStyle: {
              color: '#E5E7EB',
              width: 1,
              type: 'solid'
            }
          },
          yearLabel: {
            show: true,
            fontSize: 16,
            color: '#374151'
          },
          monthLabel: {
            show: true,
            fontSize: 12,
            color: '#6B7280',
            position: chartOptions.monthLabelPosition
          },
          dayLabel: {
            show: true,
            fontSize: 10,
            color: '#9CA3AF',
            position: chartOptions.dayLabelPosition,
            nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#ffffff'
          },
          orient: chartOptions.orientation
        },
        series: [
          {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: calendarData,
            label: {
              show: chartOptions.showLabels,
              fontSize: 8,
              color: '#374151'
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
      console.error('Error generating calendar chart option:', error);
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
  const updateDataPoint = useCallback((index: number, field: keyof CalendarDataPoint, value: any) => {
    try {
      setChartData(prev => ({
        ...prev,
        data: prev.data.map((item, i) => {
          if (i === index) {
            const updatedItem = { ...item, [field]: value };
            if (field === 'value') {
              updatedItem.value = Math.max(0, parseFloat(value) || 0);
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
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      setChartData(prev => ({
        ...prev,
        data: [
          ...prev.data,
          {
            date: dateStr,
            value: Math.floor(Math.random() * 10000) + 1000
          }
        ]
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

  const generateSampleData = useCallback((type: 'activity' | 'commits' | 'sales') => {
    try {
      const sampleData = {
        activity: {
          title: 'Daily Steps Calendar',
          metric: 'Steps',
          data: Array.from({ length: 50 }, (_, i) => {
            const date = new Date(chartData.year, 0, 1);
            date.setDate(date.getDate() + i * 7 + Math.floor(Math.random() * 7));
            return {
              date: date.toISOString().split('T')[0],
              value: Math.floor(Math.random() * 8000) + 3000
            };
          })
        },
        commits: {
          title: 'Git Commits Calendar',
          metric: 'Commits',
          data: Array.from({ length: 100 }, (_, i) => {
            const date = new Date(chartData.year, 0, 1);
            date.setDate(date.getDate() + i * 3 + Math.floor(Math.random() * 4));
            return {
              date: date.toISOString().split('T')[0],
              value: Math.floor(Math.random() * 20) + 1
            };
          })
        },
        sales: {
          title: 'Daily Sales Calendar',
          metric: 'Revenue ($)',
          data: Array.from({ length: 80 }, (_, i) => {
            const date = new Date(chartData.year, 0, 1);
            date.setDate(date.getDate() + i * 4 + Math.floor(Math.random() * 5));
            return {
              date: date.toISOString().split('T')[0],
              value: Math.floor(Math.random() * 50000) + 10000
            };
          })
        }
      };
      
      setChartData(prev => ({ ...prev, ...sampleData[type] }));
    } catch (error) {
      console.error('Error generating sample data:', error);
    }
  }, [chartData.year]);

  // Safe export functionality
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        type: 'calendar-chart',
        data: chartData,
        options: chartOptions,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `calendar-chart-${Date.now()}.json`;
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
          <h1>Calendar Chart Builder</h1>
          <p>Time-series data visualization in calendar format with color-coded daily values</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem'
        }}>
          {/* Input Section */}
          <div className="input-section">
            <div style={{
              background: 'white',
              border: '2px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 1rem 0'
              }}>Chart Settings</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Chart Title</label>
                <input
                  type="text"
                  value={chartData.title}
                  onChange={(e) => setChartData(prev => ({ ...prev, title: e.target.value }))}
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
                  placeholder="Enter chart title"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Metric Name</label>
                  <input
                    type="text"
                    value={chartData.metric}
                    onChange={(e) => setChartData(prev => ({ ...prev, metric: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                    placeholder="e.g., Steps, Commits"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Year</label>
                  <input
                    type="number"
                    value={chartData.year}
                    onChange={(e) => setChartData(prev => ({ ...prev, year: parseInt(e.target.value) || 2024 }))}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Color Scheme</label>
                  <select
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
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="viridis">Viridis</option>
                    <option value="blues">Blues</option>
                    <option value="reds">Reds</option>
                    <option value="greens">Greens</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cell Size</label>
                  <select
                    value={chartOptions.cellSize}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, cellSize: e.target.value as any }))}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="auto">Auto</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Orientation</label>
                <select
                  value={chartOptions.orientation}
                  onChange={(e) => setChartOptions(prev => ({ ...prev, orientation: e.target.value as any }))}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Month Label Position</label>
                  <select
                    value={chartOptions.monthLabelPosition}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, monthLabelPosition: e.target.value as any }))}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Day Label Position</label>
                  <select
                    value={chartOptions.dayLabelPosition}
                    onChange={(e) => setChartOptions(prev => ({ ...prev, dayLabelPosition: e.target.value as any }))}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 1rem 0'
                }}>Display Options</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <input
                      type="checkbox"
                      checked={chartOptions.showLabels}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showLabels: e.target.checked }))}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--accent-color)',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}>Show Cell Labels</span>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <input
                      type="checkbox"
                      checked={chartOptions.showSplitLine}
                      onChange={(e) => setChartOptions(prev => ({ ...prev, showSplitLine: e.target.checked }))}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--accent-color)',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}>Show Grid Lines</span>
                  </label>
                </div>
              </div>

              <div style={{
                background: 'white',
                border: '2px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 1rem 0'
                }}>Monthly Data Entry</h4>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((month, monthIndex) => {
                    const monthNumber = monthIndex + 1;
                    const monthData = chartData.data.filter(item => {
                      const date = new Date(item.date);
                      return date.getFullYear() === chartData.year && date.getMonth() === monthIndex;
                    });
                    const monthTotal = monthData.reduce((sum, item) => sum + item.value, 0);
                    
                    return (
                      <div key={month} style={{
                        padding: '0.75rem',
                        background: 'var(--bg-tertiary)',
                        border: '2px solid var(--border-color)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease'
                      }}>
                        <label style={{
                          display: 'block',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          marginBottom: '0.5rem'
                        }}>
                          {month.slice(0, 3)}
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          step="1"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            fontSize: '0.85rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            background: 'white',
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            transition: 'all 0.3s ease'
                          }}
                          value={monthTotal || ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            // Add a data point for the 15th of the month
                            const dateStr = `${chartData.year}-${monthNumber.toString().padStart(2, '0')}-15`;
                            
                            setChartData(prev => {
                              // Remove existing data for this month
                              const filteredData = prev.data.filter(item => {
                                const date = new Date(item.date);
                                return !(date.getFullYear() === chartData.year && date.getMonth() === monthIndex);
                              });
                              
                              // Add new data point if value > 0
                              if (value > 0) {
                                filteredData.push({
                                  date: dateStr,
                                  value: value,
                                  label: `${month} Total`
                                });
                              }
                              
                              return {
                                ...prev,
                                data: filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              };
                            });
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.25rem',
                          textAlign: 'center'
                        }}>
                          {monthData.length} days
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  flexWrap: 'wrap',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => {
                      // Generate random monthly data
                      const newData: CalendarDataPoint[] = [];
                      for (let month = 0; month < 12; month++) {
                        const value = Math.floor(Math.random() * 5000) + 1000;
                        const dateStr = `${chartData.year}-${(month + 1).toString().padStart(2, '0')}-15`;
                        newData.push({
                          date: dateStr,
                          value: value,
                          label: `Month ${month + 1} Data`
                        });
                      }
                      setChartData(prev => ({ ...prev, data: newData }));
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--accent-light)',
                      color: 'var(--accent-color)',
                      border: '2px solid var(--accent-color)',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-color)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--accent-light)';
                      e.currentTarget.style.color = 'var(--accent-color)';
                    }}
                  >
                    Generate Random Data
                  </button>
                  
                  <button
                    onClick={() => {
                      // Clear all monthly data
                      setChartData(prev => ({ ...prev, data: [] }));
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--error-light)',
                      color: 'var(--error-color)',
                      border: '2px solid var(--error-color)',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--error-color)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--error-light)';
                      e.currentTarget.style.color = 'var(--error-color)';
                    }}
                  >
                    Clear All Data
                  </button>
                </div>
              </div>

              <div style={{
                background: 'white',
                border: '2px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 1rem 0'
                }}>Quick Templates</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                  <button
                    onClick={() => generateSampleData('activity')}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--accent-light)',
                      color: 'var(--accent-color)',
                      border: '2px solid var(--accent-color)',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-color)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--accent-light)';
                      e.currentTarget.style.color = 'var(--accent-color)';
                    }}
                  >
                    Daily Activity Template
                  </button>
                  <button
                    onClick={() => generateSampleData('commits')}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--success-light)',
                      color: 'var(--success-color)',
                      border: '2px solid var(--success-color)',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--success-color)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--success-light)';
                      e.currentTarget.style.color = 'var(--success-color)';
                    }}
                  >
                    Git Commits Template
                  </button>
                  <button
                    onClick={() => generateSampleData('sales')}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--warning-light)',
                      color: 'var(--warning-color)',
                      border: '2px solid var(--warning-color)',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--warning-color)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--warning-light)';
                      e.currentTarget.style.color = 'var(--warning-color)';
                    }}
                  >
                    Daily Sales Template
                  </button>
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
                    gap: '0.5rem'
                  }}
                >
                  <Download size={20} />
                  Export Chart
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="output-section">
            <label>Calendar Preview</label>
            <div style={{
              padding: '1rem',
              background: 'white',
              border: '2px dashed var(--border-color)',
              borderRadius: '16px',
              minHeight: '500px'
            }}>
              <EChartsWrapper
                option={generateChartOption()}
                height={450}
                className="w-full"
                onError={(error) => {
                  console.error('Calendar chart rendering error:', error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default CalendarChartBuilder;