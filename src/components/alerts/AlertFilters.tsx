import type { Severity } from "../../types/alert";
import { SEVERITY_OPTIONS } from "../../utils/constants";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

interface AlertFiltersProps {
  searchTerm: string;
  severityFilter: "All" | Severity;
  onSearchChange: (value: string) => void;
  onSeverityChange: (value: "All" | Severity) => void;
}

export const AlertFilters = ({
  searchTerm,
  severityFilter,
  onSearchChange,
  onSeverityChange,
}: AlertFiltersProps) => (
  <div className="grid gap-4 md:grid-cols-2">
    <Input
      id="searchTerm"
      label="Search by student name"
      placeholder="Type a student name"
      value={searchTerm}
      onChange={(event) => onSearchChange(event.target.value)}
    />
    <Select
      id="severityFilter"
      label="Filter by severity"
      value={severityFilter}
      onChange={(event) => onSeverityChange(event.target.value as "All" | Severity)}
    >
      <option value="All">All</option>
      {SEVERITY_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  </div>
);
