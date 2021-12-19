import React, { useState, useEffect } from "react";
import "./DropDown.css";
import { toToggleCase } from "../../utils/helper";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const DropDown = ({ options, value, onChange }) => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
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

    if (valueInOptions()) {
      setSelected(`${value}`);
    }
  }, [value]);

  const selectHandler = (e) => {
    if (active === false) {
      setActive(true);

      window.onmousedown = (event) => {
        if (event.target !== e.target) {
          setActive(false);
        }
      };
    } else {
      setActive(false);
    }
  };

  const optionSelectHandler = (e) => {
    setActive(false);
    if (e.target.id !== selected) {
      setSelected(e.target.id);
      if (onChange !== undefined) {
        e.target.value = e.target.id;
        onChange(e);
      }
    }
  };

  return (
    <div className="drop-down">
      <div className="select" onClick={selectHandler}>
        {active ? <FaChevronUp /> : <FaChevronDown />}
        {selected === "" ? "Select..." : toToggleCase(selected)}
      </div>

      <div className={`options-list ${active && "active"}`}>
        {options.map((option) => (
          <div
            key={`${option}`}
            className="option"
            id={`${option}`}
            onMouseDown={optionSelectHandler}
          >
            {toToggleCase(`${option}`)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropDown;
