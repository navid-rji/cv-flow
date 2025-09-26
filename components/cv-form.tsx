"use client";

import React from "react";
import { useHeader } from "@/store/cv-store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown, ArrowUp, ArrowDown, Trash2 } from "lucide-react";



interface HeaderFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function HeaderForm({open, setOpen}: HeaderFormProps) {
  const {
    header,
    patchHeader,
    addContact,
    updateContact,
    removeContact,
    moveContact,
  } = useHeader();

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <div className="p-4 rounded-xl border shadow-xl w-full transition-transform duration-1000">
        {/* Name */}
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between gap-2"
            aria-label={
              open
                ? "Collapse personal information"
                : "Expand personal information"
            }
          >
            <h1 className="font-semibold">Personal Information</h1>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </CollapsibleTrigger>
        {/* <h1 className="font-semibold">Personal Information</h1> */}

        <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="space-y-1 mt-2">
            <label className="block text-sm font-medium">Name</label>
            <Input
              className=""
              placeholder="Your name"
              value={header.name}
              onChange={(e) => patchHeader({ name: e.target.value })}
            />
          </div>

          {/* Contacts */}
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Contact Information</h3>
              <Button
                variant={"outline"}
                size={"sm"}
                // className="rounded-lg border px-3 py-1 text-sm hover:bg-black/5 transition-colors"
                onClick={() =>
                  addContact(undefined, { label: "email", value: "" })
                }
              >
                + Add
              </Button>
            </div>

            <div className="space-y-2">
              {header.contacts.map((c, i) => (
                <div key={i} className="flex flex-row gap-2 items-center">
                  <div className="grid grid-cols-9 gap-2 items-center">
                    <Input
                      className="col-span-3"
                      placeholder="e.g. email"
                      value={c.label ?? ""}
                      onChange={(e) =>
                        updateContact(i, { ...c, label: e.target.value })
                      }
                    />

                    {/* Value */}
                    <Input
                      className="col-span-6"
                      placeholder={
                        c.label === "email" ? "name@example.com" : "Value"
                      }
                      value={c.value ?? ""}
                      onChange={(e) =>
                        updateContact(i, { ...c, value: e.target.value })
                      }
                    />
                  </div>
                  {/* Label */}

                  {/* Reorder */}
                  <div className="flex gap-1 items-center">
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      // className="rounded-lg border px-2 py-2 disabled:opacity-40"
                      disabled={i === 0}
                      onClick={() => moveContact(i, i - 1)}
                      title="Move up"
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      // className="rounded-lg border px-2 py-2 disabled:opacity-40"
                      disabled={i === header.contacts.length - 1}
                      onClick={() => moveContact(i, i + 1)}
                      title="Move down"
                    >
                      <ArrowDown />
                    </Button>
                  </div>

                  {/* Remove */}
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeContact(i)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}

              {header.contacts.length === 0 && (
                <p className="text-sm text-gray-500">
                  No contact information yet.
                </p>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface CVFormProps {
  personalInformationOpen: boolean;
  setPersonalInformationOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function CVForm({personalInformationOpen, setPersonalInformationOpen}: CVFormProps) {
  return (
    <div>
      <HeaderForm open={personalInformationOpen} setOpen={setPersonalInformationOpen}/>
    </div>
  );
}

export default CVForm;
