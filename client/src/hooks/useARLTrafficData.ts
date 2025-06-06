import { useState } from 'react';
import { ARLData } from '../types';
import { parseARLRPMData, parseARLRPSData } from '../utils/arlTrafficParser';

interface ARLTrafficDataReturn {
  arlRPMData: ARLData[];
  arlRPSData: ARLData[];
  loading: boolean;
  error: string | null;
  uploadARLRPMData: (logContent: string) => void;
  uploadARLRPSData: (logContent: string) => void;
}

export function useARLTrafficData(): ARLTrafficDataReturn {
  const [arlRPMData, setARLRPMData] = useState<ARLData[]>([]);
  const [arlRPSData, setARLRPSData] = useState<ARLData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadARLRPMData = (logContent: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Parsing ARL RPM data, content length:', logContent.length);
      console.log('Sample content:', logContent.substring(0, 100));
      
      const parsedData = parseARLRPMData(logContent);
      console.log('Parsed ARL RPM data:', parsedData);
      
      setARLRPMData(parsedData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error parsing ARL RPM data:', err);
      setError(`Error parsing ARL RPM data: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  const uploadARLRPSData = (logContent: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Parsing ARL RPS data, content length:', logContent.length);
      console.log('Sample RPS content:', logContent.substring(0, 100));
      
      const parsedData = parseARLRPSData(logContent);
      console.log('Parsed ARL RPS data:', parsedData);
      
      setARLRPSData(parsedData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error parsing ARL RPS data:', err);
      setError(`Error parsing ARL RPS data: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  return {
    arlRPMData,
    arlRPSData,
    loading,
    error,
    uploadARLRPMData,
    uploadARLRPSData
  };
}