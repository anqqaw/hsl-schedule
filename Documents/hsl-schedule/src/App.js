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
        'digitransit-subscription-key':`${CODE}`,
      },
      body: JSON.stringify({ query })
    })
      .then(function(response) {
        if(response.ok) {
          return response.text();
        }
        throw new Error('Something went wrong');
      })
      .then(data => {
        console.log(data);
        setSchedule(data.stop);
      })
      .catch(error => {
        setLoading(false);
        console.log('Error:', error);
      });
  });

  if (!loading) {
    return <div>Loading...</div>;
  }

  if (!schedule) {
    return <div>No schedule available.</div>;
  }

  return (
    <div>
      <h1>
        Leppävaaran asema
      </h1>
      <table>
        <tbody>
            {schedule && schedule.map((stoptime, index) => (
              <tr key={index}>
                <td>{stoptime.trip.route.shortName}</td>
                <td>{stoptime.headsign}</td>
                <td>
                  <span>11.30</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default App;
