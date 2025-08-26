import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, TrendingUp, PieChart, Zap, Grid3x3, Radar, TreePine, Share, Target, Calendar, Gauge, Activity, Database, ChevronRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChartTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  implemented: boolean;
}

const DataVisualizationBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Chart tools data
  const chartTools: ChartTool[] = [
    // Basic Charts
    { id: 'bar', name: 'Bar Chart', description: 'Compare data across categories with vertical or horizontal bars', icon: BarChart2, category: 'Basic', difficulty: 'Easy', implemented: true },
    { id: 'line', name: 'Line Chart', description: 'Show trends and changes over time with connected data points', icon: TrendingUp, category: 'Basic', difficulty: 'Easy', implemented: true },
    { id: 'pie', name: 'Pie Chart', description: 'Display proportional data as slices of a circular chart', icon: PieChart, category: 'Basic', difficulty: 'Easy', implemented: true },
    { id: 'scatter', name: 'Scatter Plot', description: 'Analyze correlations between two variables with plotted points', icon: Zap, category: 'Basic', difficulty: 'Medium', implemented: true },
    
    // Statistical Charts
    { id: 'radar', name: 'Radar Chart', description: 'Multi-dimensional data comparison in a radial format', icon: Radar, category: 'Statistical', difficulty: 'Medium', implemented: true },
    { id: 'heatmap', name: 'Heatmap', description: 'Visualize data density and correlations with color intensity', icon: Grid3x3, category: 'Statistical', difficulty: 'Medium', implemented: true },
    { id: 'boxplot', name: 'Box Plot', description: 'Statistical distribution analysis with quartiles and outliers', icon: BarChart2, category: 'Statistical', difficulty: 'Advanced', implemented: true },
    { id: 'candlestick', name: 'Candlestick', description: 'Financial data visualization with OHLC (Open, High, Low, Close)', icon: TrendingUp, category: 'Statistical', difficulty: 'Advanced', implemented: true },
    
    // Hierarchical Charts
    { id: 'tree', name: 'Tree Chart', description: 'Hierarchical data visualization in tree structure', icon: TreePine, category: 'Hierarchical', difficulty: 'Advanced', implemented: true },
    { id: 'treemap', name: 'Treemap', description: 'Hierarchical data as nested rectangles by size', icon: Grid3x3, category: 'Hierarchical', difficulty: 'Medium', implemented: true },
    { id: 'sunburst', name: 'Sunburst', description: 'Multi-level hierarchical data in concentric circles', icon: Target, category: 'Hierarchical', difficulty: 'Advanced', implemented: true },
    
    // Flow & Network Charts
    { id: 'sankey', name: 'Sankey Diagram', description: 'Flow visualization between different stages or categories', icon: Share, category: 'Flow', difficulty: 'Advanced', implemented: true },
    { id: 'graph', name: 'Graph/Network', description: 'Node-link diagrams for network relationship visualization', icon: Share, category: 'Flow', difficulty: 'Advanced', implemented: true },
    { id: 'parallel', name: 'Parallel Coordinates', description: 'Multi-dimensional data analysis with parallel axes', icon: BarChart2, category: 'Flow', difficulty: 'Advanced', implemented: true },
    
    // Specialized Charts
    { id: 'gauge', name: 'Gauge Chart', description: 'KPI visualization with speedometer-style indicators', icon: Gauge, category: 'Specialized', difficulty: 'Medium', implemented: true },
    { id: 'funnel', name: 'Funnel Chart', description: 'Conversion analysis and process flow visualization', icon: Target, category: 'Specialized', difficulty: 'Medium', implemented: true },
    { id: 'pictorialbar', name: 'Pictorial Bar', description: 'Creative bar charts with custom shapes and symbols', icon: BarChart2, category: 'Specialized', difficulty: 'Medium', implemented: true },
    { id: 'calendar', name: 'Calendar Chart', description: 'Time-series data visualization in calendar format', icon: Calendar, category: 'Specialized', difficulty: 'Medium', implemented: true },
    
    // Utilities
    { id: 'dataset', name: 'Dataset Manager', description: 'Data transformation and management utilities', icon: Database, category: 'Utilities', difficulty: 'Easy', implemented: true }
  ];

  const categories = ['all', 'Basic', 'Statistical', 'Hierarchical', 'Flow', 'Specialized', 'Utilities'];
  const difficulties = ['all', 'Easy', 'Medium', 'Advanced'];

  // Filter charts based on search and filters
  const filteredCharts = chartTools.filter(chart => {
    const matchesSearch = chart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chart.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || chart.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || chart.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty && chart.implemented;
  });

  const handleChartSelect = (chartId: string) => {
    // Navigate to ECharts Integration and select the specific chart
    navigate(`/tools/echarts-integration?chart=${chartId}`);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Data Visualization Builder</h1>
        <p>Choose from {chartTools.filter(c => c.implemented).length}+ professional chart types to create stunning data visualizations</p>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        border: '2px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {/* Search */}
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
              placeholder="Search charts..."
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

          {/* Category Filter */}
          <div style={{ position: 'relative' }}>
            <Filter 
              size={20} 
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }} 
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div style={{ position: 'relative' }}>
            <Target 
              size={20} 
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }} 
            />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
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
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          marginTop: '1rem'
        }}>
          Showing {filteredCharts.length} of {chartTools.filter(c => c.implemented).length} available charts
        </div>
        </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
          {filteredCharts.map((chart, index) => {
            const IconComponent = chart.icon;
            
            return (
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                onClick={() => handleChartSelect(chart.id)}
                style={{
                  background: 'white',
                  border: '2px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                whileHover={{
                  y: -4,
                  boxShadow: 'var(--shadow-md)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                {/* Chart Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'var(--accent-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={20} style={{ color: 'var(--accent-color)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        margin: 0,
                        marginBottom: '0.25rem'
                      }}>
                        {chart.name}
                      </h3>
                      <span style={{
                        fontSize: '0.8rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontWeight: '500',
                        ...(chart.difficulty === 'Easy' ? {
                          background: 'var(--success-light)',
                          color: 'var(--success-color)'
                        } : chart.difficulty === 'Medium' ? {
                          background: 'var(--warning-light)',
                          color: 'var(--warning-color)'
                        } : {
                          background: 'var(--error-light)',
                          color: 'var(--error-color)'
                        })
                      }}>
                        {chart.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chart Description */}
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  margin: '0 0 1.5rem 0'
                }}>
                  {chart.description}
                </p>

                {/* Category Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-tertiary)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px'
                  }}>
                    {chart.category}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--accent-color)',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    <span>Create Chart</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      {/* No results */}
      {filteredCharts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'white',
          border: '2px solid var(--border-color)',
          borderRadius: '16px',
          marginTop: '2rem'
        }}>
          <div style={{
            color: 'var(--text-muted)',
            marginBottom: '1rem'
          }}>
            <Search size={64} style={{ margin: '0 auto' }} />
          </div>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: '0 0 0.5rem 0'
          }}>
            No charts found
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div style={{
        marginTop: '3rem',
        background: 'white',
        border: '2px solid var(--border-color)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--accent-color)',
              marginBottom: '0.5rem'
            }}>
              {chartTools.filter(c => c.implemented).length}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              Available Charts
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--success-color)',
              marginBottom: '0.5rem'
            }}>
              {categories.length - 1}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              Categories
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--warning-color)',
              marginBottom: '0.5rem'
            }}>
              {chartTools.filter(c => c.implemented && c.difficulty === 'Easy').length}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              Easy to Use
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem'
            }}>
              100%
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              Ready to Use
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizationBuilder;