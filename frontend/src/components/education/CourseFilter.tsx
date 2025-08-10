'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CourseFilterProps {
  categories: Category[];
}

export function CourseFilter({ categories }: CourseFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');

  const updateFilters = (newSearch?: string, newCategory?: string, newDifficulty?: string) => {
    const params = new URLSearchParams();
    
    const searchValue = newSearch !== undefined ? newSearch : search;
    const categoryValue = newCategory !== undefined ? newCategory : category;
    const difficultyValue = newDifficulty !== undefined ? newDifficulty : difficulty;
    
    if (searchValue) params.set('search', searchValue);
    if (categoryValue) params.set('category', categoryValue);
    if (difficultyValue) params.set('difficulty', difficultyValue);
    
    router.push(`/education?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    router.push('/education');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search);
  };

  const difficultyOptions = [
    { value: 'BEGINNER', label: '入门' },
    { value: 'INTERMEDIATE', label: '进阶' },
    { value: 'ADVANCED', label: '高级' }
  ];

  const hasActiveFilters = search || category || difficulty;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索课程..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </form>

        {/* Category Filter */}
        <div className="lg:w-48">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              updateFilters(undefined, e.target.value);
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">所有分类</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="lg:w-32">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              updateFilters(undefined, undefined, e.target.value);
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">所有难度</option>
            {difficultyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              搜索: {search}
              <button
                onClick={() => {
                  setSearch('');
                  updateFilters('');
                }}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          {category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              分类: {categories.find(c => c.id === category)?.name}
              <button
                onClick={() => {
                  setCategory('');
                  updateFilters(undefined, '');
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {difficulty && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              难度: {difficultyOptions.find(d => d.value === difficulty)?.label}
              <button
                onClick={() => {
                  setDifficulty('');
                  updateFilters(undefined, undefined, '');
                }}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}