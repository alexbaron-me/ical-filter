import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { nanoid } from "nanoid";

const options = [
  ["Name", "summary"],
  ["Location", "location"],
];

export type FilterData = {
  id: string;
  filterValue: string;
  filterBy: string;
};
export type FilterProps = {
  data: FilterData;
  onDataChange: (data: FilterData) => void;
  onDelete?: () => void;
};
export default function Filter({ data, onDataChange, onDelete }: FilterProps) {
  return (
    <FilterCore
      filterBy={data.filterBy}
      filterValue={data.filterValue}
      onFilterValueChange={(value) =>
        onDataChange({ ...data, filterValue: value })
      }
      onFilterByChange={(value) => onDataChange({ ...data, filterBy: value })}
    >
      <Button
        className="h-full"
        color="destructive"
        size="lg"
        onClick={onDelete}
      >
        <TrashIcon className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Delete</span>
      </Button>
    </FilterCore>
  );
}

export type FilterCreateProps = {
  onCreate: (data: FilterData) => void;
};
export function FilterCreate({ onCreate }: FilterCreateProps) {
  const [filterBy, setFilterBy] = useState(options[0][1]);
  const [filterValue, setFilterValue] = useState("");

  const data: FilterData = {
    id: nanoid(12),
    filterBy,
    filterValue,
  };
  const valid = data.filterValue.length > 0;

  return (
    <FilterCore
      filterBy={filterBy}
      filterValue={filterValue}
      onFilterByChange={setFilterBy}
      onFilterValueChange={setFilterValue}
    >
      <Button
        className="h-full"
        color="primary"
        size="lg"
        disabled={!valid}
        onClick={() => {
          onCreate(data);
          setFilterValue("");
          setFilterBy(options[0][1]);
        }}
      >
        <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Delete</span>
      </Button>
    </FilterCore>
  );
}

type FilterCoreProps = {
  filterBy: string;
  filterValue: string;
  onFilterByChange: (value: string) => void;
  onFilterValueChange: (value: string) => void;
  children?: React.ReactNode;
};
function FilterCore({
  filterBy,
  filterValue,
  onFilterByChange,
  onFilterValueChange,
  children,
}: FilterCoreProps) {
  return (
    <div className="flex items-stretch gap-2">
      <Select
        selected={filterBy}
        setSelected={onFilterByChange}
        selectedName={options.find((o) => o[1] === filterBy)?.[0]}
        label="Filter by"
        labelSrOnly
      >
        {options.map(([name, value]) => (
          <Select.Option key={value} value={value}>
            {name}
          </Select.Option>
        ))}
      </Select>
      <div className="flex items-center">
        <p className="text-sm text-gray-500">contains</p>
      </div>
      <Input
        name="filter"
        label="Filter"
        labelSrOnly
        placeholder="Filter"
        className="h-full flex-grow"
        value={filterValue}
        onChange={(e) => onFilterValueChange(e.target.value)}
      />
      {children}
    </div>
  );
}
