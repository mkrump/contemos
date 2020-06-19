import React from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

export default function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// <TextField
//   label="react-number-format"
//   value={values.numberformat}
//   onChange={handleChange}
//   name="numberformat"
//   id="formatted-numberformat-input"
//   InputProps={{
//     inputComponent: NumberFormatCustom,
//   }}
