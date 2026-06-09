"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Bookmark,
  CircleDashed,
  Inbox,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

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
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/*
  Documentation: https://ui.shadcn.com/docs/components/data-table
*/

// Pagination button — bordered white square with mint hover, faded when disabled.
const PAGE_BTN =
  "inline-flex items-center justify-center h-10 w-10 rounded-xl border border-hairline bg-white text-pri_navy_main transition ease-in-out duration-150 hover:border-pri_mint_main hover:text-pri_mint_darker hover:bg-pri_mint_main/5 disabled:opacity-40 disabled:pointer-events-none";

// Filter pill toggle (Bookmarked / Unattempted) — base + on/off styles.
const PILL_BASE =
  "inline-flex items-center gap-1.5 h-11 px-3.5 rounded-xl border text-sm font-semibold cursor-pointer select-none transition ease-in-out duration-150";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  toHideColumns: string[];
  data: TData[];
  showStatusFilter?: boolean;
  showBookmarkFilter?: boolean;
  selectorFilters?: SelectorFieldConfig[];
  searchFilter?: string;
  searchPlaceholder: string;
  searchFilterStyles?: string;
  tableStyles?: string;
  selectBoxStyles?: string;
  selectContentStyles?: string;
  headerRowStyles?: string;
  headerCellStyles?: string;
  dataRowStyles?: string;
  dataCellStyles?: string;
  /** Override the table's outer wrapper (e.g. drop the card chrome when nested). */
  tableWrapperClassName?: string;
  displayGuide: boolean;
  userName?: string | null;
  maxRows: number;
  /**
   * When provided, the filtered + paginated rows render as a stack of cards
   * (one per row) instead of the <table>. All filtering / sorting / pagination /
   * guide logic is unchanged; only the presentation differs.
   */
  renderCard?: (row: Row<TData>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  toHideColumns,
  data,
  showStatusFilter,
  showBookmarkFilter,
  selectorFilters,
  searchFilter,
  userName,
  searchPlaceholder,
  searchFilterStyles,
  tableStyles,
  selectBoxStyles,
  selectContentStyles,
  headerRowStyles,
  headerCellStyles,
  dataRowStyles,
  dataCellStyles,
  tableWrapperClassName,
  displayGuide,
  maxRows,
  renderCard,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
  const [filterSelectorValue, setFilterSelectorValue] = useState<{
    [key: string]: string;
  }>(() => {
    const initialFilterValues: { [key: string]: string } = {};
    selectorFilters?.forEach((filter) => {
      const currentValue = searchParams.get(filter.id) || "";
      if (currentValue) {
        // Use find() rather than getColumn() — getColumn console.errors when the
        // column isn't present yet, whereas find() quietly no-ops.
        const col = table.getAllColumns().find((c) => c.id === filter.id);
        col?.setFilterValue(currentValue);
        if (col) initialFilterValues[filter.id] = currentValue;
      }
    });
    return initialFilterValues;
  });

  const updateSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(pathname + "?" + params.toString());
    },
    [searchParams]
  );

  // Status states
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);

  const CLEAR_FILTER_VALUE = "CLEAR_FILTER";

  // Hide Status, Bookmark columns
  // Hide Year & Assessment columns for Yearly
  useEffect(() => {
    table.getAllColumns().map((column) => {
      if (toHideColumns.includes(column.id)) column.toggleVisibility(false);
      else column.toggleVisibility(true);
    });
    table.setPageSize(maxRows);
  }, [toHideColumns]);

  // Bring the user back to the top whenever the page changes, so they read the new
  // page from the start. Done in an effect (after the new page has committed) rather
  // than inline on click, otherwise the re-render's DOM swap interrupts the scroll.
  const pageIndex = table.getState().pagination.pageIndex;
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pageIndex]);

  const emptyMessage = (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex_center h-16 w-16 rounded-2xl bg-pri_mint_main/10 text-pri_mint_darker">
        <Inbox className="h-8 w-8" />
      </div>
      <p className="font-display text-xl font-extrabold text-ink">
        Nothing here yet
      </p>
      <p className="max-w-sm text-sm text-ink_soft">
        Have papers or notes to share? We'd love to publish them — reach us at{" "}
        <span className="font-semibold text-pri_mint_darker">
          myacademicweapon@gmail.com
        </span>
      </p>
    </div>
  );

  return (
    <div className="w-full max-w-[1500px]">
      {/* ── Filter toolbar ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between py-4">
        {/* Search */}
        {columns.some((column) => "accessorKey" in column) && searchFilter && (
          <div className="relative w-full lg:max-w-[340px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pri_navy_light" />
            <input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchFilter)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchFilter)
                  ?.setFilterValue(event.target.value)
              }
              className={`${
                searchFilterStyles
                  ? searchFilterStyles
                  : "h-11 w-full rounded-xl border border-hairline bg-white pl-10 pr-4 text-sm text-ink placeholder:text-pri_navy_light/70 focus:outline-none focus:ring-2 focus:ring-pri_mint_main/40 focus:border-pri_mint_main transition"
              }`}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Selector dropdowns */}
          {selectorFilters &&
            selectorFilters.map((selectorFilter, index) => {
              return (
                <div
                  className="min-w-[170px]"
                  key={selectorFilter.id + "__" + index}
                >
                  <Select
                    onValueChange={(value) => {
                      if (value === CLEAR_FILTER_VALUE) {
                        table
                          .getColumn(selectorFilter.id)
                          ?.setFilterValue(null);
                        setFilterSelectorValue((prevData) => ({
                          ...prevData,
                          [selectorFilter.id]: "",
                        }));
                        updateSearchParams(selectorFilter.id, "");
                      } else {
                        table
                          .getColumn(selectorFilter.id)
                          ?.setFilterValue(value);
                        setFilterSelectorValue((prevData) => ({
                          ...prevData,
                          [selectorFilter.id]: value,
                        }));
                        updateSearchParams(selectorFilter.id, value);
                      }
                    }}
                    value={filterSelectorValue[selectorFilter.id] || ""}
                    defaultValue={selectorFilter.placeholder}
                  >
                    <SelectTrigger
                      className={`${
                        selectBoxStyles
                          ? selectBoxStyles
                          : "h-11 w-full rounded-xl border border-hairline bg-white px-4 font-semibold text-pri_navy_main ring-offset-background focus:outline-none focus:ring-2 focus:ring-pri_mint_main/40"
                      }`}
                    >
                      <SelectValue placeholder={selectorFilter.placeholder} />
                    </SelectTrigger>

                    <SelectContent
                      className={`${
                        selectContentStyles
                          ? selectContentStyles
                          : "w-[240px] bg-white"
                      }`}
                    >
                      {selectorFilter.options.map((option, index) => {
                        return (
                          <SelectItem
                            className="hover:cursor-pointer"
                            value={option}
                            key={`${option}_${index}`}
                          >
                            {option}
                          </SelectItem>
                        );
                      })}

                      <SelectItem
                        value={CLEAR_FILTER_VALUE}
                        className="text-pri_red_main hover:cursor-pointer"
                      >
                        Clear Filter
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            })}

          {/* Bookmarked toggle */}
          {showBookmarkFilter && (
            <label
              className={`${PILL_BASE} ${
                showBookmarked
                  ? "bg-pri_gold_main border-pri_gold_dark text-ink shadow-sm"
                  : "bg-white border-hairline text-pri_navy_main hover:border-pri_gold_main"
              }`}
            >
              <input
                type="checkbox"
                checked={showBookmarked}
                onChange={(e) => {
                  e.preventDefault();
                  table
                    .getColumn("bookmark")
                    ?.setFilterValue(e.target.checked ? true : null);
                  setShowBookmarked(e.target.checked);
                }}
                className="sr-only"
              />
              <Bookmark
                className={`h-4 w-4 ${showBookmarked ? "fill-current" : ""}`}
              />
              Bookmarked
            </label>
          )}

          {/* Unattempted toggle */}
          {showStatusFilter && (
            <label
              className={`${PILL_BASE} ${
                showIncomplete
                  ? "bg-pri_navy_main border-pri_navy_dark text-white shadow-sm"
                  : "bg-white border-hairline text-pri_navy_main hover:border-pri_navy_main"
              }`}
            >
              <input
                type="checkbox"
                checked={showIncomplete}
                onChange={(e) => {
                  e.preventDefault();
                  table
                    .getColumn("status")
                    ?.setFilterValue(e.target.checked ? false : null);
                  setShowIncomplete(e.target.checked);
                }}
                className="sr-only"
              />
              <CircleDashed className="h-4 w-4" />
              Unattempted
            </label>
          )}

          {/* Guide toggle */}
          {displayGuide && (
            <button
              type="button"
              className={`${PILL_BASE} ${
                showGuide
                  ? "bg-pri_navy_main border-pri_navy_dark text-white"
                  : "bg-white border-hairline text-pri_navy_main hover:border-pri_mint_main"
              }`}
              onClick={() => setShowGuide((prev) => !prev)}
            >
              {showGuide ? "Close guide" : "Guide"}
            </button>
          )}
        </div>
      </div>

      {showGuide && (
        <div className="inline-flex p-3">
          <div className="bg-pri_bg_card pl-8 pr-2 rounded-lg flex flex-col items-center justify-center shadow-md p-2">
            <p className="font-semibold underline mb-2">Guide</p>
            <ul className="list-disc">
              <li>
                <p className="align-baseline tracking-wide">
                  Click{" "}
                  <span className="text-pri_navy_dark underline text-base hover:text-blue-600">
                    the underlined text
                  </span>{" "}
                  to open resource links
                </p>
              </li>
              <li>
                <p className="align-baseline tracking-wide">
                  Click
                  <Image
                    src={"/icons/solutionsIcon.svg"}
                    alt="tag icon"
                    height={28}
                    width={28}
                    className="inline relative -translate-y-1"
                  />
                  to open working solutions
                </p>
              </li>
              <li>
                <p className="align-baseline tracking-wide">
                  Click
                  <Image
                    src={"/icons/videoIcon.svg"}
                    alt="tag icon"
                    height={28}
                    width={28}
                    className="mx-1 inline relative"
                  />
                  to open video solutions
                </p>
              </li>
              {userName && (
                <li>
                  <p className="align-baseline tracking-wide">
                    Go to your{" "}
                    <Link
                      href={`/profile/${userName}`}
                      className="text-pri_navy_dark underline text-base hover:text-blue-600"
                    >
                      Profile
                    </Link>{" "}
                    to track your progress/bookmarks or set goals!
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ── Editorial table (always rendered; hidden on mobile when cards exist) ── */}
      <div className={renderCard ? "hidden md:block" : "block"}>
        <div
          className={
            tableWrapperClassName
              ? tableWrapperClassName
              : "overflow-x-auto rounded-2xl border border-hairline bg-white shadow-card"
          }
        >
          <Table className={tableStyles ? tableStyles : "w-full"}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className={`border-b-2 border-hairline hover:bg-transparent ${
                    headerRowStyles ? headerRowStyles : "bg-white"
                  }`}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-14">
                        <div
                          className={
                            headerCellStyles
                              ? headerCellStyles
                              : `flex_center text-ink text-[12px] font-bold uppercase tracking-[0.14em]`
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {data.length > 0 ? (
                table.getRowModel().rows.map((row) => {
                  const isComplete = (row.original as any)?.status === true;
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`border-b border-hairline last:border-0 border-l-[3px] ${
                        isComplete
                          ? "border-l-pri_mint_main"
                          : "border-l-transparent"
                      } ${dataRowStyles ? dataRowStyles : `hover:bg-pri_mint_main/5`}`}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            key={cell.id}
                            className={`px-4 py-3.5 ${
                              dataCellStyles
                                ? dataCellStyles
                                : "align-middle text-center"
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                // No data available
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Touch-friendly cards (mobile only) ── */}
      {renderCard && (
        <div className="md:hidden">
          {table.getRowModel().rows.length > 0 ? (
            <div className="grid gap-3.5">
              {table.getRowModel().rows.map((row) => (
                <div key={row.id}>{renderCard(row)}</div>
              ))}
            </div>
          ) : (
            <div className="aw-card">{emptyMessage}</div>
          )}
        </div>
      )}

      {data.length > 16 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="First page"
            className={PAGE_BTN}
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Previous page"
            className={PAGE_BTN}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <p className="px-2 font-mono text-sm font-semibold text-ink tnum whitespace-nowrap">
            {table.getState().pagination.pageIndex + 1}
            <span className="text-pri_navy_light"> / {table.getPageCount().toLocaleString()}</span>
          </p>

          <button
            type="button"
            aria-label="Next page"
            className={PAGE_BTN}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Last page"
            className={PAGE_BTN}
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </button>

          <div className="hidden sm:flex items-center gap-2 ml-2 text-sm text-pri_navy_light">
            <span className="font-semibold">Go to</span>
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                let page = e.target.value ? Number(e.target.value) - 1 : 0;
                const maxPage = table.getPageCount() - 1;

                if (page < 0) {
                  page = 0;
                } else if (page > maxPage) {
                  page = maxPage;
                }

                table.setPageIndex(page);
              }}
              className="h-10 w-14 rounded-xl border border-hairline bg-white text-center font-mono text-ink tnum focus:outline-none focus:ring-2 focus:ring-pri_mint_main/40 focus:border-pri_mint_main"
            />
          </div>
        </div>
      )}
    </div>
  );
}
