import { useEffect, useState} from  'react';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

// Date picker for logs
const FilterMenuDatePicker = ({selectedDate, changeFilter}:FilterMenuDatePickerProps) => {

    const defaultStyles = useDefaultStyles();
    const [selected, setSelected] = useState<DateType>();

    useEffect(() => {
      if(selected !== undefined) {
        changeFilter(selected)
      }
    }, [selected])

    useEffect(() => {
      if(selectedDate !== null) setSelected(selectedDate)
    }, [selectedDate])
    
    
  return (
    <DateTimePicker
      mode="single"
      date={selected}
      onChange={({ date }) =>  setSelected(date)}
      styles={defaultStyles}
    />
  )
}

export default FilterMenuDatePicker