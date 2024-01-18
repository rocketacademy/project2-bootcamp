// import React, { useEffect, useState } from "react";
// import { onValue, ref as databaseRef, remove } from "firebase/database";
// import { database } from "../firebase";
// import { Table } from "react-bootstrap";
// const WatchLists = () => {
//   const [watchData, setWatchlistData] = useState([]);

//   useEffect(() => {
//     const stockListRef = databaseRef(database, "stock");
//     const unsubscribe = onValue(stockListRef, (snapshot) => {
//       const stockArray = [];
//       snapshot.forEach((childSnapshot) => {
//         const stockItem = {
//           id: childSnapshot.key,
//           ...childSnapshot.val(),
//         };
//         stockArray.push(stockItem);
//       });
//       setWatchlistData(stockArray);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleDelete = (id) => {
//     const stockItemRef = databaseRef(database, `stock/${id}`);
//     remove(stockItemRef);
//   };

//   return (
//     <div>
//       <h2>Watchlist</h2>
//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Description</th>

//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {watchData?.map((stockItem) => (
//             <tr key={stockItem.id}>
//               <td>{stockItem.title}</td>
//               <td>{stockItem.description}</td>

//               <td>

//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke-width="1.5"
//                   stroke="red"
//                   className="w-3 h-3"
//                   style={{
//                     width: "25px",
//                     height: "25px",
//                   }}
//                   onClick={() => handleDelete(stockItem.id)}
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                   />
//                 </svg>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default WatchLists;
// Import necessary libraries
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the Table component
const WatchLists = () => {
  // Sample data for the table
  const data = [
    { id: 1, col1: "Tesla", col2: "$87.5", col3: "52.1", col4: "342" },
    { id: 2, col1: "Ford Motor", col2: "$4.6", col3: "38.1", col4: "122" },
    { id: 3, col1: "Disney Co", col2: "$2.2", col3: "25.6", col4: "175" },
    { id: 4, col1: "Carnival Co", col2: "$0.73", col3: "19.9", col4: "123" },
    { id: 5, col1: "AliBaba", col2: "$1.05", col3: "1.63", col4: "34" },
    { id: 6, col1: "Amazon.com", col2: "$17.5", col3: "1.67", col4: "123" },
  ];

  return (
    <table className="table table-bordered border-none">
      {/* <thead className="table-dark">
      <tr>
        <th>ID</th> 
        <th>Tesla</th>
        <th>Ford Motor</th>
        <th>Disney Co</th>
        <th>Carnival Co</th>
      </tr>
    </thead> */}
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {/* <td>{row.id}</td> */}
            <td className="text-start font-weight-bold">{row.col1}</td>
            <td>{row.col2}</td>
            <td className="text-success">+${row.col3}</td>
            <td className="text-danger ">
              <span className="bg-body-secondary p-1 rounded-2">
            <svg xmlns="http://www.w3.org/2000/svg" 
            width="16"
            height="16"
            fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
</svg>
              -{row.col4}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Export the component
export default WatchLists;
