import { useEffect, useRef, useState } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from 'react-router-dom';
import avatar from '../../assets/images/developer.jpeg';



const mapStyle = [
  {
      "featureType": "administrative",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "lightness": 33
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
          {
              "color": "#f2e5d4"
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#c5dac6"
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "labels",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "lightness": 20
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
          {
              "lightness": 20
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#c5c6c6"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#e4d7c6"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#fbfaf7"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#acbcc9"
          }
      ]
  }
]

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showMap, setShowMap] = useState(false); 
  const mapRef = useRef(null);

  useEffect(() => {
    async function fetchUsers() {
      const usersRef = collection(db, "users");
      let queryRef = query(usersRef);
      if (selectedLanguage) {
        queryRef = query(usersRef, where('languages', '==', selectedLanguage));
      }
      const snapshot = await getDocs(queryRef);
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    }
    fetchUsers();
  }, [selectedLanguage]);



  useEffect(() => {
    if (showMap && mapRef.current) {
      const amsterdam = { lat: 52.3676, lng: 4.9041 };
      const map = new window.google.maps.Map(mapRef.current, {
        center: amsterdam,
        zoom: 8,
        styles: mapStyle,
      });
      
      users.forEach(user => { // add markers for each user

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(user.location)}&key=AIzaSyDILSOzFL1ECM95bw8rm5pq9DHdBo-pNx8`;

        if(user.location) {

          fetch(url)
            .then(response => response.json())
            .then(data => {
              // Extract the latitude and longitude from the geocoding response
              const { lat, lng } = data.results[0].geometry.location;
              const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map,
                icon: {
                  // path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, // or any other symbol path
                  path: window.google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
                  fillColor: '#38A169',
                  fillOpacity: 3,
                  strokeWeight: 0,
                  scale: 5,
                },                // title: user.name,
                label: {
                  text: `${user.name}: ${user.languages}`,
                  color: 'black',
                  fontSize: '14px',
                  fontWeight: 'bold',
                },
              });
              marker.addListener('click', () => {
                <Link to={`/profile/${user.uid}`} />;
              });

              // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
            })
            .catch(error => console.error(error));
        }
      });
    }
  }, [showMap, users]);



  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };



  const handleMapToggle = () => {
    setShowMap(!showMap);
  };
  

  return (
    <> 
    <div className="py-4 px-0.2 sm:px-8 grid grid-cols-2 gap-2 md:grid-cols-3 sm:gap-4">
      <h2 className="text-2xl font-bold sm:mb-4 col-span-3">Find other developers</h2>
      <div className="col-span-3 ">
        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageSelect(e.target.value)}
          className="border-gray-300 border-2 p-2 rounded-md"
        >
          <option value="">Show all developers</option>
          <option value="JavaScript">JavaScript</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
          <option value="C#">C#</option>
          <option value="PHP">PHP</option>
          <option value="C++">C++</option>
        </select>

      <button onClick={handleMapToggle} className="ml-4 bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          {showMap ? "Hide Map" : "Show Map"}
        </button> 
        </div>
        </div>
        <div className="py-4 px-0.2 sm:px-8 grid grid-cols-2 gap-2 md:grid-cols-3 sm:gap-4">
            {users.map((user) => (
            <Link key={user.id} to={`/profile/${user.uid}`}>
            <div key={user.id} className="bg-white  w-full h-full p-2 rounded-md shadow-md items-center inline-flex min-w-min hover:translate-y-1 duration-500 ease-in-out">                    <img src={user.image || avatar} alt="userImage" className="w-10 h-10 mr-2 sm:mr-3 rounded-full"/>
                <div>
                  <p className="text-base font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.location}</p>
                  <p className="text-green-600 text-xs">{user.languages}</p>
                </div>
              </div>
            </Link>
          ))}
            </div>
          {showMap && (
          <div className="col-span-3 h-96 mt-4" ref={mapRef}></div>
          )}
    </>    );
}

export default UserList;
