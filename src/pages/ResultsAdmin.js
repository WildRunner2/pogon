import React, { useEffect, useState } from "react";
import axios from "axios";
import auth from "../env";

const Results = () => {
  const [matchData, setMatchData] = useState([]);
  const [newMatch, setNewMatch] = useState({ team1: "", team2: "", result1: "", result2: "", status: "N" });
  const [editingMatch, setEditingMatch] = useState(null);
  const [teamData, setTeamData] = useState([]); // State for storing teams
  const [newTeamName, setNewTeamName] = useState(""); // State for new team name
  const [tournament, setTournament] = useState({ gameName: "", gameDate: "" });

  const getHost = () => (auth.DEV ? auth.DEV_URL : auth.PROD_URL);
  const host = getHost();


// Fetch tournament data
const fetchTournament = async () => {
  try {
    const response = await axios.get(`${host}/api/result/game`);
    if (response.data.data.length > 0) setTournament(response.data.data[0]);
  } catch (error) {
    console.error("Error fetching tournament data:", error);
  }
};

// Update tournament data
const updateTournament = async () => {
  try {
    await axios.put(`${host}/api/result/game`, {
      gameName: tournament.GameName,
      gameDate: tournament.GameDate,
    });
    fetchTournament();
  } catch (error) {
    console.error("Error updating tournament:", error);
  }
};

useEffect(() => {
  fetchTournament();
}, []);

  // Fetch teams data
  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${host}/api/result/teams`);
      if (response.data.data) setTeamData(response.data.data); // Set teams data
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  // Fetch match results
  const fetchResults = async () => {
    const path = `${host}/api/result/`;
    try {
      const response = await axios.get(path);
      if (response.data.data) setMatchData(response.data.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  // Fetch teams and results when component mounts
  useEffect(() => {
    fetchResults();
    fetchTeams();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingMatch) {
      setEditingMatch({ ...editingMatch, [name]: value });
    } else {
      setNewMatch({ ...newMatch, [name]: value });
    }
  };

  // Add match
  const handleAddMatch = async () => {
    const newMatchData = {
      team1: newMatch.team1,
      team2: newMatch.team2,
      result1: newMatch.result1 == '' ? null : newMatch.result1,
      result2: newMatch.result2 == '' ? null : newMatch.result2,
      status: newMatch.status,
    };
    try {
      
      await axios.post(`${host}/api/result/`, newMatchData);

      setNewMatch({ team1: "", team2: "", result1: "", result2: "", status:"N" }); // Clear form
      fetchResults(); // Refresh results
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };

  // Edit match
  const handleEditMatch = async () => {
    const updatedMatchData = {
      id: editingMatch.id,
      team1: editingMatch.team1,
      team2: editingMatch.team2,
      result1: editingMatch.result1,
      result2: editingMatch.result2,
      status: editingMatch.status,
    };
    try {
      await axios.put(`${host}/api/result/`, updatedMatchData);
      setEditingMatch(null); // Clear editing state
      fetchResults(); // Refresh results
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  // Delete match
  const handleDeleteMatch = async (id) => {
    try {
      await axios.delete(`${host}/api/result/`, { data: { id } });
      fetchResults(); // Refresh results
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId) => {
    try {
      await axios.delete(`${host}/api/result/teams`, { data: { id: teamId } });
      fetchTeams(); // Refresh teams
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  // Add new team
  const handleAddTeam = async () => {
    if (!newTeamName) return; // Don't add an empty team name
    const newTeamData = {
      teamName: newTeamName, // Use `teamName` for posting a new team
    };

    try {
      await axios.post(`${host}/api/result/teams`, newTeamData);
      setNewTeamName(""); // Clear the input field
      fetchTeams(); // Refresh teams after adding
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  // Helper function to calculate standings based on match results
  const calculateStandings = (matches) => {
    const teams = {};
 
    matches.forEach(({ Team1, Team2, Result1, Result2, Status }) => {
      if((Result1 != null && Result2!=null) && Status === "Z"){
      if (!teams[Team1])
        teams[Team1] = { name: Team1, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 };
      if (!teams[Team2])
        teams[Team2] = { name: Team2, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 };

      teams[Team1].goalsFor += Result1;
      teams[Team1].goalsAgainst += Result2;
      teams[Team2].goalsFor += Result2;
      teams[Team2].goalsAgainst += Result1;

      teams[Team1].matchesPlayed++;
      teams[Team2].matchesPlayed++;

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
    <div className="p-4 resF resF2">
      {/* Matches Table */}
      <h2 className="text-xl font-bold mb-4">Tabela Ligowa</h2>
      <table className="w-full border-collapse border border-gray-300 resF2">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Drużyna</th>
            <th className="border p-2">Punkty</th>
            <th className="text-center">Mecze</th>
            <th className="border p-2">Bramki Strzelone</th>
            <th className="border p-2">Bramki Stracone</th>
            <th className="border p-2">Bilans Bramkowy</th>
          </tr>
        </thead>
        <tbody>
          {calculateStandings(matchData).map((team, index) => (
            <tr key={team.name} className="border">
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{team.name}</td>
              <td className="border p-2 text-center">{team.points}</td>
              <td className="border p-2 text-center">{getTeamMatchesCount(matchData, team.name)}</td>
              <td className="border p-2 text-center">{team.goalsFor}</td>
              <td className="border p-2 text-center">{team.goalsAgainst}</td>
              <td className="border p-2 text-center">{team.goalDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      {/* All Matches Table */}
      <h2 className="text-xl font-bold mt-6 mb-4">Wyniki Meczów</h2>
      <table className="w-full border-collapse border border-gray-300 resF2">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Mecz</th>
            <th className="border p-2">Wynik</th>
            <th className="border p-2">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {matchData
            .sort((a, b) => b.Id - a.Id)
            .map(({ Id, Team1, Team2, Result1, Result2,Status }) => (
              <tr key={Id} className="border">
                <td className="border p-2 text-center ">{`${Team1} - ${Team2}`}</td>
                <td className="border p-2 text-center ">{`${Result1} : ${Result2}`}</td>
                <td className="text-center">{`${Status}`}</td>
                <td className="border p-2 text-center ">
                  <button
                    onClick={() => {
                      setEditingMatch({ id: Id, team1: Team1, team2: Team2, result1: Result1, result2: Result2, status: Status });
                    }}
                    className="btn-warning "
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDeleteMatch(Id)}
                    className="btn-danger "
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <br />
      {/* Match Management */}
      <h2 className="text-xl font-bold mt-6 mb-4">Dodaj lub Edytuj Mecz</h2>
      <div className="flex flex-col space-y-5 paddingAdd Teams2">
        {/* Select Team 1 */}
        <select
          name="team1"
          value={editingMatch ? editingMatch.team1 : newMatch.team1}
          onChange={handleInputChange}
          className="border p-1 resultAddField bigFont2"
        >
          <option value="" className="bigFont2">Drużyna 1</option>
          {teamData
            .filter((team) => team.Name !== "undefined") // Filter out "undefined" team names
            .map((team) => (
              <option key={team.Id} value={team.Name}>
                {team.Name}
              </option>
            ))}
        </select>
        {/* Select Team 2 */}
        <select
          name="team2"
          value={editingMatch ? editingMatch.team2 : newMatch.team2}
          onChange={handleInputChange}
          className="border p-1 resultAddField bigFont2"
        >
          <option value="">Drużyna 2</option>
          {teamData
            .filter((team) => team.Name !== "undefined") // Filter out "undefined" team names
            .map((team) => (
              <option key={team.Id} value={team.Name}>
                {team.Name}
              </option>
            ))}
        </select>
            <br></br>
        {/* Input for Result 1 */}
        <input
          type="number"
          name="result1"
          placeholder="Wynik Drużyna 1"
          value={editingMatch ? editingMatch.result1 : newMatch.result1}
          onChange={handleInputChange}
          className="border p-1 resultAddField bigFont2"
        />
        {/* Input for Result 2 */}
        
        <input
          type="number"
          name="result2"
          placeholder="Wynik Drużyna 2"
          value={editingMatch ? editingMatch.result2 : newMatch.result2}
          onChange={handleInputChange}
          className="border p-1 resultAddField bigFont2"
        />
        <select
          name="status"
          value={editingMatch ? editingMatch.status : newMatch.status}
          onChange={handleInputChange}
          className="border p-1 resultAddField bigFont2"
        >
          <option value={editingMatch? editingMatch.status : "N"}>{editingMatch? (editingMatch.status == "N" ? "Zaplanowany" : editingMatch.status == "Z" ? "Zakończony" :"W trakcie"): "Nowy"}</option>          
          <option value="N" hidden={editingMatch?.status === "N"}>Zaplanowany</option>
          <option value="T" hidden={editingMatch?.status === "T"}>W trakcie</option>
          <option value="Z" hidden={editingMatch?.status === "Z"}>Zakończony</option>
          
        </select>


        <br></br>
        {/* Add or Edit Match Button */}
        <button
          onClick={editingMatch ? handleEditMatch : handleAddMatch}
          className="border p-1 mt-2 btn-success bigFont butN2"
        >
          {editingMatch ? "Zapisz Edycję" : "Dodaj Mecz"}
        </button>
      </div>
            
      {/* Add Team */}
      <h2 className="text-xl font-bold mt-6 mb-4">Dodaj Drużynę</h2>
      <div className="flex flex-col space-y-5">
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Nazwa Drużyny"
          className="border p-1 resultAddField bigFont2"
        /><br></br>
        <button
          onClick={handleAddTeam}
          className="border p-1 mt-2 btn-primary bigFont butN2"
        >
          Dodaj Drużynę
        </button>
      </div>

      {/* Team List and Delete Team */}
      <div className="Teams2">
      <h2 className="text-xl font-bold mt-6 mb-4">Drużyny</h2>
      <table className="table  table-bordered table-hover fontWhite">
        <thead>
          <tr>
            <th>#</th>
            <th>Nazwa Drużyny</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody className="fontWhite">
          {teamData
            .filter((team) => team.Name !== "undefined")
            .map((team, index) => (
              <tr  key={team.Id}>
                <td>{index + 1}</td>
                <td>{team.Name}</td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDeleteTeam(team.Id)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    <div className="p-4 resF resF2 ">
      {/* Tournament Name and Date */}
      <h2 className="text-xl font-bold mb-4">Edytuj Turniej</h2>
      <input
        type="text"
        value={tournament.GameName}
        onChange={(e) => setTournament({ ...tournament, GameName: e.target.value })}
        placeholder="Nazwa Turnieju"
        className="border p-1 mb-2 bigFont"
      />
      <input
        type="date"
        value={tournament.GameDate}
        onChange={(e) => setTournament({ ...tournament, GameDate: e.target.value })}
        className="border p-1 mb-2 bigFont"
      />
      <br></br>
      <button onClick={updateTournament} className=" btn btn-primary">Zapisz</button>
    </div>
      {/* <h2 className="text-xl font-bold mt-6 mb-4">Drużyny</h2>
      <ul className="bigFont2 teamList2">
        {teamData
          .filter((team) => team.Name !== "undefined") // Filter out undefined teams
          .map((team) => (
            <li key={team.Id} className="teamList">
              <span>{team.Name}</span>
              <button
                onClick={() => handleDeleteTeam(team.Id)}
                className="ml-2 text-red-500 teamListBtn "
              >
                Usuń
              </button>
            </li>
          ))}
      </ul> */}
    </div>
  );
};

export default Results;
