"use client"

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

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
  displayGuide: boolean;
  userName?: string | null;
  maxRows: number;
}



export function DataTable<TData, TValue>({ columns, toHideColumns, data, showStatusFilter, showBookmarkFilter, selectorFilters, searchFilter, userName, searchPlaceholder, searchFilterStyles, tableStyles, selectBoxStyles, selectContentStyles, headerRowStyles, headerCellStyles, dataRowStyles, dataCellStyles, nextButtonStyles, displayGuide, maxRows }: DataTableProps<TData, TValue>, ) {

  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [showGuide, setShowGuide] = useState(false);

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
  const [filterSelectorValue, setFilterSelectorValue] = useState<{[key : string]: string}>(() => {
    const initialFilterValues : {[key : string]: string} = {};
    selectorFilters?.forEach(filter => {
      const currentValue = searchParams.get(filter.id) || "";
      if (currentValue){
        table.getColumn(filter.id)?.setFilterValue(currentValue);
        initialFilterValues[filter.id] = currentValue;
      }
      });
    return initialFilterValues;
  });

  const updateSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(pathname + '?' +params.toString());
    },
    [searchParams]
  )


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
    table.setPageSize(maxRows);
  }, [toHideColumns])
  
  return (
    <div className="w-full max-w-[1500px]">

      <div className="flex_col_center sm:flex-row sm:justify-evenly sm:items-center py-4 gap-4">
        
      {displayGuide &&
        <div className="tooltip flex_col_center" data-tooltip={`${showGuide ? 'close guide' : 'show guide'}`}>
          <Image
              src={`${showGuide ? "/icons/cancelW.svg" : "/icons/helpIcon.svg"}`}
              alt="guide"
              height={40} width={40}
              className={`border-2 border-slate-300 ${showGuide && 'bg-red-400'} rounded-full hover:scale-[1.05] cursor-pointer`}
              onClick={()=>{setShowGuide((prev)=>!prev)}}
            />
        </div>
        }

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
              <div className="w-[200px]" key={selectorFilter.id+"__"+index}>
              <Select
                onValueChange={(value) => {
                  
                  if (value === CLEAR_FILTER_VALUE) {
                    table.getColumn(selectorFilter.id)?.setFilterValue(null);
                    setFilterSelectorValue((prevData) => ({...prevData, [selectorFilter.id]:""}))
                    updateSearchParams(selectorFilter.id, "");
                  }
                  
                  else {
                    table.getColumn(selectorFilter.id)?.setFilterValue(value);
                    setFilterSelectorValue((prevData) => ({...prevData, [selectorFilter.id]:value}))
                    updateSearchParams(selectorFilter.id, value);
                  }

                }}
                value={filterSelectorValue[selectorFilter.id] || ""} 
                defaultValue={selectorFilter.placeholder}
              >
                <SelectTrigger className={`${selectBoxStyles ? selectBoxStyles : "w-[180px] bg-slate-300 text-slate-600 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"}`}>
                  <SelectValue placeholder={selectorFilter.placeholder} />
                </SelectTrigger>

                <SelectContent className={`${selectContentStyles ? selectContentStyles : "w-[240px] bg-slate-100"}`}>

                  {selectorFilter.options.map((option, index) => {
                    return (
                        <SelectItem className="hover:cursor-pointer" value={option} key={`${option}_${index}`}>{option}</SelectItem>
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
              className={`${searchFilterStyles ? searchFilterStyles : "h-10 w-full rounded-md px-4 py-2 bg-slate-200 text-pri_navy_dark text-sm ring-offset-background placeholder:text-pri_navy_darker focus:outline-none ring-offset-background focus:ring-2 focus:ring-pri_mint_light focus:ring-offset-2"}`}
            />
          </div>
        }
        
      </div>

        {/* <div>
          Showing {table.getRowModel().rows.length.toLocaleString()} of {table.getRowCount().toLocaleString()} papers
        </div> */}

        {showGuide &&
        <div className="inline-flex p-3">
        <div className="bg-pri_bg_card pl-8 pr-2 rounded-lg flex flex-col items-center justify-center shadow-md p-2">
          <p className="font-semibold underline mb-2">Guide</p>
          <ul className="list-disc">
            <li><p className="align-baseline tracking-wide">Click <span className="text-pri_navy_dark underline text-base hover:text-blue-600">the underlined text</span> to open resource links</p></li>
            <li><p className="align-baseline tracking-wide">Click<Image src={"/icons/solutionsIcon.svg"} alt="tag icon" height={28} width={28} className="inline relative -translate-y-1" />to open working solutions</p></li>
            <li><p className="align-baseline tracking-wide">Click<Image src={"/icons/videoIcon.svg"} alt="tag icon" height={28} width={28} className="mx-1 inline relative" />to open video solutions</p></li>
            {userName && <li><p className="align-baseline tracking-wide">Go to your <Link href={`/profile/${userName}`} className="text-pri_navy_dark underline text-base hover:text-blue-600">Profile</Link> to track your progress/bookmarks or set goals!</p></li>}
          </ul>
          
        </div>
        </div>}

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

        {data.length > 15 && <div className="grid grid-rows-2 md:grid-rows-1 grid-cols-3 w-full mt-2">

          <div className="row-start-2 md:row-start-1 col-start-1 col-span-1 flex items-center justify-start gap-2 px-1">
            <button
                className={nextButtonStyles ? nextButtonStyles : 'rounded-md p-1 cursor-pointer'} 
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<<'}
            </button>
            <button
                className={nextButtonStyles ? nextButtonStyles : 'rounded-md p-1 cursor-pointer'} 
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<'}
            </button>
          </div>

          <div className="row-start-1 col-start-1 col-span-full md:col-start-2 md:col-span-1 flex_center gap-4">
            <p className="font-medium text-pri_navy_dark">
              Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount().toLocaleString()} 
            </p>
            <span className="font-bold">|</span>
            <div className="flex items-center gap-1">
              <p className="font-medium text-pri_navy_dark">Go to page: </p>
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  let page = e.target.value ? Number(e.target.value) - 1 : 0;
                  const maxPage = table.getPageCount() - 1;
                  
                  if (page < 0) {
                    page = 0;
                  } else if (page > maxPage) {
                    page = maxPage;
                  }
                  
                  table.setPageIndex(page);
                }}
                className="bg-pri_bg_card2 p-1 text-center w-8 rounded-lg focus:outline-none ring-offset-background focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              />
            </div>
          </div>
          
          <div className="row-start-2 md:row-start-1 col-start-3 col-span-1 flex items-center justify-end gap-2 px-1">
            <button
              className={nextButtonStyles ? nextButtonStyles : 'rounded-md p-1 cursor-pointer'}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                {'>'}
            </button>
            <button
              className={nextButtonStyles ? nextButtonStyles : 'rounded-md p-1 cursor-pointer'}
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
          </div>

        </div>}
        
    </div>

  )
}
