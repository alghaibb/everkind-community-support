"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, MoreVertical } from "lucide-react";

interface BulkActionsProps<T extends { id: string }> {
  items: T[];
  selectedItems: Set<string>;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete?: (ids: string[]) => void;
  customActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    action: (ids: string[]) => void;
    variant?: "default" | "destructive";
  }>;
}

export function BulkActions<T extends { id: string }>({
  items,
  selectedItems,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  customActions,
}: BulkActionsProps<T>) {
  const allSelected = items.length > 0 && selectedItems.size === items.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  if (selectedItems.size === 0) {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          aria-label="Select all items"
        />
        <span className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="flex items-center gap-2 min-w-0">
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          aria-label="Select all items"
        />
        <span className="text-sm font-medium truncate">
          {selectedItems.size} {selectedItems.size === 1 ? "item" : "items"} selected
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onBulkDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${selectedItems.size} item(s)?`)) {
                onBulkDelete(Array.from(selectedItems));
              }
            }}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete ({selectedItems.size})
          </Button>
        )}

        {customActions && customActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <MoreVertical className="h-4 w-4" />
                More Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {customActions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.action(Array.from(selectedItems))}
                  className={action.variant === "destructive" ? "text-destructive" : ""}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onDeselectAll}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

