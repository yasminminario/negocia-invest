import React, { useState } from 'react';

export const ScoreSection: React.FC = () => {
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return (
      <div className="flex w-full flex-col items-stretch mt-6 px-4">
        <button 
          onClick={() => setIsHidden(false)}
          className="flex items-center gap-2 text-sm text-[#4A4A55] font-normal justify-center"
        >
          <span className="font-bold">Mostrar</span>
          <img
            src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/ca46812622b3912776f4f9c67be85d901ba5739b?placeholderIfAbsent=true"
            className="aspect-[3/2] object-contain w-6 fill-[#4A4A55] self-stretch shrink-0 my-auto transform rotate-180"
            alt="Show"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-stretch mt-6 px-4">
      <button 
        onClick={() => setIsHidden(true)}
        className="flex items-center gap-2 text-sm text-[#4A4A55] font-normal justify-center"
      >
        <span className="font-bold">Ocultar</span>
        <img
          src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/ca46812622b3912776f4f9c67be85d901ba5739b?placeholderIfAbsent=true"
          className="aspect-[3/2] object-contain w-6 fill-[#4A4A55] self-stretch shrink-0 my-auto"
          alt="Hide"
        />
      </button>
      
      <div className="flex h-[130px] w-full flex-col items-center text-sm text-black font-normal text-center mt-4">
        <img
          src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/2b98d227c832ce2d39aaaa02aea3754e5e93465e?placeholderIfAbsent=true"
          className="aspect-[2] object-contain w-[210px] max-w-full"
          alt="Credit score visualization"
        />
        <div className="w-32 max-w-full mt-1">
          <div className="text-black">Estamos quase lá...</div>
        </div>
      </div>
      
      <div className="flex w-full items-center gap-4 justify-center mt-4">
        <div className="self-stretch flex flex-col overflow-hidden items-center font-normal justify-center flex-1 shrink basis-[0%] my-auto">
          <div className="flex items-center gap-1 text-sm text-[#4A4A55] justify-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/d3dc0d39f125a35945ce6cae69e2db8ffd8c5091?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
              alt="Balance icon"
            />
            <div className="text-[#4A4A55] self-stretch my-auto">Saldo em conta</div>
          </div>
          <div className="flex items-center gap-1 text-[22px] text-black justify-center mt-2">
            <div className="text-black self-stretch my-auto">
              <span className="font-bold text-base leading-[19px]">R$</span>
              <span className="font-bold">972,18</span>
            </div>
          </div>
        </div>
        
        <div className="self-stretch flex flex-col items-center justify-center flex-1 shrink basis-[0%] my-auto">
          <div className="flex items-center gap-1 text-sm text-[#4A4A55] font-normal justify-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/d9a2796f5d7eeb812b0602e933edc347f6a10f3b?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
              alt="Payment icon"
            />
            <div className="text-[#4A4A55] self-stretch my-auto">Próxima parcela</div>
          </div>
          <div className="flex gap-2 justify-center mt-2">
            <div className="text-black text-lg font-semibold w-[97px]">
              <span className="font-bold text-base leading-[19px]">R$</span>
              <span className="font-bold text-[22px] leading-[27px]">594,41</span>
            </div>
            <div className="text-[#4A4A55] text-sm font-bold">14/11</div>
          </div>
        </div>
      </div>
      
      <button className="text-[#4A4A55] text-center text-sm font-normal mt-4 underline">
        Ver mais
      </button>
    </div>
  );
};
