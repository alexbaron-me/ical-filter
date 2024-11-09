import type { FilterData } from "./Filter";
import Filter, { FilterCreate } from "./Filter";

export type FilterListProps = {
  filters: (FilterData & { id: string })[];
  onFiltersChange: (filters: FilterData[]) => void;
};
export default function FilterList({
  filters,
  onFiltersChange,
}: FilterListProps) {
  const onChange = (id: string) => (data: FilterData) => {
    onFiltersChange(
      filters.map((filter) => (filter.id === id ? data : filter)),
    );
  };

  return (
    <ul className="flex flex-col gap-y-4">
      {filters.map((filter) => (
        <Filter
          key={filter.id}
          data={filter}
          onDataChange={onChange(filter.id)}
          onDelete={() =>
            onFiltersChange(filters.filter((f) => f.id !== filter.id))
          }
        />
      ))}
			<div />
			<FilterCreate onCreate={d => onFiltersChange([...filters, d])} />
    </ul>
  );
}
