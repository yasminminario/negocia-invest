import React from 'react';

interface StatusBadgeProps {
  status: 'negotiable' | 'fixed' | 'active' | 'cancelled' | 'completed' | 'negotiating';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'negotiable':
        return {
          text: 'Negociável',
          textColor: 'text-[#28A745]',
          bgColor: 'bg-[rgba(40,167,69,0.16)]',
          borderColor: 'border-[#28A745]',
          icon: 'https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/8c3eff942c97679f03a96081e4a8c40d3b545d18?placeholderIfAbsent=true'
        };
      case 'fixed':
        return {
          text: 'Fixo',
          textColor: 'text-[#DC3545]',
          bgColor: 'bg-[rgba(220,53,69,0.16)]',
          borderColor: 'border-[#DC3545]',
          icon: 'https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/abef5fbde4d931e4aa6eaa38ede142ecbb01f472?placeholderIfAbsent=true'
        };
      case 'active':
        return {
          text: 'Ativo',
          textColor: 'text-[#57D9FF]',
          bgColor: 'bg-[rgba(87,217,255,0.16)]',
          borderColor: 'border-[#57D9FF]',
          icon: 'https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/70ac5188e8c135bce81fc21af04a94a45f9bbb42?placeholderIfAbsent=true'
        };
      case 'cancelled':
        return {
          text: 'Cancelado',
          textColor: 'text-[#DC3545]',
          bgColor: 'bg-[rgba(220,53,69,0.16)]',
          borderColor: 'border-[#DC3545]',
          icon: 'https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/f9b1ddbaee90dfd99b88d53c36f5897adf5c4026?placeholderIfAbsent=true'
        };
      case 'completed':
        return {
          text: 'Concluído',
          textColor: 'text-[#28A745]',
          bgColor: 'bg-[rgba(40,167,69,0.16)]',
          borderColor: 'border-[#28A745]',
          icon: 'https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/b1b47ecb5ca3786b36a34a85364fa18a009825c0?placeholderIfAbsent=true'
        };
      case 'negotiating':
        return {
          text: 'Em negociação',
          textColor: 'text-[#57D9FF]',
          bgColor: 'bg-[rgba(87,217,255,0.16)]',
          borderColor: 'border-[#57D9FF]',
          icon: 'https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/a892fb8d6aad17d7bcb81384547c0f26196bc3eb?placeholderIfAbsent=true'
        };
      default:
        return {
          text: status,
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-300',
          icon: ''
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`justify-center items-center flex gap-1 text-sm font-normal px-4 py-0.5 rounded-[1000px] ${config.bgColor} ${config.borderColor} ${className}`}>
      <span className={`${config.textColor} self-stretch my-auto font-bold`}>
        {config.text}
      </span>
      {config.icon && (
        <img
          src={config.icon}
          className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto"
          alt={`${status} icon`}
        />
      )}
    </div>
  );
};
