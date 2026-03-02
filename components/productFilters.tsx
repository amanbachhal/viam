"use client";

import * as React from "react";
import { Filter } from "lucide-react";

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
import { CATEGORIES, STYLES, TYPES } from "@/types/product";

interface Props {
  category: string;
  style: string;
  type: string;
  search: string;
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
  onCategoryChange,
  onStyleChange,
  onTypeChange,
  onSearchChange,
}: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="py-4 mb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-serif font-bold w-full text-3xl">The Collection</h2>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search designs..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full md:w-60 rounded-full"
          />

          <Button
            variant={isOpen ? "default" : "outline"}
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-full gap-2 ${isOpen ? "bg-[#E3BB76] text-black" : "bg-white"} hover:bg-secondary`}
          >
            <Filter size={16} />
            Filters
          </Button>
        </div>
      </div>

      {/* Expandable filters */}
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FilterSelect
              label="Category"
              value={category}
              options={CATEGORIES}
              onChange={onCategoryChange}
            />

            <FilterSelect
              label="Style"
              value={style}
              options={STYLES}
              onChange={onStyleChange}
            />

            <FilterSelect
              label="Type"
              value={type}
              options={TYPES}
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
  options: readonly string[];
  onChange: (v: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        {label}
      </p>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-11 rounded-xl">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
