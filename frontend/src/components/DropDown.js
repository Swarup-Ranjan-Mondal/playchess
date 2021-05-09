import React, { useState } from "react";
import "../styles/dropdown.css";

const DropDown = ({ options, value, onChange }) => {
  const valueInOptions = () => {
    if (value === undefined) {
      return false;
    }

    var isPresent = false;
    options.forEach((option) => {
      if (option === value) {
        return (isPresent = true);
      }
    });
    return isPresent;
  };

  const toToggleCase = (string) => {
    var str = "";
    string.split(" ").forEach((word, i) => {
      if (i !== 0) {
        str += " ";
      }
      str += word[0].toUpperCase() + word.replace(word[0], "");
    });

    return str;
  };

  const clickHandler = (e) => {
    setActive(false);
    if (toToggleCase(e.target.id) !== selected) {
      setSelected(toToggleCase(e.target.id));
      if (onChange !== undefined) {
        e.target.value = e.target.id;
        onChange(e);
      }
    }
  };

  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(
    valueInOptions() ? toToggleCase(value) : ""
  );

  return (
    <div className="dropdown">
      <div className={`options_list ${active && "active"}`}>
        {options.map((option, i) => (
          <div
            key={`${option}`}
            className="option"
            id={`${option}`}
            onClick={clickHandler}
          >
            {toToggleCase(`${option}`)}
          </div>
        ))}
      </div>

      <div className="select" onClick={(e) => setActive((active) => !active)}>
        {selected === "" ? "Select..." : selected}
        <div
          className="arrow"
          style={{ backgroundImage: "url(/images/down_arrow.png)" }}
        />
      </div>
    </div>
  );
};

export default DropDown;
