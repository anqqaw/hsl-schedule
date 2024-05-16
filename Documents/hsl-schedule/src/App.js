import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [schedule, setSchedule] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const ENDPOINT = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
    const CODE = 'API-key'
  
    const query = `{
      stop(id: HSL:2112401) {
        name
        stoptimesWithoutPatterns(numberOfDepartures: 3) {
          scheduledArrival
          trip {
            route {
              shortName
            }
          }
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
      body:JSON.stringify( {query} )  
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  });

  return (
    <div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          {schedule.name.replace('Leppävaaran asema', '')}
        </h1>

        <tbody>
            {schedule.stoptimesWithoutPatterns.map((stoptime, index) => (
              <tr key={index}>
                <td className="p-2 border-b border-white text-xl md:text-8xl">{stoptime.trip.route.shortName}</td>
                <td className="p-2 border-b border-white text-xl md:text-7xl">{stoptime.headsign}</td>
                <td className="p-2 border-b border-white text-xl md:text-8xl">
                  <span className="pr-1">11.30</span>
                </td>
              </tr>
            ))}
          </tbody>
    </div>
  );
}

export default App;
