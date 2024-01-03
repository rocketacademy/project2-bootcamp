import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import NavDropdown from "react-bootstrap/NavDropdown";

const HistoryDropdown = (props) => {
  return (
    <DropdownButton
      id="dropdown-parent"
      title="Filters"
      autoClose="outside"
      variant={props.isDark ? "dark" : "secondary"}
      data-bs-theme={props.isDark ? "dark" : "secondary"}
    >
      <Dropdown.Header>Sort by</Dropdown.Header>
      <Dropdown.Item>
        <NavDropdown title="Time" id="basic-nav-dropdown">
          <NavDropdown.Item onClick={() => props.setSort("timeA")}>
            Ascending
          </NavDropdown.Item>
          <NavDropdown.Item onClick={() => props.setSort("timeD")}>
            Descending
          </NavDropdown.Item>
        </NavDropdown>
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Header>Filter by</Dropdown.Header>
      <Dropdown.Item onClick={() => props.filterTradesInput("stockCode")}>
        Stock code
      </Dropdown.Item>
      <Dropdown.Item onClick={() => props.filterTradesInput("stockName")}>
        Stock name
      </Dropdown.Item>
      <Dropdown.Item onClick={() => props.filterTradesInput("platform")}>
        Platform
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default HistoryDropdown;
