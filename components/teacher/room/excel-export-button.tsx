"use client"

import { useState } from "react"
import { FileSpreadsheet, Download, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import * as XLSX from "xlsx"

interface ExcelExportButtonProps {
  data: any[]
  filename?: string
  className?: string
  label?: string
  variant?: "primary" | "secondary" | "outline" | "ghost" | "icon"
  size?: "sm" | "md" | "lg"
}

export function ExcelExportButton({
  data,
  filename = "export.xlsx",
  className,
  label = "Export as Excel",
  variant = "primary",
  size = "md",
}: ExcelExportButtonProps) {
  const [exporting, setExporting] = useState(false)
  const [success, setSuccess] = useState(false)

  const exportToExcel = () => {
    if (exporting) return

    setExporting(true)

    setTimeout(() => {
      try {
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
        XLSX.writeFile(workbook, filename)

        setExporting(false)
        setSuccess(true)

        setTimeout(() => setSuccess(false), 2000)
      } catch (error) {
        console.error("Export failed:", error)
        setExporting(false)
      }
    }, 600) // Small delay for animation
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none shadow-md hover:shadow-lg"
      case "secondary":
        return "bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200"
      case "outline":
        return "bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 hover:border-purple-400"
      case "ghost":
        return "bg-transparent hover:bg-purple-50 text-purple-700"
      case "icon":
        return "bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 p-2 rounded-full"
      default:
        return "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none shadow-md hover:shadow-lg"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs py-1.5 px-3"
      case "lg":
        return "text-base py-3 px-6"
      default:
        return "text-sm py-2 px-4"
    }
  }

  return (
    <button
      onClick={exportToExcel}
      disabled={exporting}
      className={cn(
        "relative rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2",
        getVariantClasses(),
        variant !== "icon" && getSizeClasses(),
        success && "!bg-green-600 !text-white !border-green-600 hover:!bg-green-700",
        className,
      )}
    >
      <span className={cn("flex items-center gap-2 transition-opacity", (exporting || success) && "opacity-0")}>
        {variant !== "icon" && label}
        <FileSpreadsheet className={cn("h-4 w-4", variant === "icon" && "h-5 w-5")} />
      </span>

      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity opacity-0",
          exporting && "opacity-100",
        )}
      >
        <Download className="h-4 w-4 animate-bounce" />
      </span>

      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity opacity-0",
          success && "opacity-100",
        )}
      >
        <Check className="h-4 w-4" />
      </span>
    </button>
  )
}
