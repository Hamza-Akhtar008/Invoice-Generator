"use client"

import type React from "react"

import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface DateTimePickerProps {
  date: Date
  setDate: (date: Date) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number)
    if (!isNaN(hours) && !isNaN(minutes)) {
      const newDate = new Date(date)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      setDate(newDate)
    }
  }

  return (
    <div className="flex gap-2">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                const updatedDate = new Date(newDate)
                updatedDate.setHours(date.getHours())
                updatedDate.setMinutes(date.getMinutes())
                updatedDate.setSeconds(date.getSeconds())
                setDate(updatedDate)
                setIsCalendarOpen(false)
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center">
        <Clock className="mr-2 h-4 w-4" />
        <Input
          type="time"
          value={`${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`}
          onChange={handleTimeChange}
          className="w-[120px]"
        />
      </div>
    </div>
  )
}
