import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ENDPOINT = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
    const CODE = '95bcc82b681a4d8ab35a4813ca1390f2'
  
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
        console.log(data.data);
        setSchedule(data.data.stop.stoptimesWithoutPatterns);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log('Error:', error);
      });
  }, []);

  const themeClasses = {
    darkPurple: 'bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white shadow-lg',
    red: 'bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white shadow-lg',
    green: 'bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white shadow-lg',
    blue: 'bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 text-white shadow-lg',
  };
  
  const selectedTheme = themeClasses.darkPurple; 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!schedule) {
    return <div>No schedule available</div>;
  }

  return (
    <div className={`p-4 ${selectedTheme} min-h-screen flex flex-col items-center`}>
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
    </div>
  );
}

export default App;
