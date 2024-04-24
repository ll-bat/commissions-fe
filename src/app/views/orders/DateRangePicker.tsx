import { type FC, useCallback, useState } from "react";
import { Card, DatePicker, type Range } from "@shopify/polaris";

const DateRangePicker: FC<{
  month: number;
  year: number;
  onSelect: (start: Date, end: Date) => void;
}> = ({ month, year, onSelect }) => {
  const [date, setDate] = useState<{ month: number; year: number }>({
    month,
    year,
  });
  const [selectedDates, setSelectedDates] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(),
    end: new Date(),
  });

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({ month, year }),
    [],
  );

  const handleChangeDates = (date: Range) => {
    setSelectedDates(date);
    onSelect(date.start, date.end);
  };

  return (
    <Card>
      <DatePicker
        month={date.month}
        year={date.year}
        onChange={handleChangeDates}
        onMonthChange={handleMonthChange}
        selected={selectedDates}
        allowRange={true}
      />
    </Card>
  );
};

export default DateRangePicker;
