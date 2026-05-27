import { Search } from 'lucide-react';
import { Input } from 'app/components/atoms/Input';

interface ISearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Search events...' }: ISearchBarProps) {
  return <Input variant='filled' placeholder={placeholder} startAdornment={<Search size={15} />} />;
}
