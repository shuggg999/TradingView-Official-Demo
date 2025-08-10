'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchResult } from '@/lib/services/market-data/types';

interface StockSearchProps {
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export const StockSearch: React.FC<StockSearchProps> = ({
  onSelect,
  placeholder = '搜索股票代码或公司名称...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 防抖搜索
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/market/search?q=${encodeURIComponent(query)}&limit=10`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setResults(data.data);
          setShowResults(true);
        } else {
          setResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // 点击外部关闭结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.symbol);
    setShowResults(false);
    setSelectedIndex(-1);
    onSelect?.(result);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {showResults && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((result, index) => (
                <li
                  key={`${result.symbol}-${index}`}
                  className={`px-3 py-2 cursor-pointer text-sm ${
                    index === selectedIndex
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{result.symbol}</div>
                      <div className="text-gray-500 truncate">{result.name}</div>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      <div>{result.exchange}</div>
                      <div>{result.type}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.trim().length >= 2 && !loading ? (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              未找到相关股票
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};