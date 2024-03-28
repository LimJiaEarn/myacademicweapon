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
  searchFilter: string;
  tableStyles?:string;
  headerRowStyles?: string;
  headerCellStyles?:string;
  dataRowStyles?: string;
  dataCellStyles?: string;
  nextButtonStyles?: string;
}



export function DataTable<TData, TValue>({ columns, data, searchFilter, tableStyles, headerRowStyles, headerCellStyles, dataRowStyles, dataCellStyles, nextButtonStyles }: DataTableProps<TData, TValue>, ) {

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

  // Filtering usestates
  const [statusValue, setStatusValue] = useState("");
  const [assessmentValue, setAssessmentValue] = useState("");
  const [topicName, setTopicName] = useState("");

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


        {/* 
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>  
        
        
        
        */}


        
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
          <SelectContent className="w-[240px] bg-slate-300">
            <SelectItem className="hover:cursor-pointer" value="Completed">Completed</SelectItem>
            <SelectItem  className="hover:cursor-pointer" value="Incomplete">Incomplete</SelectItem>
            <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500 hover:cursor-pointer">Clear Filter</SelectItem>
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
            <SelectContent className="w-[240px] bg-slate-300">
              {
                Array.from(new Set(data.map(item => (item as any)["assessment"]))).map((assessmentType, index) => 
                  <SelectItem className="hover:cursor-pointer" key={assessmentType+index} value={assessmentType}>{assessmentType}</SelectItem>
                )
              }
              <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500 hover:cursor-pointer">Clear Filter</SelectItem>
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
            <SelectContent className="w-[240px] bg-slate-300">
              {
                Array.from(
                  new Set(
                    data.map(item => (item as any)["topicName"])
                  )
                ).map((topicname) => <SelectItem className="hover:cursor-pointer" key={topicname} value={topicname}>{topicname}</SelectItem>)
              }
              <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500 hover:cursor-pointer">Clear Filter</SelectItem>
            </SelectContent>
          </Select>

        }

        {/* Search Filter */}
        {
          columns.some(column => 'accessorKey' in column) &&
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
