import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    const ENDPOINT = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
    const CODE = process.env.REACT_APP_APIKEY;

    const query = `{
      stop(id: "HSL:2112401") {
        name
        stoptimesWithoutPatterns(numberOfDepartures: 5) {
          scheduledArrival
          realtimeArrival
          trip {
            route {
              shortName
            }
          }
          realtime
          realtimeState
          headsign
        }
      }
    }`;

    fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'digitransit-subscription-key': CODE,
      },
      body: JSON.stringify({ query })
    })
      .then(response => response.json())
      .then(data => {
        setSchedule(data.data.stop.stoptimesWithoutPatterns);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log('Error:', error);
      });
  }, []);

  const themeClasses = [
    'bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white shadow-lg',
    'bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white shadow-lg',
    'bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white shadow-lg',
    'bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 text-white shadow-lg',
  ];

  const nextTheme = () => {
    setThemeIndex((prevIndex) => (prevIndex + 1) % themeClasses.length);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!schedule) {
    return <div>No schedule available</div>;
  }

  return (
    <div className={`p-4 ${themeClasses[themeIndex]} min-h-screen flex flex-col items-center`}>
      <h1 className="text-3xl font-bold mb-4 drop-shadow-lg shadow-black text-center bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
        Leppävaaran asema
      </h1>
      <table className="w-full table-auto bg-black bg-opacity-25 rounded-lg overflow-hidden shadow-2xl backdrop-filter backdrop-blur-lg">
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index} className="border-b border-gray-600 last:border-none">
              <td className="py-2 px-4 text-lg drop-shadow-md">{item.trip.route.shortName}</td>
              <td className="py-2 px-4 text-lg drop-shadow-md">{item.headsign}</td>
              <td className="py-2 px-4 text-lg drop-shadow-md">
                <span>{new Date(item.realtimeArrival * 1000).toLocaleTimeString()}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        onClick={nextTheme}
        className="mt-4 py-2 px-4 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
      >
        Switch Theme
      </button>
    </div>
  );
}

export default App;
