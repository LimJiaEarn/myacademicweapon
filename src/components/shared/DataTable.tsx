"use client"

import { useState } from 'react';
import Image from 'next/image';

import {
  ColumnDef,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}


export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [filterColumn, setFilterColumn] = useState("schoolName")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Filtering Usestates
  const [statusValue, setStatusValue] = useState("");
  const [assessmentValue, setAssessmentValue] = useState("");
  const [topicName, setTopicName] = useState("");

  const CLEAR_FILTER_VALUE = "CLEAR_FILTER";
  
  return (
    <div className="w-full">

      <div className="flex_col_center sm:flex-row sm:justify-evenly sm:items-center py-4 gap-4">

        
        {/* Status Filter Select */}
        <Select
          onValueChange={(value) => {
            if (value === CLEAR_FILTER_VALUE) {
              table.getColumn("status")?.setFilterValue(null);
              setStatusValue(""); // Reset the displayed value to show the placeholder
            } else {
              table.getColumn("status")?.setFilterValue(value === "Completed");
              setStatusValue(value); // Update the displayed value to reflect the selection
            }
          }}
          value={statusValue} 
          defaultValue="Filter Status"
        >
          <SelectTrigger className="w-[180px] bg-slate-400">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Incomplete">Incomplete</SelectItem>
            <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500">Clear Filter</SelectItem>
          </SelectContent>
        </Select>

        {/* Assessment Filter Select which only displays if there are any assessment column*/}
        {
          columns.some(column => 'accessorKey' in column && column.accessorKey === 'assessment') &&
          <Select
            onValueChange={(value) => {
              if (value === CLEAR_FILTER_VALUE) {
                table.getColumn("assessment")?.setFilterValue(null);
                setAssessmentValue(""); // Reset the displayed value to show the placeholder
              } else {
                table.getColumn("assessment")?.setFilterValue(value);
                setAssessmentValue(value); // Update the displayed value to reflect the selection
              }
            }}
            value={assessmentValue} 
            defaultValue="Filter Assessment"
          >
            <SelectTrigger className="w-[180px] bg-slate-400">
              <SelectValue placeholder="Filter Assessments" />
            </SelectTrigger>
            <SelectContent>
              {
                Array.from(new Set(data.map(item => (item as any)["assessment"]))).map((assessmentType, index) => 
                  <SelectItem key={assessmentType+index} value={assessmentType}>{assessmentType}</SelectItem>
                )
              }
              <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500">Clear Filter</SelectItem>
            </SelectContent>
          </Select>

        }

        {/* Topic Name Filter Select which only displays if there are any topicName column*/}
        {
          columns.some(column => 'accessorKey' in column && column.accessorKey === 'topicName') &&
          <Select
            onValueChange={(value) => {
              if (value === CLEAR_FILTER_VALUE) {
                table.getColumn("topicName")?.setFilterValue(null);
                setTopicName(""); // Reset the displayed value to show the placeholder
              } else {
                table.getColumn("topicName")?.setFilterValue(value);
                setTopicName(value); // Update the displayed value to reflect the selection
              }
            }}
            value={topicName} 
            defaultValue="Filter Topic"
          >
            <SelectTrigger className="w-[180px] bg-slate-400">
              <SelectValue placeholder="Filter Topic" />
            </SelectTrigger>
            <SelectContent>
              {
                Array.from(
                  new Set(
                    data.map(item => (item as any)["topicName"])
                  )
                ).map((topicname) => <SelectItem key={topicname} value={topicname}>{topicname}</SelectItem>)
              }
              <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500">Clear Filter</SelectItem>
            </SelectContent>
          </Select>

        }

        {/* Search Filter */}
        {
          columns.some(column => 'accessorKey' in column && column.accessorKey === 'schoolName') &&
          <div className="flex items-center py-4">
            <input
              placeholder={`Filtering ${filterColumn} ...`}
              value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        }
      </div>


      <div className="">

        <Table className="">
          
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (

              <TableRow key={headerGroup.id} className="bg-slate-400 font-bold">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <div className="flex_center">
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </div>
                      
                    </TableHead>
                  )
                })}
              </TableRow>

            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ?
            (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`hover:bg-slate-200`}
                >

                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                  )})}

                </TableRow>
              ))
            )
            :
            (
              // No data available
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-lg text-creativity_gray">
                  <div className="flex_center">
                    
                    <Image className="hidden md:flex rounded-full opacity-20" src="/images/noContent.webp" alt="icon" height={300} width={300}/>
                    
                    <div>
                      No resources available at the moment :(
                      <br/>
                      Have any resources to share?
                      <br/>
                      We'll be excited to publish them here!
                      <br/>
                      Contact us at<br/>
                      <span className="font-bold">myacademicweapon@gmail.com</span>!
                    </div>
                  
                  </div>
                  
                </TableCell>
              </TableRow>

            )}
          </TableBody>
        </Table>
        
        {/* Prev and Next Buttons */}
        {table.getRowModel().rows?.length > 0 &&
        <div className="flex_center gap-2">
            <button className="bg-green-300 rounded-full px-4 cursor-pointer" 
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Prev
            </button>
            <button className="bg-green-300 rounded-full px-4 cursor-pointer"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </button>
        </div>
        }

      </div>
    </div>

  )
}
