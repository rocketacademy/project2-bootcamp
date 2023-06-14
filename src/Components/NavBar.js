// import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import "../App.css";

// export default function NavBar({ isLoggedIn }) {
//   return (
//     <div className="nav-bar">
//       <Navbar bg="light" fixed="top">
//         <Container>
//           <Navbar.Brand href="#home">
//             <img
//               alt="Money Stack Emoji"
//               src="https://em-content.zobj.net/thumbs/240/apple/354/dollar-banknote_1f4b5.png"
//               width="30"
//               height="30"
//               className="d-inline-block align-top"
//             />{" "}
//             Dollar Direction
//           </Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="mr-auto">
//               <Nav.Link as={Link} to="/mapexpenses">
//                 MapExpenses
//               </Nav.Link>
//               <Nav.Link as={Link} to="/dashboard">
//                 Dashboard
//               </Nav.Link>
//               <Navbar.Collapse id="basic-navbar-nav">
//                 <Nav className="ml-auto">
//                   <NavDropdown
//                     title={
//                       <img
//                         src="https://firebasestorage.googleapis.com/v0/b/project2-b6874.appspot.com/o/%20profilePhoto%2FAV4TtwPCa8geRvJNMqLlfcmRBuy1%2FJigglypuff.png?alt=media&token=071b8602-e056-4d20-b048-184cf67b2344"
//                         alt="user"
//                         width="30"
//                         height="30"
//                       />
//                     }
//                     id="basic-nav-dropdown"
//                   >
//                     <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
//                     <NavDropdown.Item
//                       onClick={(e) => {
//                         setIsLoggedIn(false);
//                         signOut(auth);
//                         setUser({});
//                       }}
//                     >
//                       Logout
//                     </NavDropdown.Item>
//                   </NavDropdown>
//                 </Nav>
//               </Navbar.Collapse>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//     </div>
//   );
// }

// // {
// //   /* {isLoggedIn ? (
// //   <Nav.Link as={Link} to="/authForm">
// //     Logout
// //   </Nav.Link>
// // ) : (
// //   <Nav.Link as={Link} to="/authForm">
// //     Login
// //   </Nav.Link>
// // )} */
// // }
