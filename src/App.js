import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ENDPOINT = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
    const CODE = 'API-KEY'
  
    const query = `{
      stop(id: "HSL:2112401") {
        name
        stoptimesWithoutPatterns(numberOfDepartures: 3) {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!schedule) {
    return <div>No schedule available</div>;
  }

  return (
    <div>
      <h1>
        Leppävaaran asema
      </h1>
      <table>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>{item.trip.route.shortName}</td>
              <td>{item.headsign}</td>
              <td>
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
