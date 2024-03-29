"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';

import {
  ColumnDef,
  SortingState,
  VisibilityState,
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

/*
  Documentation: https://ui.shadcn.com/docs/components/data-table
*/



interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  showStatusFilter?: boolean
  showBookmarkFilter?: boolean
  selectorFilters?: SelectorFieldConfig[];
  searchFilter?: string;
  tableStyles?:string;
  headerRowStyles?: string;
  headerCellStyles?:string;
  dataRowStyles?: string;
  dataCellStyles?: string;
  nextButtonStyles?: string;
}



export function DataTable<TData, TValue>({ columns, data, showStatusFilter, showBookmarkFilter, selectorFilters, searchFilter, tableStyles, headerRowStyles, headerCellStyles, dataRowStyles, dataCellStyles, nextButtonStyles }: DataTableProps<TData, TValue>, ) {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // Selector states
  const [filterSelectorValue, setFilterSelectorValue] = useState<{[key : string]: string}>({});

  // Status states
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);


  const CLEAR_FILTER_VALUE = "CLEAR_FILTER";

  const filterPlaceholder = "Search "+ searchFilter;

  // Hide Status, Bookmark columns
  // Hide Year & Assessment columns for Yearly
  useEffect(()=>{

    const toHideColumns = ["bookmark", "status", "year", "assessment"];
    table.getAllColumns().map((column) => {
      if (toHideColumns.includes(column.id)){
        column.toggleVisibility(false);
      }
    })
  }, [])
  
  return (
    <div className="w-full">

      <div className="flex_col_center sm:flex-row sm:justify-evenly sm:items-center py-4 gap-4">
        
        <div className="flex_center gap-4 md:gap-6">
          {showBookmarkFilter &&
          <div className="flex_center gap-2">
            <div className="inline-block relative cursor-pointer">
              <input
                type="checkbox"
                checked={showBookmarked}
                onChange={(e) => {
                  e.preventDefault();
                  table.getColumn("bookmark")?.setFilterValue(e.target.checked ? true : null);
                  setShowBookmarked(e.target.checked); // Update the displayed value to reflect the selection
                }}
                className="opacity-0 absolute w-full h-full left-0 top-0 z-10 cursor-pointer"
              />
              <span className={`block w-6 h-6 rounded-md border-2 ${showBookmarked ? 'bg-amber-300 border-amber-600' : 'bg-gray-100 border-gray-300'}`}></span>
              {showBookmarked && (
                <svg className="absolute top-1 left-1 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <label className="text-text_gray">Show Bookmarked</label>
          </div>}
          {showStatusFilter &&
          <div className="flex_center gap-2">
            <div className="inline-block relative cursor-pointer">
              <input
                type="checkbox"
                checked={showIncomplete}
                onChange={(e) => {
                  e.preventDefault();
                  table.getColumn("status")?.setFilterValue(e.target.checked ? false : null);
                  setShowIncomplete(e.target.checked); // Update the displayed value to reflect the selection
                }}
                className="opacity-0 absolute w-full h-full left-0 top-0 z-10 cursor-pointer"
              />
              <span className={`block w-6 h-6 rounded-md border-2 ${showIncomplete ? 'bg-amber-300 border-amber-600' : 'bg-gray-100 border-gray-300'}`}></span>
              {showIncomplete && (
                <svg className="absolute top-1 left-1 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <label className="text-text_gray">Show Unattempted</label>
          </div>}
        </div>


        {/* Status Filter Select */}
        {/* <Select
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
          <SelectContent className="w-[240px] bg-slate-300">
            <SelectItem className="hover:cursor-pointer" value="Completed">Completed</SelectItem>
            <SelectItem  className="hover:cursor-pointer" value="Incomplete">Incomplete</SelectItem>
            <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500 hover:cursor-pointer">Clear Filter</SelectItem>
          </SelectContent>
        </Select> */}
        
        { selectorFilters &&
        <div className="flex_center gap-2 md:gap-4">
          {selectorFilters.map((selectorFilter, index) => {
            return(
            <Select
              key={selectorFilter.id+"_"+index}
              onValueChange={(value) => {
                
                if (value === CLEAR_FILTER_VALUE) {
                  table.getColumn(selectorFilter.id)?.setFilterValue(null);
                  setFilterSelectorValue((prevData) => ({...prevData, [selectorFilter.id]:""}))
                }
                
                else {
                  table.getColumn(selectorFilter.id)?.setFilterValue(value);
                  setFilterSelectorValue((prevData) => ({...prevData, [selectorFilter.id]:value}))
                  
                }

              }}
              value={filterSelectorValue[selectorFilter.id] || ""} 
              defaultValue={selectorFilter.placeholder}
            >
              <SelectTrigger className="w-[180px] bg-slate-400">
                <SelectValue placeholder={selectorFilter.placeholder} />
              </SelectTrigger>

              <SelectContent className="w-[240px] bg-slate-300">

                {selectorFilter.options.map((option) => {
                   return (
                      <SelectItem className="hover:cursor-pointer" value={option}>{option}</SelectItem>
                   )
                })}

                <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500 hover:cursor-pointer">Clear Filter</SelectItem>

              </SelectContent>

            </Select>
        
        )})}
        </div>
        }


        {/* Search Filter */}
        {
          columns.some(column => 'accessorKey' in column) && searchFilter &&
          <div className="flex items-center py-4">
            <input
              placeholder={filterPlaceholder}
              value={(table.getColumn(searchFilter)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(searchFilter)?.setFilterValue(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        }
      </div>


      <div className="">

        <Table className={tableStyles ? tableStyles : ''}>
          
          <TableHeader className="rounded-t-lg">
            {table.getHeaderGroups().map((headerGroup) => (

              <TableRow key={headerGroup.id} className={headerRowStyles ? headerRowStyles : `bg-slate-400`}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={header.id}>
                      <div className={headerCellStyles ? headerCellStyles : `flex_center text-black text-md font-semibold`}>
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
            {data.length > 0 ?
            (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={dataRowStyles ? dataRowStyles : `hover:bg-slate-200`}
                >

                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} className={dataCellStyles ? dataCellStyles : 'align-middle text-center'}>
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
        {data.length > 10 &&
        <div className="flex_center gap-2">
            <button
                className={nextButtonStyles ? nextButtonStyles : 'bg-green-300 rounded-full px-4 cursor-pointer'} 
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Prev
            </button>
            <button
              className={nextButtonStyles ? nextButtonStyles : 'bg-green-300 rounded-full px-4 cursor-pointer'}
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
