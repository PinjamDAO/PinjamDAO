"use client"
 
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
 
export function DatePicker({ date, setDate }: { date: Date, setDate: (d: Date) => void}) {

  const dayRef = useRef<HTMLInputElement>(null)
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  useEffect(() => {

    if (!date) return

    console.log(date)

    if (dayRef.current) dayRef.current.value = date.getDate().toString()
    if (monthRef.current) monthRef.current.value = (date.getMonth() + 1).toString()
    if (yearRef.current) yearRef.current.value = date.getFullYear().toString()

  }, [date])
 
  return (
    <div className="flex flex-row w-96 justify-between">
      <input className="bg-white text-black w-26 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
      ref={dayRef}
      placeholder="Day"
      type="number"
      onChange={(e) => {
        if (date && e.target.value !== '') {
          const newDate = new Date(date);
          newDate.setDate(Number(e.target.value));
          setDate(newDate);
        }
      }}
      />
      <input className="bg-white text-black w-26 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
      ref={monthRef}
      placeholder="Month"
      type="number"
      onChange={(e) => {
        if (date && e.target.value !== '') {
          const newDate = new Date(date);
          console.log(e.target.value)
          newDate.setMonth(Number(e.target.value) - 1);
          setDate(newDate);
        }
      }}
      />
      <input className="bg-white text-black w-26 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
      ref={yearRef}
      placeholder="Year"
      type="number"
      onChange={(e) => {
        if (date && e.target.value !== '') {
          const newDate = new Date(date);
          newDate.setFullYear(Number(e.target.value));
          setDate(newDate);
        }
      }}
      />
      <Popover>
        <PopoverTrigger asChild>
          <motion.button 
            className="flex flex-row justify-center items-center w-12 h-12 bg-[#5202DB]
            rounded-lg cursor-pointer text-white font-semibold"
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <CalendarIcon className="h-4 w-4" />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={(day) => {
              if (day) setDate(day);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>



   
  )
}