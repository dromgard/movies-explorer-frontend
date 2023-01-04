import React from "react";

function FilterCheckbox() {
  return (
    <label className="filtercheckbox">
      <input type="checkbox" className="filtercheckbox__input checkbox" />
      <span className="filtercheckbox__text">Короткометражки</span>
    </label>
  )
}

export default FilterCheckbox;
