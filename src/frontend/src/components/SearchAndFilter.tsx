import React, { useState } from 'react';

interface SearchAndFilterProps {
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="flex w-full gap-2 text-sm text-black font-normal whitespace-nowrap mt-6">
      <div className="items-center shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex min-w-60 gap-2 overflow-hidden flex-1 shrink basis-4 bg-[#F5F8FE] p-2 rounded-lg">
        <img
          src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/cc00be9bbacf2f4c466fcd486804177e07ad01a0?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
          alt="Search icon"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Pesquisar"
          className="self-stretch my-auto bg-transparent border-none outline-none flex-1"
        />
      </div>
      <button 
        onClick={onFilter}
        className="justify-center items-center shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex gap-2 overflow-hidden bg-[#F5F8FE] px-4 py-2 rounded-lg hover:bg-[#E8F2FE] transition-colors"
      >
        <img
          src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/f73649f2cfd0c04eebb61a1b9674ce054d2f0452?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
          alt="Filter icon"
        />
        <span className="self-stretch my-auto">Filtrar</span>
      </button>
    </div>
  );
};
