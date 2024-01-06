import Table from "react-bootstrap/Table";

function Grid() {
  return (
    <div className="Table">
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            {Array.from({ length: 5 }).map((_, index) => (
              <th key={index}>Table </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            {Array.from({ length: 5 }).map((_, index) => (
              <td key={index}>Table  {index}</td>
            ))}
          </tr>
          <tr>
            <td>2</td>
            {Array.from({ length: 5 }).map((_, index) => (
              <td key={index}>Table  {index}</td>
            ))}
          </tr>
          <tr>
            <td>3</td>
            {Array.from({ length: 5 }).map((_, index) => (
              <td key={index}>Table  {index}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default Grid;
