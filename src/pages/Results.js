import React, { useEffect, useState } from "react";
import axios from "axios";
import auth from "../env";

const Results = () => {
  const [matchData, setMatchData] = useState([]);
  const [gameDate, setGameDate] = useState("");
  const [gameName, setGameName] = useState("");

  // Helper method to determine the host
  const getHost = () => (auth.DEV ? auth.DEV_URL : auth.PROD_URL);
  const host = getHost();

  useEffect(() => {
    const fetchResults = async () => {
      const path = `${host}/api/result/`;
      console.log(path);
      try {
        const response = await axios.get(path);
        if (response.data.data) setMatchData(response.data.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    const fetchGame = async () => {
      const path = `${host}/api/result/game`;
      console.log(path);
      try {
        const response = await axios.get(path);
        if (response.data.data) {
          setGameName(response.data.data[0].GameName);
          setGameDate(response.data.data[0].GameDate);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
    fetchGame();
  }, []);

  const calculateStandings = (matches) => {
    const teams = {};

    matches.forEach(({ Team1, Team2, Result1, Result2, Status }) => {
     
      if((Result1 != null && Result2!=null) && Status == "Z"){

        console.log(Team1+"  "+Result1)
      if (!teams[Team1])
        teams[Team1] = { name: Team1, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 };
      if (!teams[Team2])
        teams[Team2] = { name: Team2, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 };

      teams[Team1].goalsFor += Result1;
      teams[Team1].goalsAgainst += Result2;
      teams[Team2].goalsFor += Result2;
      teams[Team2].goalsAgainst += Result1;

      teams[Team1].matchesPlayed=teams[Team1].matchesPlayed+1; 
      teams[Team2].matchesPlayed=teams[Team2].matchesPlayed+1;

      if (Result1 > Result2) {
        teams[Team1].points += 3;
      } else if (Result1 < Result2) {
        teams[Team2].points += 3;
      } else {
        teams[Team1].points += 1;
        teams[Team2].points += 1;
      }

      teams[Team1].goalDifference = teams[Team1].goalsFor - teams[Team1].goalsAgainst;
      teams[Team2].goalDifference = teams[Team2].goalsFor - teams[Team2].goalsAgainst;
    }
    });

    return Object.values(teams).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
  };
  const getTeamMatchesCount = (matches, teamName) => {
    return matches.filter(({ Team1, Team2, Result1, Result2, Status }) => 
        (Team1 === teamName || Team2 === teamName) && Result1 != null && Result2 != null && Status ==="Z"
    ).length;
};
  return (
    <div className="p-4 result resF">
      
      <h1 className="text-xl font-bold mb-4 text-center">{gameName}<img src="pogon.png" width="50" alt="Pogon" /></h1>
      <h3 className="text-center">{gameDate}</h3>
      <h2 className="text-xl font-bold mb-4 text-center">Tabela</h2>
      
      {/* Tabela Ligowa - Standings */}
      <div className="table-responsive resTable">
        <table className="table table-bordered tDark">
          <thead className="thead-dark tHead">
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Drużyna</th>
              <th className="text-center">Punkty</th>
              <th className="text-center">Mecze</th>
              <th className="text-center">B. Strzelone</th>
              <th className="text-center">B. Stracone</th>
              <th className="text-center">B. Bilans</th>
            </tr>
          </thead>
          <tbody>
            {calculateStandings(matchData).map((team, index) => (
              <tr key={team.name}>
                <td className="text-center">{index + 1}</td>
                <td>{team.name}</td>
                <td className="text-center">{team.points}</td>
                <td className="text-center">{getTeamMatchesCount(matchData, team.name)}</td>
                <td className="text-center">{team.goalsFor}</td>
                <td className="text-center">{team.goalsAgainst}</td>
                <td className="text-center">{team.goalDifference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabela wyników meczów */}
      <h2 className="text-xl font-bold mt-6 mb-4 text-center">Wyniki Meczów</h2>
      <div className="table-responsive resTable">
        <table className="table table-bordered tDark">
          <thead className="thead-light tHead">
            <tr>
              <th className="text-center">Mecz</th>
              <th className="text-center">Wynik</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {matchData
              .sort((a, b) => b.Id - a.Id) // Sortowanie od najwyższego ID do najniższego
              .map(({ Id, Team1, Team2, Result1, Result2, Status }) => (                
                <tr key={Id}>
                  <td className="text-center">{`${Team1} - ${Team2}`}</td>
                  <td className="text-center">{`${Result1 == null ? "-": Result1} - ${Result2 == null ? "-" : Result2}`}</td>
                  <td className="text-center">{`${Status == "N" ? "Zaplanowany": Status == "Z"? "Zakończony" : "W trakcie"}`}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
