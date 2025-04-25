"use client"
// import { useState } from "react";
// import axios from "axios";

// const LocationComponent = () => {
//   const [location, setLocation] = useState(null);
//   const [city, setCity] = useState("");
//   const getLocation = () => {
//     if ("geolocation" in navigator) {
//       navigator.permissions.query({ name: "geolocation" }).then((result) => {
//         if (result.state === "denied") {
//           alert("You have blocked location access. Please enable it in your browser settings.");
//           return;
//         }
  
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             const { latitude, longitude } = position.coords;
//             setLocation({ latitude, longitude });
  
//             try {
//               const response = await axios.get(
//                 `http://localhost:5000/api/location?latitude=${latitude}&longitude=${longitude}`
//               );
//               setCity(response.data.city);
//             } catch (error) {
//               console.error("Error fetching city:", error);
//             }
//           },
//           (error) => {
//             if (error.code === error.PERMISSION_DENIED) {
//               alert("Location access is denied. Enable it in your browser settings.");
//             }
//           }
//         );
//       });
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };
  
//   return (
//     <div>
//       <button onClick={getLocation}>Get Location</button>
//       {location && (
//         <p>
//           Latitude: {location.latitude}, Longitude: {location.longitude}
//         </p>
//       )}
//       {city && <p>City: {city}</p>}
//     </div>
//   );
// };

// export default LocationComponent;



///////////////////////////////////////////////////



// import { useState } from "react";
// import axios from "axios";
// const LocationComponent = () => {
//   const [location, setLocation] = useState(null);
//   const [city, setCity] = useState("");
//   const getLocation = () => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//           // Reverse Geocoding API Call
//           try {
//             const response = await axios.get(
//               `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=45228461d9a245fea4ca7a1569e0b2a4`
//             );
//             console.log(response);
//             console.log(response.data,'response.data');
            
//             const cityName = response.data.results[0]?.components?.city || "Unknown";
//             setCity(cityName);
//           } catch (error) {
//             console.error("Error fetching city:", error);
//           }
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };
//   return (
//     <div>
//       <button onClick={getLocation}>Get Location</button>
//       {location && (
//         <p>
//           Latitude: {location.latitude}, Longitude: {location.longitude}
//         </p>
//       )}
//       {city && <p>City: {city}</p>}
//     </div>
//   );
// };
// export default LocationComponent;



import { useState } from "react";
import axios from "axios";

const LocationComponent = () => {
  const [locationData, setLocationData] = useState(null);

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=45228461d9a245fea4ca7a1569e0b2a4`
            );

            console.log(response.data, "response.data");

            if (response.data.results.length > 0) {
              const components = response.data.results[0]?.components || {};

              const locationDetails = {
                city: components.city || components.town || components.village || "Unknown",
                country: components.country || "Unknown",
                countryCode: components["ISO_3166-1_alpha-2"] || "Unknown",
                lat: latitude,
                lon: longitude,
                region: components.state || "Unknown",
                regionName: components.state_district || "Unknown",
                timezone: response.data.results[0]?.annotations?.timezone?.name || "Unknown",
                zip: components.postcode || "Unknown",
              };

              setLocationData(locationDetails);
            }
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <button onClick={getLocation}>Get Location</button>
      {locationData && (
        <div>
          <p>City: {locationData.city}</p>
          <p>Country: {locationData.country} ({locationData.countryCode})</p>
          <p>Latitude: {locationData.lat}, Longitude: {locationData.lon}</p>
          <p>Region: {locationData.region}, {locationData.regionName}</p>
          <p>Timezone: {locationData.timezone}</p>
          <p>ZIP Code: {locationData.zip}</p>
        </div>
      )}
    </div>
  );
};

export default LocationComponent;
