import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, PieChart, Zap, AlertCircle, ChevronRight, Grid3x3, Radar, Map, Gauge, TreePine, Share, Target, Calendar, Globe, Layers, BarChart3, LineChart, Activity, Database, Search } from 'lucide-react';
import EChartsErrorBoundary from '../../components/charts/EChartsErrorBoundary';
import BarChartBuilder from '../../components/charts/BarChartBuilder';
import LineChartBuilder from '../../components/charts/LineChartBuilder';
import PieChartBuilder from '../../components/charts/PieChartBuilder';
import ScatterPlotBuilder from '../../components/charts/ScatterPlotBuilder';
import RadarChartBuilder from '../../components/charts/RadarChartBuilder';
import HeatmapChartBuilder from '../../components/charts/HeatmapChartBuilder';
import GaugeChartBuilder from '../../components/charts/GaugeChartBuilder';
import FunnelChartBuilder from '../../components/charts/FunnelChartBuilder';
import SankeyChartBuilder from '../../components/charts/SankeyChartBuilder';
import CandlestickChartBuilder from '../../components/charts/CandlestickChartBuilder';
import CalendarChartBuilder from '../../components/charts/CalendarChartBuilder';
import BoxplotChartBuilder from '../../components/charts/BoxplotChartBuilder';
import TreeChartBuilder from '../../components/charts/TreeChartBuilder';
import TreemapChartBuilder from '../../components/charts/TreemapChartBuilder';
import SunburstChartBuilder from '../../components/charts/SunburstChartBuilder';
import ParallelChartBuilder from '../../components/charts/ParallelChartBuilder';
import GraphChartBuilder from '../../components/charts/GraphChartBuilder';
import PictorialBarChartBuilder from '../../components/charts/PictorialBarChartBuilder';
import DatasetManager from '../../components/charts/DatasetManager';

/**
 * ECharts Integration Component - Completely Isolated Chart Tools
 * This component is designed to be completely safe and will NOT affect
 * any other parts of the application, even if errors occur
 */
const EChartsIntegration: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Handle URL parameters for direct chart navigation
  useEffect(() => {
    const chartParam = searchParams.get('chart');
    if (chartParam) {
      // Find the chart and its category
      const chart = chartCategories
        .flatMap(cat => cat.charts)
        .find(chart => chart.id === chartParam);
      
      if (chart && chart.implemented) {
        setActiveChart(chartParam);
        setActiveCategory(null);
      }
    }
  }, [searchParams]);

  // Chart categories with comprehensive chart types
  const chartCategories = [
    {
      id: 'basic',
      name: 'Basic Charts',
      description: 'Essential chart types for common data visualization needs',
      icon: BarChart2,
      color: 'blue',
      charts: [
        {
          id: 'bar',
          name: 'Bar Chart',
          description: 'Compare data across categories with vertical or horizontal bars',
          icon: BarChart2,
          component: BarChartBuilder,
          implemented: true
        },
        {
          id: 'line',
          name: 'Line Chart',
          description: 'Show trends and changes over time with connected data points',
          icon: TrendingUp,
          component: LineChartBuilder,
          implemented: true
        },
        {
          id: 'pie',
          name: 'Pie Chart',
          description: 'Display proportional data as slices of a circular chart',
          icon: PieChart,
          component: PieChartBuilder,
          implemented: true
        },
        {
          id: 'scatter',
          name: 'Scatter Plot',
          description: 'Analyze correlations between two variables with plotted points',
          icon: Zap,
          component: ScatterPlotBuilder,
          implemented: true
        }
      ]
    },
    {
      id: 'statistical',
      name: 'Statistical Charts',
      description: 'Advanced charts for statistical analysis and data exploration',
      icon: Activity,
      color: 'green',
      charts: [
        {
          id: 'radar',
          name: 'Radar Chart',
          description: 'Multi-dimensional data comparison in a radial format',
          icon: Radar,
          component: RadarChartBuilder,
          implemented: true
        },
        {
          id: 'heatmap',
          name: 'Heatmap',
          description: 'Visualize data density and correlations with color intensity',
          icon: Grid3x3,
          component: HeatmapChartBuilder,
          implemented: true
        },
        {
          id: 'boxplot',
          name: 'Box Plot',
          description: 'Statistical distribution analysis with quartiles and outliers',
          icon: BarChart3,
          component: BoxplotChartBuilder,
          implemented: true
        },
        {
          id: 'candlestick',
          name: 'Candlestick',
          description: 'Financial data visualization with OHLC (Open, High, Low, Close)',
          icon: LineChart,
          component: CandlestickChartBuilder,
          implemented: true
        }
      ]
    },
    {
      id: 'hierarchical',
      name: 'Hierarchical Charts',
      description: 'Visualize tree structures and nested data relationships',
      icon: TreePine,
      color: 'purple',
      charts: [
        {
          id: 'tree',
          name: 'Tree Chart',
          description: 'Hierarchical data visualization in tree structure',
          icon: TreePine,
          component: TreeChartBuilder,
          implemented: true
        },
        {
          id: 'treemap',
          name: 'Treemap',
          description: 'Hierarchical data as nested rectangles by size',
          icon: Grid3x3,
          component: TreemapChartBuilder,
          implemented: true
        },
        {
          id: 'sunburst',
          name: 'Sunburst',
          description: 'Multi-level hierarchical data in concentric circles',
          icon: Target,
          component: SunburstChartBuilder,
          implemented: true
        }
      ]
    },
    {
      id: 'flow',
      name: 'Flow & Network',
      description: 'Visualize relationships, flows, and network connections',
      icon: Share,
      color: 'indigo',
      charts: [
        {
          id: 'sankey',
          name: 'Sankey Diagram',
          description: 'Flow visualization between different stages or categories',
          icon: Share,
          component: SankeyChartBuilder,
          implemented: true
        },
        {
          id: 'graph',
          name: 'Graph/Network',
          description: 'Node-link diagrams for network relationship visualization',
          icon: Share,
          component: GraphChartBuilder,
          implemented: true
        },
        {
          id: 'parallel',
          name: 'Parallel Coordinates',
          description: 'Multi-dimensional data analysis with parallel axes',
          icon: BarChart3,
          component: ParallelChartBuilder,
          implemented: true
        }
      ]
    },
    {
      id: 'specialized',
      name: 'Specialized Charts',
      description: 'Purpose-built charts for specific use cases and industries',
      icon: Gauge,
      color: 'orange',
      charts: [
        {
          id: 'gauge',
          name: 'Gauge Chart',
          description: 'KPI visualization with speedometer-style indicators',
          icon: Gauge,
          component: GaugeChartBuilder,
          implemented: true
        },
        {
          id: 'funnel',
          name: 'Funnel Chart',
          description: 'Conversion analysis and process flow visualization',
          icon: Target,
          component: FunnelChartBuilder,
          implemented: true
        },
        {
          id: 'pictorialbar',
          name: 'Pictorial Bar',
          description: 'Creative bar charts with custom shapes and symbols',
          icon: BarChart2,
          component: PictorialBarChartBuilder,
          implemented: true
        },
        {
          id: 'calendar',
          name: 'Calendar Chart',
          description: 'Time-series data visualization in calendar format',
          icon: Calendar,
          component: CalendarChartBuilder,
          implemented: true
        },
        {
          id: 'themeriver',
          name: 'Theme River',
          description: 'Temporal data flow visualization over time',
          icon: Activity,
          implemented: false
        }
      ]
    },
    {
      id: 'geographic',
      name: 'Geographic Charts',
      description: 'Location-based data visualization and mapping',
      icon: Map,
      color: 'teal',
      charts: [
        {
          id: 'map',
          name: 'Geo/Map Chart',
          description: 'Geographic data visualization on world/country maps',
          icon: Map,
          implemented: false
        },
        {
          id: 'lines',
          name: 'Map Lines',
          description: 'Flight routes and connection visualization on maps',
          icon: Share,
          implemented: false
        }
      ]
    },
    {
      id: '3d',
      name: '3D Charts',
      description: 'Three-dimensional data visualization with depth and perspective',
      icon: Globe,
      color: 'pink',
      charts: [
        {
          id: '3d-globe',
          name: '3D Globe',
          description: 'Interactive 3D earth visualization for global data',
          icon: Globe,
          implemented: false
        },
        {
          id: '3d-bar',
          name: '3D Bar Chart',
          description: 'Three-dimensional bar charts with depth',
          icon: BarChart3,
          implemented: false
        },
        {
          id: '3d-scatter',
          name: '3D Scatter Plot',
          description: 'Three-dimensional scatter plot for complex correlations',
          icon: Zap,
          implemented: false
        },
        {
          id: '3d-surface',
          name: '3D Surface',
          description: 'Mathematical function visualization in 3D space',
          icon: Activity,
          implemented: false
        },
        {
          id: '3d-map',
          name: '3D Map',
          description: 'Three-dimensional geographic visualization',
          icon: Map,
          implemented: false
        },
        {
          id: '3d-lines',
          name: '3D Lines',
          description: 'Three-dimensional line connections and paths',
          icon: TrendingUp,
          implemented: false
        }
      ]
    },
    {
      id: 'webgl',
      name: 'WebGL Enhanced',
      description: 'High-performance charts using WebGL for large datasets',
      icon: Layers,
      color: 'cyan',
      charts: [
        {
          id: 'scatter-gl',
          name: 'Scatter GL',
          description: 'GPU-accelerated scatter plots for massive datasets',
          icon: Zap,
          implemented: false
        },
        {
          id: 'lines-gl',
          name: 'Lines GL',
          description: 'High-performance line rendering with WebGL',
          icon: TrendingUp,
          implemented: false
        },
        {
          id: 'flow-gl',
          name: 'Flow GL',
          description: 'GPU-accelerated flow field visualization',
          icon: Activity,
          implemented: false
        },
        {
          id: 'graph-gl',
          name: 'Graph GL',
          description: 'Large-scale network visualization with WebGL',
          icon: Share,
          implemented: false
        }
      ]
    },
    {
      id: 'utility',
      name: 'Utilities & Tools',
      description: 'Data transformation and chart enhancement utilities',
      icon: Database,
      color: 'gray',
      charts: [
        {
          id: 'dataset',
          name: 'Dataset Manager',
          description: 'Data transformation and management utilities',
          icon: Database,
          component: DatasetManager,
          implemented: true
        },
        {
          id: 'datazoom',
          name: 'Data Zoom',
          description: 'Interactive zooming and panning for large datasets',
          icon: Zap,
          implemented: false
        },
        {
          id: 'graphic',
          name: 'Graphic Elements',
          description: 'Custom graphics and annotations for charts',
          icon: Layers,
          implemented: false
        },
        {
          id: 'richtext',
          name: 'Rich Text',
          description: 'Advanced text formatting and labeling options',
          icon: BarChart2,
          implemented: false
        }
      ]
    }
  ];

  const handleChartSelect = (chartId: string) => {
    try {
      setActiveChart(chartId);
      setActiveCategory(null);
    } catch (error) {
      console.error('Error selecting chart:', error);
      setActiveChart(null);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    try {
      setActiveCategory(categoryId);
      setActiveChart(null);
    } catch (error) {
      console.error('Error selecting category:', error);
      setActiveCategory(null);
    }
  };

  const handleBackToCategories = () => {
    try {
      setActiveCategory(null);
      setActiveChart(null);
    } catch (error) {
      console.error('Error going back to categories:', error);
    }
  };

  const handleBackToCategory = () => {
    try {
      setActiveChart(null);
    } catch (error) {
      console.error('Error going back to category:', error);
    }
  };

  // Render active chart component safely
  const renderActiveChart = () => {
    try {
      const chart = chartCategories
        .flatMap(cat => cat.charts)
        .find(chart => chart.id === activeChart);
      
      if (!chart || !chart.component) {
        return (
          <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}>
            <div style={{
              background: 'var(--warning-light)',
              border: '2px solid var(--warning-color)',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              maxWidth: '600px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <AlertCircle size={64} style={{ color: 'var(--warning-color)', margin: '0 auto 1.5rem auto' }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'var(--warning-color)',
                margin: '0 0 1rem 0'
              }}>Chart Coming Soon</h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: '0 0 2rem 0',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                The {chart?.name} component is currently under development and will be available soon.
              </p>
              <button
                onClick={handleBackToCategories}
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--warning-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Back to Chart Selection
              </button>
            </div>
          </div>
        );
      }

      const ChartComponent = chart.component;
      return (
        <EChartsErrorBoundary
          fallback={
            <div style={{
              background: 'var(--error-light)',
              border: '2px solid var(--error-color)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '2rem auto'
            }}>
              <AlertCircle size={48} style={{ color: 'var(--error-color)', margin: '0 auto 1rem auto' }} />
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: 'var(--error-color)',
                margin: '0 0 1rem 0'
              }}>Chart Component Error</h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: '0 0 1.5rem 0',
                lineHeight: '1.5'
              }}>
                There was an error loading the {chart.name} component.
              </p>
              <button
                onClick={handleBackToCategories}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--error-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Back to Chart Selection
              </button>
            </div>
          }
        >
          <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            padding: '0'
          }}>
            {/* Navigation Header */}
            <div style={{
              background: 'white',
              borderBottom: '1px solid var(--border-color)',
              padding: '1rem 2rem',
              position: 'sticky',
              top: '0',
              zIndex: '10',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <button
                  onClick={handleBackToCategories}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-tertiary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                    e.currentTarget.style.color = 'var(--accent-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
                  Back to Charts
                </button>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <chart.icon size={18} style={{ color: 'var(--accent-color)' }} />
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: 0
                    }}>{chart.name}</h2>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      margin: 0
                    }}>{chart.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chart Component Container */}
            <div style={{
              padding: '2rem',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              <ChartComponent />
            </div>
          </div>
        </EChartsErrorBoundary>
      );
    } catch (error) {
      console.error('Error rendering active chart:', error);
      return (
        <div style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            background: 'var(--error-light)',
            border: '2px solid var(--error-color)',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '600px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <AlertCircle size={64} style={{ color: 'var(--error-color)', margin: '0 auto 1.5rem auto' }} />
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--error-color)',
              margin: '0 0 1rem 0'
            }}>Rendering Error</h3>
            <p style={{
              color: 'var(--text-secondary)',
              margin: '0 0 2rem 0',
              lineHeight: '1.6',
              fontSize: '1rem'
            }}>
              Unable to render the chart component. This error is isolated and won't affect other parts of the application.
            </p>
            <button
              onClick={handleBackToCategories}
              style={{
                padding: '1rem 2rem',
                background: 'var(--error-color)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Back to Chart Selection
            </button>
          </div>
        </div>
      );
    }
  };

  // Category view
  if (activeCategory && !activeChart) {
    const category = chartCategories.find(cat => cat.id === activeCategory);
    if (!category) {
      return (
        <div className="tool-container">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Category Not Found</h3>
            <button
              onClick={handleBackToCategories}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Back to Categories
            </button>
          </div>
        </div>
      );
    }

    const IconComponent = category.icon;
    return (
      <EChartsErrorBoundary>
        <div className="tool-container">
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={handleBackToCategories}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                padding: '0.5rem 0'
              }}
            >
              <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
              Back to Categories
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent size={32} style={{ color: 'var(--accent-color)' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  {category.name}
                </h1>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem',
                  margin: 0
                }}>
                  {category.description}
                </p>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {category.charts.map((chart) => {
              const ChartIconComponent = chart.icon;

              return (
                <div
                  key={chart.id}
                  onClick={() => chart.implemented ? handleChartSelect(chart.id) : null}
                  style={{
                    background: 'white',
                    border: '2px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: chart.implemented ? 'pointer' : 'not-allowed',
                    opacity: chart.implemented ? 1 : 0.6,
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (chart.implemented) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.borderColor = 'var(--accent-color)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (chart.implemented) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: chart.implemented ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ChartIconComponent 
                          size={20} 
                          style={{ 
                            color: chart.implemented ? 'var(--accent-color)' : 'var(--text-muted)'
                          }} 
                        />
                      </div>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        margin: 0
                      }}>
                        {chart.name}
                      </h3>
                    </div>
                    {!chart.implemented && (
                      <span style={{
                        background: 'var(--warning-light)',
                        color: 'var(--warning-color)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        Soon
                      </span>
                    )}
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    margin: '0 0 1.5rem 0'
                  }}>
                    {chart.description}
                  </p>

                  {chart.implemented ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: 'var(--accent-color)',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      Create Chart
                      <ChevronRight size={16} />
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem'
                    }}>
                      Coming Soon
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            background: 'white',
            border: '2px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
              <div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--accent-color)',
                  marginBottom: '0.5rem'
                }}>
                  {category.charts.filter(chart => chart.implemented).length}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Available Now</div>
              </div>
              <div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem'
                }}>
                  {category.charts.length}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Charts</div>
              </div>
              <div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--success-color)',
                  marginBottom: '0.5rem'
                }}>
                  {Math.round((category.charts.filter(chart => chart.implemented).length / category.charts.length) * 100)}%
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ready</div>
              </div>
            </div>
          </div>
        </div>
      </EChartsErrorBoundary>
    );
  }

  // Main categories view
  if (!activeChart && !activeCategory) {
    // Filter categories and charts based on search term
    const filteredCategories = chartCategories.map(category => {
      const filteredCharts = category.charts.filter(chart => {
        const matchesSearch = searchTerm === '' || 
          chart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chart.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && chart.implemented;
      });
      
      return {
        ...category,
        charts: filteredCharts,
        hasMatches: filteredCharts.length > 0
      };
    }).filter(category => category.hasMatches || searchTerm === '');

    return (
      <EChartsErrorBoundary>
        <div className="tool-container">
          <div className="tool-header">
            <h1>Chart Tools</h1>
            <p>Interactive visualization powered by ECharts - Create stunning charts and graphs</p>
          </div>

          {/* Search Section */}
          <div style={{
            background: 'white',
            border: '2px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ position: 'relative' }}>
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} 
              />
              <input
                type="text"
                placeholder="Search charts by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            
            {/* Search Results Summary */}
            {searchTerm && (
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>
                  Found {filteredCategories.reduce((total, cat) => total + cat.charts.length, 0)} charts 
                  in {filteredCategories.length} categories
                </span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.25rem 0.5rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-light)';
                      e.currentTarget.style.color = 'var(--accent-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* No Results Message */}
          {searchTerm && filteredCategories.length === 0 && (
            <div style={{
              background: 'white',
              border: '2px solid var(--border-color)',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Search size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                margin: '0 0 0.5rem 0'
              }}>
                No charts found
              </h3>
              <p style={{
                color: 'var(--text-muted)',
                margin: '0 0 1.5rem 0'
              }}>
                Try searching with different keywords or browse all categories below.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Show All Charts
              </button>
            </div>
          )}

          {/* Direct Chart Results for Search */}
          {searchTerm && filteredCategories.length > 0 && (
            <div style={{
              background: 'white',
              border: '2px solid var(--accent-color)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 1rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Target size={20} style={{ color: 'var(--accent-color)' }} />
                Quick Access to Charts
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem'
              }}>
                {filteredCategories.flatMap(cat => cat.charts).slice(0, 8).map((chart, index) => {
                  const ChartIcon = chart.icon;
                  return (
                    <button
                      key={chart.id}
                      onClick={() => handleChartSelect(chart.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'var(--accent-light)',
                        border: '2px solid var(--accent-color)',
                        borderRadius: '12px',
                        color: 'var(--accent-color)',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        textAlign: 'left'
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
                      <ChartIcon size={18} />
                      <span>{chart.name}</span>
                      <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
                    </button>
                  );
                })}
              </div>
              {filteredCategories.flatMap(cat => cat.charts).length > 8 && (
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  margin: '1rem 0 0 0',
                  textAlign: 'center'
                }}>
                  +{filteredCategories.flatMap(cat => cat.charts).length - 8} more charts available in categories below
                </p>
              )}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            {filteredCategories.map((category, index) => {
              const IconComponent = category.icon;
              const implementedCount = category.charts.length; // Already filtered
              const totalImplementedInCategory = chartCategories.find(cat => cat.id === category.id)?.charts.filter(chart => chart.implemented).length || 0;
              const totalCount = chartCategories.find(cat => cat.id === category.id)?.charts.length || 0;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  onClick={() => implementedCount > 0 && handleCategorySelect(category.id)}
                  style={{
                    background: 'white',
                    border: searchTerm && implementedCount > 0 ? '2px solid var(--accent-color)' : '2px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: implementedCount > 0 ? 'pointer' : 'not-allowed',
                    opacity: implementedCount > 0 ? 1 : 0.6,
                    transition: 'all 0.3s ease',
                    boxShadow: searchTerm && implementedCount > 0 ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                  }}
                  whileHover={implementedCount > 0 ? {
                    y: -5,
                    boxShadow: 'var(--shadow-md)'
                  } : {}}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: implementedCount > 0 ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent 
                        size={24} 
                        style={{ 
                          color: implementedCount > 0 ? 'var(--accent-color)' : 'var(--text-muted)' 
                        }} 
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        margin: 0,
                        marginBottom: '0.25rem'
                      }}>
                        {category.name}
                      </h3>
                      <div style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span>
                          {searchTerm ? `${implementedCount} matching` : `${totalImplementedInCategory} of ${totalCount}`} charts
                        </span>
                        {implementedCount > 0 && (
                          <span style={{
                            background: searchTerm ? 'var(--accent-light)' : 'var(--success-light)',
                            color: searchTerm ? 'var(--accent-color)' : 'var(--success-color)',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            {searchTerm ? 'Found' : 'Ready'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    margin: '0 0 1rem 0'
                  }}>
                    {category.description}
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      {category.charts.slice(0, 3).map((chart, chartIndex) => (
                        <span 
                          key={chartIndex}
                          style={{
                            background: searchTerm ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                            color: searchTerm ? 'var(--accent-color)' : 'var(--text-secondary)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '16px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          {chart.name}
                        </span>
                      ))}
                      {implementedCount > 3 && (
                        <span style={{
                          background: searchTerm ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                          color: searchTerm ? 'var(--accent-color)' : 'var(--text-secondary)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '16px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          +{implementedCount - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {implementedCount > 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: 'var(--accent-color)',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      <span>Explore {category.name}</span>
                      <ChevronRight size={16} />
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      Coming Soon
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </EChartsErrorBoundary>
    );
  }

  // Render the active chart component
  return renderActiveChart();
};

export default EChartsIntegration;