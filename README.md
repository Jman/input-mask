# Input Mask

The component has a text input field that accepts date input in a specified format, defined by the placeholder prop. The input is validated and formatted in real time as the user types. If the input is not a valid date in the specified format, the error event is emitted. If the input is a valid date, The input value is updated and emitted through the modelValue prop, and also the `accept` event is emitted, and the date value is converted to a JavaScript Date object

## Watchers

There are two watchers that are used to monitor changes in certain values:

The first watcher watches the inputValue computed property, which is the formatted and masked input value. When the value of inputValue changes, this watcher checks if the new value is a valid date. If it is, it emits the update:modelValue and accept events. If it is not, it emits the error event. This watcher also focuses the input field if it is currently focused.

The second watcher watches the focused reactive property, which is a boolean value that indicates whether the input field is focused. When the value of focused changes, this watcher focuses the input field if it is true.

## Main functions

`keydownHandler`: This function is called when the user presses a key while the input field is focused. It handles input by the user and updates the input value accordingly.
focus: This function focuses the input field and sets the cursor position at the next available character position.

`validateDate`: This function checks if the input date string is a valid date in the specified format. This function splits the input string into its day, month, and year components using the `splitDate` function. It then checks that the day, month, and year are all valid numbers within their respective ranges (e.g. a month must be between 1 and 12). If any of the values are invalid, the function returns false.
