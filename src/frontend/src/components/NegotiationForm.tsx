import React, { useState } from 'react';

type NegotiationUserType = 'borrower' | 'investor';

export interface NegotiationFormData {
  interestRate: number;
  description: string;
  userType: NegotiationUserType;
}

interface NegotiationFormProps {
  userType: NegotiationUserType;
  currentRate: string;
  proposedRate: string;
  onSubmit?: (data: NegotiationFormData) => void;
}

export const NegotiationForm: React.FC<NegotiationFormProps> = ({
  userType,
  currentRate,
  proposedRate,
  onSubmit
}) => {
  const [interestRate, setInterestRate] = useState<number>(1.38);
  const [description, setDescription] = useState<string>('');

  const primaryColor = userType === 'borrower' ? '#57D9FF' : '#9B59B6';
  const maxRate = 10;
  const minRate = 1.1;
  const suggestedZoneStart = 1.3;
  const suggestedZoneEnd = 1.6;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.({
      interestRate,
      description,
      userType
    });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    if (!Number.isNaN(value)) {
      setInterestRate(value);
    }
  };

  const sliderPosition = ((interestRate - minRate) / (maxRate - minRate)) * 100;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="justify-center items-stretch border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex w-full flex-col p-4 rounded-xl border-solid"
        style={{ backgroundColor: `${primaryColor}16`, borderColor: primaryColor }}>
        <div className="text-[#4A4A55] text-lg font-semibold">
          Qual seria a taxa de juros ideal?
        </div>

        <div className="w-full mt-4">
          <div className="flex w-full items-center gap-2.5 text-[22px] font-normal justify-center"
            style={{ color: primaryColor }}>
            <div className="self-stretch my-auto">
              <span className="font-bold">{interestRate.toFixed(2)}% a. m.</span>
            </div>
          </div>

          <div className="w-full mt-2">
            <div className="w-full pb-2">
              <div className="relative">
                <input
                  type="range"
                  min={minRate}
                  max={maxRate}
                  step={0.01}
                  value={interestRate}
                  onChange={handleRateChange}
                  className="w-full h-6 bg-transparent appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${sliderPosition}%, #28A745 ${sliderPosition}%, #28A745 60%, #D1D1D1 60%, #D1D1D1 100%)`
                  }}
                />
                <div
                  className="absolute top-0 w-5 h-5 rounded-lg border-2 border-white shadow-md"
                  style={{
                    backgroundColor: primaryColor,
                    left: `calc(${sliderPosition}% - 10px)`
                  }}
                >
                  <div className="w-3 h-3 bg-white rounded-full m-0.5" />
                </div>
              </div>
            </div>

            <div className="flex w-full items-center gap-[40px_100px] text-sm text-[#4A4A55] font-normal text-center justify-between">
              <div className="text-[#4A4A55]">{minRate}%</div>
              <div className="text-[#28A745] font-bold">Zona sugerida</div>
              <div className="text-[#4A4A55]">{maxRate}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="justify-center items-stretch shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex w-full flex-col bg-[#F5F8FE] p-4 rounded-xl">
        <label className="text-[#4A4A55] text-lg font-semibold">
          Descrição da proposta
        </label>
        <div className="w-full text-sm font-normal mt-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deixe uma mensagem para o investidor..."
            className="shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] min-h-[84px] w-full italic text-black bg-white p-2 rounded-xl border-none outline-none resize-none"
            maxLength={300}
          />
          <div className="text-[#4A4A55] text-right mt-1">
            {description.length}/300
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="justify-center items-center border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex w-full gap-2 text-white text-lg font-semibold px-12 py-4 rounded-[10000px] border-solid transition-colors hover:opacity-90"
        style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
      >
        <span className="text-white self-stretch my-auto">
          {userType === 'borrower' ? 'Enviar negociação' : 'Enviar contraproposta'}
        </span>
        <img
          src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/810a91b7622f136a3741ea855b16ce8fd3486d86?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
          alt="Send icon"
        />
      </button>
    </form>
  );
};
