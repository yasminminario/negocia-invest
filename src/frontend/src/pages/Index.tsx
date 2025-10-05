import React, { useState } from 'react';
import { Header } from '@/components/Header';
import BorrowerDashboardScreen from '@/pages/borrower/DashboardScreen';
import InvestorDashboardScreen from '@/pages/investor/DashboardScreen';
import AvailableOffersScreen from '@/pages/borrower/AvailableOffersScreen';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { LoanCard } from '@/components/LoanCard';
import { StatusBadge } from '@/components/StatusBadge';
import { NegotiationForm } from '@/components/NegotiationForm';

const Index = () => {
  const [userType, setUserType] = useState<'borrower' | 'investor'>('borrower');
  const [currentView, setCurrentView] = useState<'dashboard' | 'offers' | 'requests' | 'active-loans' | 'negotiations' | 'details' | 'negotiation-form'>('dashboard');

  const handleUserTypeChange = (type: 'borrower' | 'investor') => {
    setUserType(type);
    setCurrentView('dashboard');
  };

  const renderDashboard = () => (
    <div className="max-w-[480px] w-full mx-auto">
      <div className="min-h-[926px] w-full overflow-hidden bg-[#F5F8FE]">
        <Header userType={userType} onUserTypeChange={handleUserTypeChange} />
        {userType === 'borrower' ? <BorrowerDashboardScreen /> : <InvestorDashboardScreen />}
      </div>
    </div>
  );

  const renderAvailableOffers = () => (
    <div className="max-w-[480px] w-full mx-auto">
      <AvailableOffersScreen />
    </div>
  );

  const renderAvailableRequests = () => (
    <div className="max-w-[480px] w-full mx-auto">
      <div className="min-h-[926px] w-full overflow-hidden bg-[#F5F8FE]">
        <main className="items-stretch flex w-full flex-col overflow-hidden flex-1 bg-white mt-8 pt-6 pb-[34px] px-4 rounded-[30px_30px_0_0]">
          <div className="flex w-full items-center gap-2 text-[28px] font-normal justify-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/aeae9a9ad490b3c8b59d4533f77a3b6559060a0e?placeholderIfAbsent=true"
              className="aspect-[3/2] object-contain w-9 self-stretch shrink-0 my-auto"
              alt="Requests icon"
            />
            <h1 className="self-stretch my-auto">
              <span className="font-bold text-[#9B59B6]">Solicitações disponíveis</span>
            </h1>
          </div>

          <SearchAndFilter />

          <section className="mt-6">

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
    </div>
  );

  const renderActiveLoans = () => (
    <div className="max-w-[480px] w-full mx-auto">
      <div className="min-h-[926px] w-full overflow-hidden bg-[#F5F8FE]">
        <main className="items-stretch flex w-full flex-col overflow-hidden flex-1 bg-white mt-8 pt-6 pb-[34px] px-4 rounded-[30px_30px_0_0]">
          <div className="flex w-full items-center gap-2 text-[28px] font-normal justify-center">
            <img
              src={userType === 'borrower'
                ? "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/bd2bfec8a7cbed657af543cee7f94b92423e4237?placeholderIfAbsent=true"
                : "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/b34e1b005d6be6558594c769bb0deb8ecb2251ae?placeholderIfAbsent=true"
              }
              className="aspect-[1/1] object-contain w-6 self-stretch shrink-0 my-auto"
              alt="Active loans icon"
            />
            <h1 className="self-stretch my-auto">
              <span className="font-bold" style={{ color: userType === 'borrower' ? '#57D9FF' : '#9B59B6' }}>
                Empréstimos ativos
              </span>
            </h1>
          </div>

          <SearchAndFilter />

          <section className="w-full mt-6 space-y-4">
            <LoanCard
              company={userType === 'borrower' ? 'QI Tech' : 'Alberto N. Silva'}
              score={userType === 'borrower' ? 983 : 597}
              type="active"
              interestRate="1,5% a.m."
              period={userType === 'borrower' ? '48 m' : '12 m'}
              monthlyPayment={userType === 'borrower' ? 'R$5.642,50' : 'R$912,69'}
              total={userType === 'borrower' ? 'R$270.840' : 'R$10.952,28'}
              offeredValue={userType === 'borrower' ? 'R$192.000' : 'R$10.000'}
              iconBg={userType === 'borrower' ? 'bg-[rgba(155,89,182,0.16)]' : 'bg-[rgba(87,217,255,0.16)]'}
              iconColor={userType === 'borrower' ? '#9B59B6' : '#57D9FF'}
              rateColor={userType === 'borrower' ? 'text-[#57D9FF]' : 'text-[#9B59B6]'}
            />

            {userType === 'borrower' && (
              <LoanCard
                company="QI Tech"
                score={983}
                type="cancelled"
                interestRate="1,5% a.m."
                period="48 m"
                monthlyPayment="R$5.642,50"
                total="R$270.840"
                offeredValue="R$192.000"
                iconBg="bg-[rgba(155,89,182,0.16)]"
                iconColor="#9B59B6"
                rateColor="text-[#57D9FF]"
              />
            )}

            {userType === 'investor' && (
              <LoanCard
                company="Alberto N. Silva"
                score={597}
                type="completed"
                interestRate="1,5% a.m."
                period="12 m"
                monthlyPayment="R$912,69"
                total="R$10.952,28"
                offeredValue="R$10.000"
                iconBg="bg-[rgba(87,217,255,0.16)]"
                iconColor="#57D9FF"
                rateColor="text-[#9B59B6]"
              />
            )}
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
    </div>
  );

  const renderNegotiations = () => (
    <div className="max-w-[480px] w-full mx-auto">
      <div className="min-h-[926px] w-full overflow-hidden bg-[#F5F8FE]">
        <main className="items-stretch flex w-full flex-col overflow-hidden flex-1 bg-white mt-8 pt-6 pb-[34px] px-4 rounded-[30px_30px_0_0]">
          <div className="flex w-full items-center gap-2 text-[28px] font-normal justify-center">
            <img
              src={userType === 'borrower'
                ? "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/d34453aff8796550b4b37d9a92cca87a0ae1bba9?placeholderIfAbsent=true"
                : "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/ea62c88e290c7f1d57ad9277e9a0072468780220?placeholderIfAbsent=true"
              }
              className="aspect-[17/12] object-contain w-[34px] self-stretch shrink-0 my-auto"
              alt="Negotiations icon"
            />
            <h1 className="self-stretch my-auto">
              <span className="font-bold" style={{ color: userType === 'borrower' ? '#57D9FF' : '#9B59B6' }}>
                Negociações ativas
              </span>
            </h1>
          </div>

          <SearchAndFilter />

          <section className="mt-6">
            <div className="shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] w-full overflow-hidden bg-[#F5F8FE] p-4 rounded-2xl">
              <div className="flex w-full gap-[40px_99px] justify-between">
                <div className="flex items-center gap-2">
                  <div className={`justify-center items-center aspect-[1/1] self-stretch flex min-h-10 flex-col overflow-hidden w-10 h-10 ${userType === 'borrower' ? 'bg-[rgba(155,89,182,0.16)]' : 'bg-[rgba(87,217,255,0.16)]'} my-auto px-px rounded-[1000px]`}>
                    <img
                      src={userType === 'borrower'
                        ? "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/eb28d6e92877d2283ac4c144ba3ba4a9a8411a1d?placeholderIfAbsent=true"
                        : "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/793849a31fbc1a2249de6d233fba5a86dd2c80f4?placeholderIfAbsent=true"
                      }
                      className="aspect-[19/16] object-contain w-[19px]"
                      alt="Company icon"
                    />
                  </div>
                  <div className="self-stretch flex flex-col items-stretch font-normal justify-center my-auto">
                    <div className="text-black text-base">
                      {userType === 'borrower' ? 'QI Tech' : 'Alberto N. Silva'}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#4A4A55] whitespace-nowrap justify-center mt-1">
                      <img
                        src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/a4e62d641c818a977118da7d2604ecccfedbed25?placeholderIfAbsent=true"
                        className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                        alt="Score icon"
                      />
                      <div className="text-[#4A4A55] self-stretch my-auto">
                        {userType === 'borrower' ? '983' : '597'}
                      </div>
                    </div>
                  </div>
                </div>
                <StatusBadge status="negotiating" className="w-[157px]" />
              </div>

              <div className="flex w-full items-center gap-[40px_58px] justify-between mt-4">
                <div className="self-stretch flex flex-col items-stretch justify-center my-auto">
                  <div className="text-[#4A4A55] text-sm font-normal">Taxa de juros</div>
                  <div className={`${userType === 'borrower' ? 'text-[#57D9FF]' : 'text-[#9B59B6]'} text-lg font-semibold mt-2`}>
                    1,5% a.m.
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-center justify-center my-auto">
                  <div className="text-[#4A4A55] text-sm font-normal">Período</div>
                  <div className="text-black text-lg font-semibold mt-2">
                    {userType === 'borrower' ? '48 m' : '12 m'}
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-stretch justify-center my-auto">
                  <div className="text-[#4A4A55] text-sm font-normal">Parcela mensal</div>
                  <div className="text-black text-lg font-semibold mt-2">
                    {userType === 'borrower' ? 'R$5.642,50' : 'R$912,69'}
                  </div>
                </div>
              </div>

              <div className="justify-between items-center flex w-full gap-[40px_66px] text-sm text-black font-normal mt-4 py-4 border-y-[#D1D1D1] border-t border-solid border-b">
                <div className="self-stretch flex items-center gap-2 my-auto">
                  <div className="text-black self-stretch my-auto">
                    <span className="text-[#4A4A55]">Total:</span>{' '}
                    <span className="font-bold">
                      {userType === 'borrower' ? 'R$270.840' : 'R$10.952,28'}
                    </span>
                  </div>
                </div>
                <div className="self-stretch flex items-center gap-2 my-auto">
                  <div className="text-black self-stretch my-auto">
                    Valor ofertado:{' '}
                    <span className="font-bold">
                      {userType === 'borrower' ? 'R$192.000' : 'R$10.000'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center gap-[40px_98px] justify-between mt-4">
                <div className="text-[#4A4A55] text-sm font-normal self-stretch my-auto">
                  <span className="font-bold">Tempo restante de negociação:</span>
                </div>
                <div className={`text-center text-lg font-semibold self-stretch my-auto ${userType === 'borrower' ? 'text-[#57D9FF]' : 'text-[#9B59B6]'}`}>
                  47:51
                </div>
              </div>
            </div>
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
    </div>
  );

  const renderOfferDetails = () => (
    <div className="max-w-[480px] w-full mx-auto">
      <div className="min-h-[926px] w-full overflow-hidden bg-[#F5F8FE]">
        <main className="w-full overflow-hidden flex-1 bg-white mt-8 px-4 py-6 rounded-[30px_30px_0_0]">
          <div className="flex w-full items-center gap-2 text-[28px] font-normal justify-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/d75d3be72415a35575eb9a567ff8e5936cced0ad?placeholderIfAbsent=true"
              className="aspect-[1/1] object-contain w-6 self-stretch shrink-0 my-auto"
              alt="Details icon"
            />
            <h1 className="self-stretch my-auto">
              <span className="font-bold text-[#57D9FF]">Detalhes da oferta</span>
            </h1>
          </div>

          <section className="flex w-full flex-col items-stretch mt-6">
            <div className="w-full">
              <div className="flex w-full items-center gap-[40px_100px] justify-between">
                <div className="self-stretch flex items-center gap-2 my-auto">
                  <div className="justify-center items-center aspect-[1/1] self-stretch flex min-h-10 flex-col overflow-hidden w-10 h-10 bg-[rgba(155,89,182,0.16)] my-auto px-px rounded-[1000px]">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/eb28d6e92877d2283ac4c144ba3ba4a9a8411a1d?placeholderIfAbsent=true"
                      className="aspect-[19/16] object-contain w-[19px]"
                      alt="Company icon"
                    />
                  </div>
                  <div className="self-stretch flex flex-col items-stretch text-base text-black font-normal justify-center my-auto">
                    <div className="text-black">QI Tech</div>
                  </div>
                </div>
                <StatusBadge status="negotiable" />
              </div>

              <div className="flex w-full items-center gap-[40px_74px] justify-between mt-4">
                <div className="self-stretch flex flex-col items-stretch justify-center my-auto">
                  <div className="text-[#4A4A55] text-sm font-normal">Taxa de juros</div>
                  <div className="text-[#57D9FF] text-lg font-semibold mt-2">1,5% a.m.</div>
                </div>
                <div className="self-stretch flex flex-col items-center justify-center my-auto">
                  <div className="text-[#4A4A55] text-sm font-normal">Período</div>
                  <div className="text-black text-lg font-semibold mt-2">48 m</div>
                </div>
                <div className="self-stretch flex flex-col items-stretch justify-center my-auto">
                  <div className="text-[#4A4A55] text-sm font-normal">Parcela mensal</div>
                  <div className="text-black text-lg font-semibold mt-2">R$5.642,50</div>
                </div>
              </div>

              <div className="justify-between items-center flex w-full gap-[40px_85px] text-sm text-black font-normal mt-4 pt-4 border-t-[#D1D1D1] border-t border-solid">
                <div className="self-stretch flex items-center gap-2 my-auto">
                  <div className="text-black self-stretch my-auto">
                    <span className="text-[#4A4A55]">Total:</span>{' '}
                    <span className="font-bold">R$270.840</span>
                  </div>
                </div>
                <div className="self-stretch flex items-center gap-2 my-auto">
                  <div className="text-black self-stretch my-auto">
                    Valor ofertado:{' '}
                    <span className="font-bold">R$192.00,00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="self-center flex max-w-full w-[396px] items-center gap-[-8px] justify-center mt-6">
              <div className="self-stretch w-44 flex-1 shrink basis-[0%] my-auto pr-[7px]">
                <div className="flex w-full flex-col items-stretch justify-center">
                  <div className="flex items-center gap-2 text-lg text-black font-semibold whitespace-nowrap justify-center">
                    <div className="text-black self-stretch my-auto">R$75.879,97</div>
                  </div>
                  <div className="flex w-full items-center gap-1 text-sm text-[#4A4A55] font-normal mt-1">
                    <div className="aspect-[1/1] self-stretch flex w-3.5 shrink-0 h-3.5 gap-2.5 bg-[#9B59B6] my-auto rounded-[10000px]" />
                    <div className="text-[#4A4A55] self-stretch my-auto">Juros totais</div>
                  </div>
                </div>

                <div className="flex w-full flex-col justify-center mt-6">
                  <div className="flex items-center gap-2 text-lg text-black font-semibold whitespace-nowrap justify-center">
                    <div className="text-black self-stretch my-auto">R$192.00,00</div>
                    <img
                      src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/70ab7398de2fe3ffd83449e5adc65b2f3cc6043f?placeholderIfAbsent=true"
                      className="aspect-[1/1] object-contain w-2 self-stretch shrink-0 my-auto"
                      alt="Arrow"
                    />
                  </div>
                  <div className="flex w-[116px] max-w-full items-center gap-1 text-sm text-[#4A4A55] font-normal mt-1">
                    <div className="aspect-[1/1] self-stretch flex w-3.5 shrink-0 h-3.5 gap-2.5 bg-[#57D9FF] my-auto rounded-[100000px]" />
                    <div className="text-[#4A4A55] self-stretch my-auto">Valor principal</div>
                  </div>
                </div>

                <div className="flex flex-col items-stretch justify-center mt-6">
                  <div className="text-black text-lg font-semibold">R$2.960,03</div>
                  <div className="flex items-center gap-1 text-sm text-[#4A4A55] font-normal mt-1">
                    <div className="aspect-[1/1] self-stretch flex w-3.5 shrink-0 h-3.5 gap-2.5 bg-[#2753B5] my-auto rounded-[100000px]" />
                    <div className="text-[#4A4A55] self-stretch my-auto">Taxa de intermediação</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="items-stretch flex w-full flex-col pt-4 border-t-[#D1D1D1] border-t border-solid mt-6">
              <div className="flex items-center gap-2 text-lg text-black font-semibold justify-center">
                <h3 className="self-stretch my-auto">
                  Detalhes do <span className="text-[#9B59B6]">Investidor</span>
                </h3>
              </div>

              <div className="w-full text-sm font-normal mt-4 space-y-2">
                <div className="flex w-full items-center gap-[40px_100px] justify-between">
                  <div className="self-stretch flex items-center gap-1 text-[#4A4A55] whitespace-nowrap justify-center my-auto">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/a4e62d641c818a977118da7d2604ecccfedbed25?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                      alt="Score icon"
                    />
                    <div className="text-[#4A4A55] self-stretch my-auto">Pontuação</div>
                  </div>
                  <div className="text-black self-stretch my-auto font-bold">983</div>
                </div>

                <div className="flex w-full items-center gap-[40px_100px] justify-between">
                  <div className="self-stretch flex items-center gap-1 text-[#4A4A55] justify-center my-auto">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/c19844f8aaf7d747bb2173c89be92a422a263be4?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                      alt="Time icon"
                    />
                    <div className="text-[#4A4A55] self-stretch my-auto">Tempo de conta</div>
                  </div>
                  <div className="text-black self-stretch my-auto font-bold">2 meses</div>
                </div>

                <div className="flex w-full items-center gap-[40px_100px] justify-between">
                  <div className="self-stretch flex items-center gap-1 text-[#4A4A55] justify-center my-auto">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/7825619c9b23dbf412617df37daef0dde8458ade?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                      alt="Response time icon"
                    />
                    <div className="text-[#4A4A55] self-stretch my-auto">Tempo médio de resposta</div>
                  </div>
                  <div className="text-black self-stretch my-auto font-bold">2 horas</div>
                </div>

                <div className="flex w-full items-center gap-[40px_100px] justify-between">
                  <div className="self-stretch flex items-center gap-1 text-[#4A4A55] justify-center my-auto">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/0c7b178724a7213402460b1b534688a9836d4d6f?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                      alt="Loans icon"
                    />
                    <div className="text-[#4A4A55] self-stretch my-auto">Empréstimos realizados</div>
                  </div>
                  <div className="text-black self-stretch my-auto font-bold">5 empréstimos</div>
                </div>

                <div className="flex w-full items-center gap-[40px_100px] justify-between">
                  <div className="self-stretch flex items-center gap-1 text-[#4A4A55] justify-center my-auto">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/1336a77ea239b2a144270148af1d2aea4583f7cf?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                      alt="Approval rate icon"
                    />
                    <div className="text-[#4A4A55] self-stretch my-auto">Taxa de aprovação</div>
                  </div>
                  <div className="text-black self-stretch my-auto font-bold">93%</div>
                </div>
              </div>
            </div>
          </section>

          <div className="w-full text-lg font-semibold flex-1 mt-6 space-y-4">
            <button className="justify-center items-center border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex w-full gap-2 text-white bg-[#57D9FF] px-12 py-4 rounded-[10000px] border-solid border-[#57D9FF] transition-colors hover:opacity-90">
              <span className="text-white self-stretch my-auto">Aceitar esta oferta</span>
              <img
                src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/b346d1b1411368094641738110a16fbe46c6e6c4?placeholderIfAbsent=true"
                className="aspect-[10/7] object-contain w-5 self-stretch shrink-0 my-auto"
                alt="Accept icon"
              />
            </button>

            <button
              onClick={() => setCurrentView('negotiation-form')}
              className="justify-center items-center border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex w-full gap-2 text-[#57D9FF] bg-[rgba(87,217,255,0.16)] px-12 py-4 rounded-[10000px] border-solid border-[#57D9FF] transition-colors hover:opacity-80"
            >
              <span className="text-[#57D9FF] self-stretch my-auto">Iniciar negociação</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );

  const renderNegotiationForm = () => (
    <div className="max-w-[480px] w-full mx-auto">
      <div className="items-stretch flex w-full flex-col overflow-hidden bg-[#F5F8FE]">
        <main className="self-center w-full overflow-hidden bg-white mt-8 px-4 py-6 rounded-[30px_30px_0_0]">
          <div className="flex w-full items-center gap-2 text-[28px] font-normal justify-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/70f368297558cece443f8f7d886c5f594a6fded8?placeholderIfAbsent=true"
              className="aspect-[17/12] object-contain w-[34px] self-stretch shrink-0 my-auto"
              alt="Negotiation icon"
            />
            <h1 className="self-stretch my-auto">
              <span className="font-bold text-[#57D9FF]">Iniciar negociação</span>
            </h1>
          </div>

          <div className="w-full mt-6 space-y-4">
            <div className="justify-between items-center shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex w-full gap-[40px_100px] bg-[#F5F8FE] p-4 rounded-xl">
              <div className="text-[#4A4A55] text-base font-normal self-stretch my-auto">
                <span className="font-bold">Valor ofertado:</span>
              </div>
              <div className="text-[#57D9FF] text-center text-lg font-semibold self-stretch my-auto">
                R$192.000,00
              </div>
            </div>

            <div className="flex w-full items-stretch gap-4 text-lg font-semibold">
              <div className="shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] min-h-[101px] flex-1 shrink basis-[0%] bg-[#F5F8FE] p-4 rounded-xl">
                <div className="text-black">
                  <span className="font-bold text-base leading-[19px] text-[#4A4A55]">Oferta do</span>{' '}
                  <span className="text-[#9B59B6]">Investidor</span>
                </div>
                <div className="text-black mt-2">
                  <span className="font-bold text-sm leading-[17px] text-[#4A4A55]">Juros:</span>{' '}
                  <span className="font-bold text-base leading-[19px]">1,5% </span>
                  <span className="font-normal text-sm leading-[17px]">a.m.</span>
                </div>
              </div>

              <div className="border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex-1 shrink basis-[0%] bg-[rgba(87,217,255,0.16)] p-4 rounded-xl border-solid border-[#57D9FF]">
                <div className="text-[#4A4A55]">
                  <span className="font-bold text-base leading-[19px]">Sua Proposta</span>
                </div>
                <div className="text-black mt-[31px]">
                  <span className="font-bold text-sm leading-[17px] text-[#4A4A55]">Juros: </span>
                  <span className="font-bold text-base leading-[19px] text-[#57D9FF]">1,38% </span>
                  <span className="font-normal text-sm leading-[17px] text-[#4A4A55]">a.m.</span>
                </div>
              </div>
            </div>

            <div className="items-stretch shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex w-full flex-col bg-[#F5F8FE] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-lg text-[#4A4A55] font-semibold justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/3e768378763f59268a0cfb9f0c55b0f9ba7dac09?placeholderIfAbsent=true"
                  className="aspect-[17/18] object-contain w-[17px] self-stretch shrink-0 my-auto"
                  alt="Payment icon"
                />
                <div className="text-[#4A4A55] self-stretch my-auto">Parcela mensal</div>
              </div>

              <div className="w-full max-w-[364px] mt-4">
                <div className="flex w-full items-center gap-[40px_100px] text-base text-[#4A4A55] font-normal whitespace-nowrap justify-between">
                  <div className="text-[#4A4A55] self-stretch my-auto">Atual:</div>
                  <div className="text-[#4A4A55] text-center self-stretch my-auto">R$5.642,50</div>
                </div>
                <div className="flex w-full items-center gap-[40px_100px] text-lg font-semibold justify-between mt-2">
                  <div className="text-[#4A4A55] self-stretch my-auto">Sua proposta:</div>
                  <div className="text-[#57D9FF] text-center self-stretch my-auto">R$5.493,50</div>
                </div>
              </div>
            </div>

            <div className="items-stretch shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex w-full flex-col bg-[#F5F8FE] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-lg text-[#4A4A55] font-semibold justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/759f7f115d8e379277230a3964e85c40047dfce2?placeholderIfAbsent=true"
                  className="aspect-[23/14] object-contain w-[23px] self-stretch shrink-0 my-auto"
                  alt="Total icon"
                />
                <div className="text-[#4A4A55] self-stretch my-auto">Valor total do empréstimo</div>
              </div>

              <div className="w-full max-w-[364px] mt-4">
                <div className="flex w-full items-center gap-[40px_100px] text-base text-[#4A4A55] font-normal whitespace-nowrap justify-between">
                  <div className="text-[#4A4A55] self-stretch my-auto">Atual:</div>
                  <div className="text-[#4A4A55] text-center self-stretch my-auto">R$270.840</div>
                </div>
                <div className="flex w-full items-center gap-[40px_100px] text-lg font-semibold justify-between mt-2">
                  <div className="text-[#4A4A55] self-stretch my-auto">Sua proposta:</div>
                  <div className="text-[#57D9FF] text-center self-stretch my-auto">R$263.688</div>
                </div>
              </div>
            </div>

            <div className="justify-between items-center border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex w-full gap-[40px_100px] text-[#28A745] bg-[rgba(40,167,69,0.16)] px-4 py-2 rounded-xl border-solid border-[#28A745]">
              <div className="self-stretch flex items-center gap-1 text-sm font-normal justify-center my-auto">
                <img
                  src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/0a144c369419f57cf140f9560eab051b121f63dc?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                  alt="Savings icon"
                />
                <div className="text-[#28A745] self-stretch my-auto font-bold">
                  Economia total estimada:
                </div>
              </div>
              <div className="text-[#28A745] text-center text-lg font-semibold self-stretch my-auto">
                R$7.152
              </div>
            </div>

            <NegotiationForm
              userType="borrower"
              currentRate="1,5%"
              proposedRate="1,38%"
              onSubmit={(data) => {
                console.log('Negotiation submitted:', data);
                setCurrentView('dashboard');
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'offers':
        return renderAvailableOffers();
      case 'requests':
        return renderAvailableRequests();
      case 'active-loans':
        return renderActiveLoans();
      case 'negotiations':
        return renderNegotiations();
      case 'details':
        return renderOfferDetails();
      case 'negotiation-form':
        return renderNegotiationForm();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}

      {/* Navigation buttons for demo purposes */}
      <div className="max-w-[480px] w-full mx-auto bg-white p-4 space-y-2">
        <h3 className="text-lg font-semibold mb-4">Navegação de Demo:</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('offers')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Ofertas
          </button>
          <button
            onClick={() => setCurrentView('requests')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
          >
            Solicitações
          </button>
          <button
            onClick={() => setCurrentView('active-loans')}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
          >
            Empréstimos Ativos
          </button>
          <button
            onClick={() => setCurrentView('negotiations')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Negociações
          </button>
          <button
            onClick={() => setCurrentView('details')}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
          >
            Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
