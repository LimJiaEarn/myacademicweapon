"use client"

import { useState } from 'react';

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

// Define an interface that includes schoolName
interface RowData {
  id: string;
  status: boolean;
  url: string;
}


// Type guard function to check if the data includes schoolName
function isDataWithURL(data: any): data is RowData {
  return (data as RowData).url !== undefined;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn : string
}


export function DataTable<TData, TValue>({ columns, data, filterColumn }: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  

  return (
    <div className="w-full">

      <div className="flex items-center py-4">
        <input
          placeholder={`Filtering ${filterColumn} ...`}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">

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
                  className={`hover:bg-slate-200 cursor-pointer`}
                  onClick={() => {
                    if (isDataWithURL(row.original)) {
                      window.open(row.original.url, '_blank');
                    }
                  }}
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No Resources Available :( <br/>Check Back Soon!
                </TableCell>
              </TableRow>

            )}
          </TableBody>
        </Table>
        
        {/* Prev and Next Buttons */}
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

      </div>
    </div>

  )
}
