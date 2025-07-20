"use client";

import React, { ReactNode, ReactElement, useState, useEffect } from "react";
// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ItemsProps = {
  label?: string;
  isChecked?: boolean;
  disabled?: boolean;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  id: string;
};

type DropdownProps = {
  label?: ReactNode;
  buttonName?: string;
  title?: string;
  contentClassName?: string;
  triggerClassName?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  defaultItems: ItemsProps[];
  children?: ReactNode;
  callback?: (items: ItemsProps[]) => void;
};

export function DropdownMenuCheckboxes({
  label = "",
  buttonName = "Open",
  title = "",
  contentClassName = "",
  triggerClassName = "",
  variant = "outline",
  defaultItems = [],
  children = null,
  callback = () => {},
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);
  };

  const [items, setItems] = useState<ItemsProps[]>([]);

  useEffect(() => {
    setItems([...defaultItems]);
  }, [defaultItems]);

  const onCheckedChange = (id: string) => {
    let tempItems = [...items];
    tempItems = tempItems.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item));
    setItems(tempItems);
    callback(tempItems.filter((item) => item.isChecked));
  };

  const [id, setId] = useState("");

  useEffect(() => {
    setId(uuidv4());
  }, []);

  return (
    <div className="">
      {label && (
        <Label htmlFor={id} className=" font-medium mb-2">
          {label}
        </Label>
      )}
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger
          asChild
          className={`dropdown-menu-checkboxes-trigger  ${triggerClassName}`}
          onClick={(e) => {
            if (!open) setOpen(true);
          }}
        >
          <Button
            variant={variant}
            size="sm"
            className="justify-between text-neutral-500 font-normal min-h-[37px] h-auto"
          >
            {items.length && items.filter((item) => item.isChecked).length
              ? items.filter((item) => item.isChecked).length > 0 && (
                  <div className="flex flex-wrap gap-2 my-2">
                    {items
                      .filter((item) => item.isChecked)
                      .map((item) => (
                        <span
                          key={item.id}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                        >
                          {item.label}
                          <div
                            className="ml-1 text-blue-500 hover:text-blue-700"
                            onClick={() => onCheckedChange(item.id)}
                          >
                            ×
                          </div>
                        </span>
                      ))}
                  </div>
                )
              : buttonName}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`w-56 mx-3 dropdown-menu-checkboxes-content ${contentClassName}`}>
          {title && <DropdownMenuLabel>{title}</DropdownMenuLabel>}
          {/* <DropdownMenuSeparator /> */}
          {items.length
            ? items.map((item, index) => {
                return (
                  <DropdownMenuCheckboxItem
                    onSelect={(e) => e.preventDefault()}
                    key={index}
                    checked={item.isChecked}
                    onCheckedChange={() => onCheckedChange(item.id)}
                    disabled={item.disabled}
                    className="dropdown-menu-checkbox-item flex items-center gap-2 hover:bg-neutral-50"
                  >
                    {item.startIcon && <span className="">{item.startIcon}</span>}
                    {item.label}
                    {item.endIcon && <span className="ml-auto">{item.endIcon}</span>}
                  </DropdownMenuCheckboxItem>
                );
              })
            : ""}
          {children}
          {!items.length && !children && <div className="text-slate-400 text-sm px-2">Empty</div>}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
