import React, { useState, useCallback } from 'react';
import { addMonths, format, startOfMonth, endOfMonth, isValid, isBefore } from 'date-fns';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import DownloadReportButton from './DownloadReport';
import ReportDownloadButton from './WeeklyReportButton';


const DashboardTopBar = ({ setFromDate, setToDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [error, setError] = useState('');
  const { toast } = useToast();

  const quickSelectRanges = [
    {
      label: 'This Month',
      getValue: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
      })
    },
    {
      label: 'Last Month',
      getValue: () => ({
        from: startOfMonth(addMonths(new Date(), -1)),
        to: endOfMonth(addMonths(new Date(), -1))
      })
    },
    {
      label: 'Last 3 Months',
      getValue: () => ({
        from: startOfMonth(addMonths(new Date(), -3)),
        to: endOfMonth(new Date())
      })
    }
  ];

  const validateDateRange = useCallback((range) => {
    if (!range.from || !range.to) {
      return 'Please select both start and end dates';
    }
    if (!isValid(range.from) || !isValid(range.to)) {
      return 'Invalid date selection';
    }
    if (isBefore(range.to, range.from)) {
      return 'End date must be after start date';
    }
    return '';
  }, []);

  const handleDateRangeChange = (newDateRange) => {
    const validationError = validateDateRange(newDateRange || {});
    setError(validationError);
    setDateRange(newDateRange || dateRange);
  };

  const handleGetResults = () => {
    const validationError = validateDateRange(dateRange);
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: validationError,
      });
      return;
    }

    try {
      console.log("Date Range:", dateRange);
      setFromDate(format(dateRange.from, 'yyyy-MM-dd'));
      setToDate(format(dateRange.to, 'yyyy-MM-dd'));
      setIsOpen(false);
      
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update date range. Please try again.",
      });
    }
  };

  return (
    <div className="w-full bg-white border border-gray-300 shadow-sm rounded-md">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Issues Analytics</h1>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <ReportDownloadButton toDate={dateRange.to} fromDate={dateRange.from} />
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-full sm:w-[300px]",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 border-b">
                  <div className="space-y-2">
                    {quickSelectRanges.map((range, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => handleDateRangeChange(range.getValue())}
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
                {error && (
                  <Alert variant="destructive" className="mt-2 mx-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="p-3 border-t">
                  <Button 
                    className="w-full"
                    onClick={handleGetResults}
                    disabled={!!error}
                  >
                    Get Results
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopBar;