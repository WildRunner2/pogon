// import React, { useEffect, useState } from 'react';

// const ListenToSessionStorage = () => {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.storageArea === sessionStorage && event.key === 'user') {
//         const updatedValue = event.newValue ? JSON.parse(event.newValue) : null;
//         setUserData(updatedValue);
//       }
//     };

//     // Add event listener
//     window.addEventListener('storage', handleStorageChange);

//     // Cleanup event listener
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   return (
//     <div>
//       {userData
//           ? `User: ${userData.login} (ID: ${userData.logged})`
//           : 'No user data in sessionStorage'}
//     </div>
//   );
// };

// export default ListenToSessionStorage;
