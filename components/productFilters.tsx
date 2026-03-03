"use client";

import * as React from "react";
import { Filter, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  category: string;
  style: string;
  type: string;
  search: string;
  filterOptions: {
    categories: any[];
    styles: any[];
    types: any[];
  };
  onCategoryChange: (v: string) => void;
  onStyleChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

export function ProductFilters({
  category,
  style,
  type,
  search,
  filterOptions,
  onCategoryChange,
  onStyleChange,
  onTypeChange,
  onSearchChange,
}: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="py-4 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="font-serif font-bold w-full text-4xl text-neutral-900">
          The Collection
        </h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search designs..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rounded-full border-neutral-200 focus:ring-[#E3BB76]"
            />
          </div>

          <Button
            variant={isOpen ? "default" : "outline"}
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-full gap-2 px-6 h-10 transition-all ${
              isOpen
                ? "bg-[#E3BB76] text-black border-[#E3BB76]"
                : "bg-white border-neutral-200"
            }`}
          >
            <Filter size={16} />
            Filters
          </Button>
        </div>
      </div>

      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <Separator className="my-8" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FilterSelect
              label="Category"
              value={category}
              options={filterOptions.categories}
              onChange={onCategoryChange}
            />

            <FilterSelect
              label="Style"
              value={style}
              options={filterOptions.styles}
              onChange={onStyleChange}
            />

            <FilterSelect
              label="Type"
              value={type}
              options={filterOptions.types}
              onChange={onTypeChange}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

/* ---------- Reusable Select ---------- */

interface FilterSelectProps {
  label: string;
  value: string;
  options: any[];
  onChange: (v: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </p>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-12 rounded-full border-neutral-200 bg-neutral-50/50 focus:ring-[#E3BB76]">
          <SelectValue placeholder={`All ${label}s`} />
        </SelectTrigger>

        <SelectContent className="rounded-2xl border-neutral-200">
          <SelectItem value="All" className="focus:bg-[#E3BB76]/10">
            All {label}s
          </SelectItem>
          {options?.map((opt) => (
            <SelectItem
              key={opt._id}
              value={opt._id}
              className="focus:bg-[#E3BB76]/10"
            >
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
