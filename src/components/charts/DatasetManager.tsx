import React, { useState, useCallback } from 'react';
import { Database, Download, Upload, Settings, Plus, Trash2 } from 'lucide-react';
import EChartsErrorBoundary from './EChartsErrorBoundary';

interface DatasetManagerProps {
  className?: string;
}

interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  values: any[];
}

interface Dataset {
  name: string;
  columns: DataColumn[];
}

/**
 * Isolated Dataset Manager Component
 * Completely safe implementation for data transformation and management
 */
const DatasetManager: React.FC<DatasetManagerProps> = ({ className = '' }) => {
  const [dataset, setDataset] = useState<Dataset>({
    name: 'Sample Dataset',
    columns: [
      { name: 'Product', type: 'string', values: ['Laptop', 'Smartphone', 'Tablet', 'Desktop', 'Smart TV'] },
      { name: 'Sales', type: 'number', values: [1500, 2200, 800, 650, 1200] },
      { name: 'Category', type: 'string', values: ['Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics'] },
      { name: 'Date', type: 'date', values: ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19'] },
      { name: 'InStock', type: 'boolean', values: [true, true, false, true, true] }
    ]
  });

  const [csvInput, setCsvInput] = useState('');
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // CSV parsing
  const parseCSV = useCallback((csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return null;
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => 
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );
      
      const columns: DataColumn[] = headers.map(header => {
        const values = rows.map(row => row[headers.indexOf(header)] || '');
        
        // Auto-detect column type
        let type: 'string' | 'number' | 'date' | 'boolean' = 'string';
        
        if (values.every(val => !isNaN(parseFloat(val)) && isFinite(parseFloat(val)))) {
          type = 'number';
        } else if (values.every(val => ['true', 'false', '1', '0'].includes(val.toLowerCase()))) {
          type = 'boolean';
        } else if (values.every(val => !isNaN(Date.parse(val)))) {
          type = 'date';
        }
        
        return {
          name: header,
          type,
          values: type === 'number' ? values.map(v => parseFloat(v)) :
                  type === 'boolean' ? values.map(v => ['true', '1'].includes(v.toLowerCase())) :
                  values
        };
      });
      
      return columns;
    } catch (error) {
      console.error('Error parsing CSV:', error);
      return null;
    }
  }, []);

  const handleCSVImport = useCallback(() => {
    try {
      const columns = parseCSV(csvInput);
      if (columns) {
        setDataset(prev => ({ ...prev, columns }));
        setCsvInput('');
        alert('Data imported successfully!');
      } else {
        alert('Invalid CSV format. Please check your data.');
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Error importing CSV data.');
    }
  }, [csvInput, parseCSV]);

  // Get filtered and sorted data
  const getProcessedData = useCallback(() => {
    try {
      let indices = dataset.columns[0]?.values.map((_, i) => i) || [];
      
      // Apply filter
      if (filterColumn && filterValue) {
        const col = dataset.columns.find(c => c.name === filterColumn);
        if (col) {
          indices = indices.filter(i => 
            String(col.values[i]).toLowerCase().includes(filterValue.toLowerCase())
          );
        }
      }
      
      // Apply sort
      if (sortColumn) {
        const col = dataset.columns.find(c => c.name === sortColumn);
        if (col) {
          indices.sort((a, b) => {
            const valueA = col.values[a];
            const valueB = col.values[b];
            
            let comparison = 0;
            if (col.type === 'number') {
              comparison = parseFloat(valueA) - parseFloat(valueB);
            } else {
              comparison = String(valueA).localeCompare(String(valueB));
            }
            
            return sortDirection === 'desc' ? -comparison : comparison;
          });
        }
      }
      
      return indices;
    } catch (error) {
      console.error('Error processing data:', error);
      return [];
    }
  }, [dataset, filterColumn, filterValue, sortColumn, sortDirection]);

  // Export data
  const handleExport = useCallback((format: 'json' | 'csv') => {
    try {
      const processedIndices = getProcessedData();
      
      let dataStr: string;
      let fileName: string;
      let mimeType: string;
      
      if (format === 'json') {
        const jsonData = {
          name: dataset.name,
          columns: dataset.columns.map(col => ({
            ...col,
            values: processedIndices.map(i => col.values[i])
          }))
        };
        
        dataStr = JSON.stringify(jsonData, null, 2);
        fileName = `${dataset.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
        mimeType = 'application/json';
      } else {
        const headers = dataset.columns.map(col => col.name).join(',');
        const rows = processedIndices.map(i => 
          dataset.columns.map(col => col.values[i]).join(',')
        ).join('\n');
        
        dataStr = headers + '\n' + rows;
        fileName = `${dataset.name.replace(/\s+/g, '_')}_${Date.now()}.csv`;
        mimeType = 'text/csv';
      }
      
      const dataBlob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Export failed. Please try again.');
    }
  }, [dataset, getProcessedData]);

  // Generate sample data
  const generateSampleData = useCallback((type: 'sales' | 'users' | 'financial') => {
    try {
      const sampleData = {
        sales: {
          name: 'Sales Data',
          columns: [
            { name: 'Product', type: 'string' as const, values: ['iPhone', 'Samsung', 'iPad', 'MacBook', 'Dell'] },
            { name: 'Revenue', type: 'number' as const, values: [50000, 35000, 25000, 80000, 45000] },
            { name: 'Units', type: 'number' as const, values: [50, 70, 125, 40, 45] },
            { name: 'Quarter', type: 'string' as const, values: ['Q1', 'Q1', 'Q2', 'Q2', 'Q3'] }
          ]
        },
        users: {
          name: 'User Analytics',
          columns: [
            { name: 'Country', type: 'string' as const, values: ['USA', 'UK', 'Germany', 'France', 'Japan'] },
            { name: 'Users', type: 'number' as const, values: [15000, 8000, 12000, 7500, 9000] },
            { name: 'Sessions', type: 'number' as const, values: [45000, 24000, 36000, 22500, 27000] },
            { name: 'Active', type: 'boolean' as const, values: [true, true, true, false, true] }
          ]
        },
        financial: {
          name: 'Financial Metrics',
          columns: [
            { name: 'Month', type: 'string' as const, values: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
            { name: 'Revenue', type: 'number' as const, values: [125000, 132000, 118000, 145000, 155000] },
            { name: 'Expenses', type: 'number' as const, values: [85000, 88000, 82000, 92000, 95000] },
            { name: 'Profit', type: 'number' as const, values: [40000, 44000, 36000, 53000, 60000] }
          ]
        }
      };
      
      setDataset(sampleData[type]);
    } catch (error) {
      console.error('Error generating sample data:', error);
    }
  }, []);

  return (
    <EChartsErrorBoundary>
      <div className={`dataset-manager ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Dataset Manager</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Data Preview - {dataset.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {dataset.columns.map(col => (
                        <th key={col.name} className="text-left p-2 font-medium">
                          {col.name}
                          <span className="text-xs text-gray-500 ml-1">({col.type})</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getProcessedData().slice(0, 10).map((rowIndex, displayIndex) => (
                      <tr key={displayIndex} className="border-b hover:bg-gray-50">
                        {dataset.columns.map(col => (
                          <td key={col.name} className="p-2">
                            {String(col.values[rowIndex])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Showing {Math.min(10, getProcessedData().length)} of {getProcessedData().length} rows
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Data Import */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={dataset.name}
                  onChange={(e) => setDataset(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Dataset name"
                />

                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={4}
                  placeholder="Paste CSV data here..."
                />

                <button
                  onClick={handleCSVImport}
                  disabled={!csvInput.trim()}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                >
                  Import CSV
                </button>
              </div>
            </div>

            {/* Sample Data */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Sample Data</h3>
              <div className="space-y-2">
                <button
                  onClick={() => generateSampleData('sales')}
                  className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  Sales Data
                </button>
                <button
                  onClick={() => generateSampleData('users')}
                  className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                >
                  User Analytics
                </button>
                <button
                  onClick={() => generateSampleData('financial')}
                  className="w-full px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                >
                  Financial Metrics
                </button>
              </div>
            </div>

            {/* Data Transformations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Transform Data
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
                  <div className="flex space-x-1">
                    <select
                      value={filterColumn}
                      onChange={(e) => setFilterColumn(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Column</option>
                      {dataset.columns.map(col => (
                        <option key={col.name} value={col.name}>{col.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Value"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
                  <div className="flex space-x-1">
                    <select
                      value={sortColumn}
                      onChange={(e) => setSortColumn(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Column</option>
                      {dataset.columns.map(col => (
                        <option key={col.name} value={col.name}>{col.name}</option>
                      ))}
                    </select>
                    <select
                      value={sortDirection}
                      onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="asc">↑</option>
                      <option value="desc">↓</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFilterColumn('');
                    setFilterValue('');
                    setSortColumn('');
                  }}
                  className="w-full px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Rows:</span>
                  <span className="font-medium">{dataset.columns[0]?.values.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filtered Rows:</span>
                  <span className="font-medium">{getProcessedData().length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Columns:</span>
                  <span className="font-medium">{dataset.columns.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EChartsErrorBoundary>
  );
};

export default DatasetManager;