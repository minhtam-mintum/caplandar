interface IYearPickerProps {
  decadeStart: number;
  selectedYear: number;
  onYearClick: (year: number) => void;
}

export function YearPicker({ decadeStart, selectedYear, onYearClick }: IYearPickerProps) {
  // One year before the decade + 10 in decade + one after = 12 cells
  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

  return (
    <div className='grid grid-cols-3 gap-1 px-1'>
      {years.map((year) => {
        const isSelected = year === selectedYear;
        const isOutside = year < decadeStart || year > decadeStart + 9;
        return (
          <button
            key={year}
            onClick={() => onYearClick(year)}
            className={`py-3 rounded-sm text-body-md font-medium transition-colors
              ${isSelected ? 'bg-primary text-on-primary' : isOutside ? 'text-on-surface-variant hover:bg-surface-container-high' : 'text-on-surface hover:bg-surface-container-high'}
            `}>
            {year}
          </button>
        );
      })}
    </div>
  );
}
