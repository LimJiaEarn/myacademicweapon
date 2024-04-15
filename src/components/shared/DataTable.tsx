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
  toHideColumns: string[]
  data: TData[]
  showStatusFilter?: boolean
  showBookmarkFilter?: boolean
  selectorFilters?: SelectorFieldConfig[];
  searchFilter?: string;
  searchPlaceholder:string;
  searchFilterStyles?:string;
  tableStyles?:string;
  selectBoxStyles?:string;
  selectContentStyles?:string;
  headerRowStyles?: string;
  headerCellStyles?:string;
  dataRowStyles?: string;
  dataCellStyles?: string;
  nextButtonStyles?: string;
}



export function DataTable<TData, TValue>({ columns, toHideColumns, data, showStatusFilter, showBookmarkFilter, selectorFilters, searchFilter, searchPlaceholder, searchFilterStyles, tableStyles, selectBoxStyles, selectContentStyles, headerRowStyles, headerCellStyles, dataRowStyles, dataCellStyles, nextButtonStyles }: DataTableProps<TData, TValue>, ) {

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

  // Hide Status, Bookmark columns
  // Hide Year & Assessment columns for Yearly
  useEffect(()=>{
    table.getAllColumns().map((column) => {
      if (toHideColumns.includes(column.id))
        column.toggleVisibility(false);
      else
        column.toggleVisibility(true);
    })
  }, [toHideColumns])
  
  return (
    <div className="w-full max-w-[1500px]">

      <div className="flex_col_center sm:flex-row sm:justify-evenly sm:items-center py-4 gap-4">
        
        <div className="flex flex-col items-start gap-2 md:gap-4">
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
            <label className="text-pri_navy_dark">Show Bookmarked</label>
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
            <label className="text-pri_navy_dark">Show Unattempted</label>
          </div>}
        </div>
        
        { selectorFilters &&
        <div className="flex_center gap-2 md:gap-4">
          {selectorFilters.map((selectorFilter, index) => {
            return(
              <div className="w-[200px]">
              <Select
                key={selectorFilter.id+"__"+index}
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
                <SelectTrigger className={`${selectBoxStyles ? selectBoxStyles : "w-[180px] bg-slate-300 text-slate-600 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"}`}>
                  <SelectValue placeholder={selectorFilter.placeholder} />
                </SelectTrigger>

                <SelectContent className={`${selectContentStyles ? selectContentStyles : "w-[240px] bg-slate-100"}`}>

                  {selectorFilter.options.map((option) => {
                    return (
                        <SelectItem className="hover:cursor-pointer" value={option}>{option}</SelectItem>
                    )
                  })}

                  <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500 hover:cursor-pointer">Clear Filter</SelectItem>

                </SelectContent>

              </Select>
              </div>

        
        )})}
        </div>
        }


        {/* Search Filter */}
        {
          columns.some(column => 'accessorKey' in column) && searchFilter &&
          <div className="flex items-center py-4 w-[300px]">
            <input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchFilter)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(searchFilter)?.setFilterValue(event.target.value)}
              className={`${searchFilterStyles ? searchFilterStyles : "h-10 w-full rounded-md px-4 py-2 bg-slate-200 text-pri_navy_dark text-sm ring-offset-background placeholder:text-pri_navy_darker focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"}`}
            />
          </div>
        }

        {/* Prev and Next Buttons - Only rendered if there is more than 10 data rows*/}
        {data.length > 10 &&
        <div className="flex_center gap-2">
            <button
                className={nextButtonStyles ? nextButtonStyles : 'rounded-md px-4 cursor-pointer'} 
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Prev
            </button>
            <button
              className={nextButtonStyles ? nextButtonStyles : 'rounded-md px-4 cursor-pointer'}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </button>
        </div>
        }
      </div>



        <Table className={tableStyles ? tableStyles : ''}>
          <TableHeader className="rounded-t-lg">
            {table.getHeaderGroups().map((headerGroup) => (

              <TableRow key={headerGroup.id} className={headerRowStyles ? headerRowStyles : `bg-slate-400`}>
                {headerGroup.headers.map((header) => {
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
              <TableRow className="">
                <TableCell colSpan={columns.length} className="h-24 text-center text-lg text-slate-400">
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
        


    </div>

  )
}
