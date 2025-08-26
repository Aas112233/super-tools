import React, { useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';

interface EChartsWrapperProps {
  option: EChartsOption;
  width?: string | number;
  height?: string | number;
  theme?: string;
  className?: string;
  onChartReady?: (chartInstance: echarts.ECharts) => void;
  onError?: (error: Error) => void;
}

/**
 * Isolated ECharts Wrapper Component
 * This component safely wraps ECharts functionality with comprehensive error handling
 * to ensure that any ECharts-related errors do NOT affect the rest of the application
 */
const EChartsWrapper: React.FC<EChartsWrapperProps> = ({
  option,
  width = '100%',
  height = '400px',
  theme,
  className = '',
  onChartReady,
  onError
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  // Safe chart initialization with error handling
  const initChart = useCallback(() => {
    try {
      if (!chartRef.current) {
        throw new Error('Chart container not found');
      }

      // Dispose existing chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }

      // Initialize new chart instance
      const chartInstance = echarts.init(chartRef.current, theme);
      chartInstanceRef.current = chartInstance;

      // Set chart option with error handling
      try {
        chartInstance.setOption(option, true);
      } catch (optionError) {
        console.error('Error setting chart option:', optionError);
        if (onError) {
          onError(optionError as Error);
        }
        return;
      }

      // Handle window resize
      const handleResize = () => {
        try {
          if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
            chartInstanceRef.current.resize();
          }
        } catch (resizeError) {
          console.error('Error resizing chart:', resizeError);
          if (onError) {
            onError(resizeError as Error);
          }
        }
      };

      window.addEventListener('resize', handleResize);

      // Call ready callback
      if (onChartReady) {
        try {
          onChartReady(chartInstance);
        } catch (callbackError) {
          console.error('Error in chart ready callback:', callbackError);
          if (onError) {
            onError(callbackError as Error);
          }
        }
      }

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
          chartInstanceRef.current.dispose();
        }
      };

    } catch (initError) {
      console.error('Error initializing chart:', initError);
      if (onError) {
        onError(initError as Error);
      }
    }
  }, [option, theme, onChartReady, onError]);

  // Initialize chart on mount and option changes
  useEffect(() => {
    const cleanup = initChart();
    return cleanup;
  }, [initChart]);

  // Update chart option when it changes
  useEffect(() => {
    try {
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
        chartInstanceRef.current.setOption(option, true);
      }
    } catch (updateError) {
      console.error('Error updating chart option:', updateError);
      if (onError) {
        onError(updateError as Error);
      }
    }
  }, [option, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
          chartInstanceRef.current.dispose();
          chartInstanceRef.current = null;
        }
      } catch (cleanupError) {
        console.error('Error during chart cleanup:', cleanupError);
      }
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className={`echarts-container ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        minHeight: '200px'
      }}
    />
  );
};

export default EChartsWrapper;