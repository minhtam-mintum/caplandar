import { Search } from 'lucide-react';
import { Input } from 'app/components/atoms/Input';

interface ISearchBarProps {
  placeholder?: string;
  onFocus?: () => void;
}

export function SearchBar({
  placeholder = 'Search tasks, events (Cmd+K)',
  onFocus,
}: ISearchBarProps) {
  return (
    <Input
      variant='filled'
      placeholder={placeholder}
      onFocus={onFocus}
      startAdornment={<Search size={15} />}
    />
  );
}
