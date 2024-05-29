import { useState } from "react";

const HandicapForm = () => {
  const [handicaps, setHandicaps] = useState({
    player1: "",
    player2: "",
    player3: "",
    player4: "",
  });
  const [error, setError] = useState("");
  const [strokesAwarded, setStrokesAwarded] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHandicaps({ ...handicaps, [name]: value });
  };

  const calculateStrokes = () => {
    const { player1, player2, player3, player4 } = handicaps;
    const h1 = parseFloat(player1);
    const h2 = parseFloat(player2);
    const h3 = parseFloat(player3);
    const h4 = parseFloat(player4);
    const handicapArray = [h1, h2, h3, h4];

    if (handicapArray.some((h) => isNaN(h) || h < 0 || h > 54)) {
      setError("Handicap values must be between 0 and 54.");
      setStrokesAwarded(null);
      return;
    }

    const totalHandicap = h1 + h2 + h3 + h4;
    const singleDigitCount = handicapArray.filter((h) => h < 10).length;

    if (totalHandicap < 32 || totalHandicap > 112) {
      setError("Team aggregate Handicap Index must be between 32.0 and 112.0.");
      setStrokesAwarded(null);
      return;
    }

    if (singleDigitCount > 2) {
      setError("A maximum of two single-digit handicaps are allowed.");
      setStrokesAwarded(null);
      return;
    }

    setError("");

    const courseRating = 71.2;
    const slopeRating = 123;
    const par = 72;

    const courseHandicaps = handicapArray.map(
      (h) => h * (slopeRating / 113) + (courseRating - par)
    );
    const playingHandicap =
      0.25 * courseHandicaps.sort((a, b) => a - b)[0] +
      0.2 * courseHandicaps.sort((a, b) => a - b)[1] +
      0.15 * courseHandicaps.sort((a, b) => a - b)[2] +
      0.1 * courseHandicaps.sort((a, b) => a - b)[3];

    const adjustedPlayingHandicap = playingHandicap * 0.75;

    setStrokesAwarded(adjustedPlayingHandicap.toFixed(1));
  };

  return (
    <>
      <div className="max-w-lg mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Handicap Calculator</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateStrokes();
          }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          {["player1", "player2", "player3", "player4"].map((player, index) => (
            <div key={player} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Player {index + 1} Handicap:
              </label>
              <input
                type="number"
                name={player}
                value={handicaps[player]}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-full">
            Calculate Strokes Awarded
          </button>
        </form>
        {strokesAwarded !== null && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            <h3 className="text-lg font-bold">
              Strokes Awarded: {strokesAwarded}
            </h3>
          </div>
        )}
      </div>
      {error && <div className="mt-4 text-red-500 font-bold">{error}</div>}
    </>
  );
};

export default HandicapForm;
