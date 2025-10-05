import React, { useState } from 'react';

export const InvestorStats: React.FC = () => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className="flex min-h-[254px] w-full flex-col items-center mt-6">
      <div className="flex min-h-[236px] w-full items-stretch gap-4 justify-center px-4">
        <div className="flex flex-col items-center justify-center flex-1 shrink basis-[0%]">
          <div className="flex flex-col overflow-hidden items-center font-normal justify-center">
            <div className="flex items-center gap-1 text-sm text-[#4A4A55] justify-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/bba259cb0ee25cb6b2bcf75c3589bae73ad3aa95?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                alt="Balance icon"
              />
              <div className="text-[#4A4A55] self-stretch my-auto">Saldo em conta</div>
            </div>
            <div className="flex items-center gap-1 text-[22px] text-black justify-center mt-2">
              <div className="text-black self-stretch my-auto">
                <span className="font-semibold text-lg leading-[22px]">R$</span>
                <span className="font-bold">7.439,51</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center font-normal justify-center mt-6 rounded-xl">
            <div className="flex items-center gap-1 text-sm text-[#4A4A55] justify-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/c779938e9f5c331c6345f79fdf862f39d364cf4e?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                alt="Profit icon"
              />
              <div className="text-[#4A4A55] self-stretch my-auto">Lucro total obtido</div>
            </div>
            <div className="flex items-center gap-1 text-[22px] text-[#28A745] justify-center mt-2">
              <div className="text-[#28A745] self-stretch my-auto">
                <span className="font-bold text-base leading-[19px]">R$</span>
                <span className="font-bold">5.836,21</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center mt-6">
            <div className="flex items-center gap-1 text-sm text-[#4A4A55] font-normal justify-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/7c12727d48fe77b6415afede47c7eadf9ae54f44?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                alt="Return icon"
              />
              <div className="text-[#4A4A55] self-stretch my-auto">Rentabilidade média</div>
            </div>
            <div className="flex items-center gap-1 text-lg text-black font-semibold justify-center mt-2">
              <div className="text-black self-stretch my-auto">
                <span className="font-bold text-[22px] leading-[27px]">5</span>
                <span className="font-normal text-base leading-[19px]">% </span>
                <span className="font-normal text-sm leading-[17px]">a.m.</span>
              </div>
              <img
                src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/2d3871b503c820e756df00bbea5e10dfc0c4432a?placeholderIfAbsent=true"
                className="aspect-[3/2] object-contain w-3 fill-[#28A745] self-stretch shrink-0 my-auto"
                alt="Trend up"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-stretch text-sm text-[#4A4A55] font-normal flex-1 shrink basis-[0%]">
          <div className="flex w-full gap-2 overflow-hidden">
            <button 
              onClick={() => setIsHidden(!isHidden)}
              className="flex items-center gap-2 justify-center"
            >
              <span className="text-[#4A4A55] font-bold">Ocultar</span>
              <img
                src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/ca46812622b3912776f4f9c67be85d901ba5739b?placeholderIfAbsent=true"
                className="aspect-[3/2] object-contain w-6 fill-[#4A4A55] self-stretch shrink-0 my-auto"
                alt="Hide chart"
              />
            </button>
          </div>
          {!isHidden && (
            <img
              src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/2824623c075109da69d93ec2b0bea1fea76fdf39?placeholderIfAbsent=true"
              className="aspect-[0.99] object-contain w-[180px] self-center max-w-full mt-6"
              alt="Investment chart"
            />
          )}
        </div>
      </div>
      
      <button className="text-[#4A4A55] text-center text-sm font-normal underline">
        Ver mais
      </button>
    </div>
  );
};
