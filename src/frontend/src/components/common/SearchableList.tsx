import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchableListProps<T> {
  items: T[];
  searchKeys: (keyof T)[];
  renderItem: (item: T) => React.ReactNode;
  onFilterClick?: () => void;
  emptyMessage?: string;
}

export function SearchableList<T>({
  items,
  searchKeys,
  renderItem,
  onFilterClick,
  emptyMessage = '😊 Nenhum item encontrado'
}: SearchableListProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      searchKeys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        if (typeof value === 'number') {
          return value.toString().includes(query);
        }
        return false;
      })
    );
  }, [items, searchQuery, searchKeys]);

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar..."
            className="pl-10"
          />
        </div>
        {onFilterClick && (
          <button 
            onClick={onFilterClick}
            className="px-4 py-2 rounded-lg border-2 border-border hover:border-primary transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          <>
            {filteredItems.map((item, index) => (
              <div key={index}>{renderItem(item)}</div>
            ))}
            <div className="text-center text-sm text-muted-foreground py-4">
              😊 Fim da lista
            </div>
          </>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}