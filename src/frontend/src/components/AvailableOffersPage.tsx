import React, { useState } from 'react';
import { SearchAndFilter } from './SearchAndFilter';
import { LoanCard } from './LoanCard';

export const AvailableOffersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleFilter = () => {
    // Implement filter logic here
    console.log('Filter clicked');
  };

  return (
    <div className="h-full w-full overflow-hidden bg-[#F5F8FE]">      
      <main className="items-stretch flex w-full flex-col overflow-hidden flex-1 bg-white mt-8 pt-6 pb-[34px] px-4 rounded-[30px_30px_0_0]">
        <div className="flex w-full items-center gap-2 text-[28px] font-normal justify-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/8a995a15982d2c207ea0a9f60386d15d7759fc9f?placeholderIfAbsent=true"
            className="aspect-[1/1] object-contain w-6 self-stretch shrink-0 my-auto"
            alt="Offers icon"
          />
          <h1 className="self-stretch my-auto">
            <span className="font-bold text-[#57D9FF]">Ofertas disponíveis</span>
          </h1>
        </div>
        
        <SearchAndFilter onSearch={handleSearch} onFilter={handleFilter} />
        
        <section className="mt-6">
          <LoanCard
            company="QI Tech"
            score={983}
            type="negotiable"
            interestRate="1,5% a.m."
            period="48 m"
            monthlyPayment="R$5.642,50"
            total="R$270.840"
            offeredValue="R$192.000"
            iconBg="bg-[rgba(155,89,182,0.16)]"
            iconColor="#9B59B6"
            rateColor="text-[#57D9FF]"
          />
        </section>
        
        <div className="self-center flex items-center gap-1 text-sm text-[#D1D1D1] font-normal text-center mt-6">
          <img
            src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/ff618ac4e00001a08299f0889c2068f251e40331?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
            alt="End icon"
          />
          <div className="text-[#D1D1D1] self-stretch my-auto">Acaba aqui</div>
        </div>
      </main>
    </div>
  );
};
