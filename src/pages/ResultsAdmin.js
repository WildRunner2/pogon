import React, { useEffect, useState } from "react";
import axios from "axios";
import auth from "../env";

const Results = () => {
  const [matchData, setMatchData] = useState([]);
  const [newMatch, setNewMatch] = useState({ team1: "", team2: "", result1: "", result2: "" });
  const [editingMatch, setEditingMatch] = useState(null);
  // Helper method to determine the host
      const getHost = () => (auth.DEV ? auth.DEV_URL : auth.PROD_URL);
      const host = getHost();

  // Funkcja do pobierania wyników
  const fetchResults = async () => {
    const path = `${host}/api/result/`;
    try {
      const response = await axios.get(path);
      if (response.data.data) setMatchData(response.data.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  // Funkcja do obliczania tabeli ligowej
  const calculateStandings = (matches) => {
    const teams = {};

    matches.forEach(({ Team1, Team2, Result1, Result2 }) => {
      if (!teams[Team1])
        teams[Team1] = { name: Team1, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 };
      if (!teams[Team2])
        teams[Team2] = { name: Team2, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 };

      teams[Team1].goalsFor += Result1;
      teams[Team1].goalsAgainst += Result2;
      teams[Team2].goalsFor += Result2;
      teams[Team2].goalsAgainst += Result1;

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
    });

    return Object.values(teams).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
  };

  useEffect(() => {
    fetchResults(); // Zamiast bezpośredniego wywołania, używamy fetchResults
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingMatch) {
      setEditingMatch({ ...editingMatch, [name]: value });
    } else {
      setNewMatch({ ...newMatch, [name]: value });
    }
  };

  const handleAddMatch = async () => {
    const newMatchData = {
      team1: newMatch.team1,
      team2: newMatch.team2,
      result1: newMatch.result1,
      result2: newMatch.result2,
    };
    try {
      await axios.post(`${host}/api/result/`, newMatchData);
      setNewMatch({ team1: "", team2: "", result1: "", result2: "" }); // Clear form
      fetchResults(); // Refresh the data
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };

  const handleEditMatch = async () => {
    const updatedMatchData = {
      id: editingMatch.id,
      team1: editingMatch.team1,
      team2: editingMatch.team2,
      result1: editingMatch.result1,
      result2: editingMatch.result2,
    };
    try {
      await axios.put(`${host}/api/result/`, updatedMatchData);
      setEditingMatch(null); // Clear editing state
      fetchResults(); // Refresh the data
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  const handleDeleteMatch = async (id) => {
    try {
      await axios.delete(`${host}/api/result/`, { data: { id } });
      fetchResults(); // Refresh the data
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tabela Ligowa</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Miejsce</th>
            <th className="border p-2">Drużyna</th>
            <th className="border p-2">Punkty</th>
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
              <td className="border p-2 text-center">{team.goalsFor}</td>
              <td className="border p-2 text-center">{team.goalsAgainst}</td>
              <td className="border p-2 text-center">{team.goalDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-6 mb-4">Wyniki Meczów</h2>
      <table className="w-full border-collapse border border-gray-300">
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
            .map(({ Id, Team1, Team2, Result1, Result2 }) => (
              <tr key={Id} className="border">
                <td className="border p-2 text-center">{`${Team1} - ${Team2}`}</td>
                <td className="border p-2 text-center">{`${Result1} - ${Result2}`}</td>
                <td className="border p-2 text-center">
                  <button onClick={() => setEditingMatch({ id: Id, team1: Team1, team2: Team2, result1: Result1, result2: Result2 })}>
                    Edytuj
                  </button>
                  <button onClick={() => handleDeleteMatch(Id)}>Usuń</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-6 mb-4">Dodaj lub Edytuj Mecz</h2>
      <div>
        <input
          type="text"
          name="team1"
          placeholder="Drużyna 1"
          value={editingMatch ? editingMatch.team1 : newMatch.team1}
          onChange={handleInputChange}
          className="border p-2"
        />
        <input
          type="text"
          name="team2"
          placeholder="Drużyna 2"
          value={editingMatch ? editingMatch.team2 : newMatch.team2}
          onChange={handleInputChange}
          className="border p-2"
        />
        <input
          type="number"
          name="result1"
          placeholder="Wynik Drużyna 1"
          value={editingMatch ? editingMatch.result1 : newMatch.result1}
          onChange={handleInputChange}
          className="border p-2"
        />
        <input
          type="number"
          name="result2"
          placeholder="Wynik Drużyna 2"
          value={editingMatch ? editingMatch.result2 : newMatch.result2}
          onChange={handleInputChange}
          className="border p-2"
        />
        <button
          onClick={editingMatch ? handleEditMatch : handleAddMatch}
          className="border p-2 mt-2"
        >
          {editingMatch ? "Zapisz Edycję" : "Dodaj Mecz"}
        </button>
      </div>
    </div>
  );
};

export default Results;
