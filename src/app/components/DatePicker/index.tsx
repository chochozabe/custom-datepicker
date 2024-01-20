import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { format, isValid } from "date-fns";
import ko from "date-fns/locale/ko";

import "react-datepicker/dist/react-datepicker.css";
import "./customDatePicker.css";

registerLocale("ko", ko);

interface ICustomDatePickerProps {
  selectedDate?: Date;
  onChange: (date?: Date | null) => void;
  showHandler?: boolean;
  title?: string;
  helperText?: string;
  errorMessage?: string;
}

const CustomDatePicker = ({
  selectedDate,
  onChange,
  showHandler = false,
  title,
  helperText,
  errorMessage,
}: ICustomDatePickerProps) => {
  const ref = useRef<DatePicker>(null);
  const inputRef = useRef(null);
  const [prevValue, setPrevValue] = useState<Date | null>();

  const CustomInput = forwardRef(function Input(
    { value, onClick, className, ...props }: any,
    fwRef: ForwardedRef<HTMLInputElement>
  ) {
    const [isInvalidValue, setIsInvalidValue] = useState(false);
    const isCalendarClose = !ref.current?.isCalendarOpen();

    const inputHandler = (value: any, e: ChangeEvent) => {
      // const splitDate = value.split('. ');
      // if (splitDate.length === 1 && splitDate[0].length === 4) {
      //   onChange(new Date(splitDate[0]));
      //   e.preventDefault();
      // } else if (splitDate.length === 2 && splitDate[1].length === 2) {
      //   onChange(new Date(splitDate.join('. ')));
      //   e.preventDefault();
      // } else if (splitDate.length === 3 && splitDate[2].length === 2) {
      //   onChange(new Date(splitDate.join('. ')));
      //   e.preventDefault();
      // }
    };

    const dateValidation = useCallback(
      (checkValue?: Date) => {
        if (checkValue) {
          return isValid(checkValue);
        } else {
          return value && isValid(ref.current?.props.selected);
        }
      },
      [value]
    );
    /*
    useEffect(() => {
      setIsInvalidValue(dateValidation(value));
    }, [dateValidation, value]);
    */

    return (
      <div className="custom-input-wrap" ref={fwRef}>
        {title && <span className="Sub2_M color-neut700">{title}</span>}
        <div
          className={`custom-input ${isInvalidValue ? "error" : ""}`}
          onClick={onClick}
        >
          <input
            type="text"
            className={`${className} Sub2_R`}
            value={value}
            placeholder="년도. 월. 일"
            onChange={(e) => {
              if (isValid(new Date(e.currentTarget.value)))
                onChange(new Date(e.currentTarget.value));
            }}
          />
        </div>
        {isCalendarClose && (
          <>
            {helperText && !isInvalidValue && (
              <span className="Body2_R color-neut700">{helperText}</span>
            )}
            {isInvalidValue && (
              <span className="error-message Body2_R">에러 메세지</span>
            )}
          </>
        )}
      </div>
    );
  });

  const clearHandler = () => {
    onChange();
    ref.current?.isCalendarOpen() && closeHandler();
  };

  const closeHandler = () => {
    ref.current?.setOpen(false);
  };

  const handleChange = (date: Date) => {
    if (date instanceof Date && isValid(date)) {
      onChange(date);
    }
  };

  // const CustomInput = forwardRef((props: any, ref) => {
  //   return <Input {...props} ref={ref} />;
  // });

  return (
    <DatePicker
      ref={ref}
      locale={ko}
      dateFormat={"yyyy. MM. dd"}
      showPopperArrow={false}
      selected={selectedDate}
      onChange={onChange}
      onCalendarOpen={() => {
        setPrevValue(ref?.current?.props.selected);
      }}
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => {
        return (
          <div className="custom-header">
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              {"<"}
            </button>
            <div>
              <span className="Body1_M">{format(date, "MM")}</span>
              <span className="Body2_M">월</span>
              <span className="Body1_M">{format(date, "yyyy")}</span>
            </div>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              {">"}
            </button>
          </div>
        );
      }}
      // customInput={<CustomInput inputRef={inputRef} />}
      customInput={<CustomInput />}
    />
  );
};

export default CustomDatePicker;
