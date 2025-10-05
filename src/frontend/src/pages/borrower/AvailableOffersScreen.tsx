import { useState } from "react";

import { LoanCard } from "@/components/LoanCard";
import { SearchAndFilter } from "@/components/SearchAndFilter";

const AvailableOffersScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // TODO: implementar busca real quando backend estiver disponível
    };

    const handleFilter = () => {
        // TODO: implementar filtros quando regras estiverem definidas
        console.log("Filter clicked");
    };

    return (
        <div className="h-full w-full overflow-hidden bg-[#F5F8FE]">
            <main className="mt-8 flex w-full flex-1 flex-col items-stretch overflow-hidden rounded-[30px_30px_0_0] bg-white px-4 pt-6 pb-[34px]">
                <div className="flex w-full items-center justify-center gap-2 text-[28px] font-normal">
                    <img
                        src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/8a995a15982d2c207ea0a9f60386d15d7759fc9f?placeholderIfAbsent=true"
                        className="my-auto aspect-[1/1] w-6 shrink-0 self-stretch object-contain"
                        alt="Offers icon"
                    />
                    <h1 className="my-auto self-stretch">
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

                <div className="mt-6 flex items-center justify-center gap-1 text-center text-sm font-normal text-[#D1D1D1]">
                    <img
                        src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/ff618ac4e00001a08299f0889c2068f251e40331?placeholderIfAbsent=true"
                        className="my-auto aspect-[1] w-4 shrink-0 self-stretch object-contain"
                        alt="End icon"
                    />
                    <div className="my-auto self-stretch text-[#D1D1D1]">Acaba aqui</div>
                </div>
            </main>
        </div>
    );
};

export default AvailableOffersScreen;
