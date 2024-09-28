import React, { useState, useEffect } from "react";

const Game = () => {
  const [points, setPoints] = useState([]);
  const [inputPoints, setInputPoints] = useState(3);
  const [currentPoint, setCurrentPoint] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [circlePosition, setCirclePosition] = useState(null);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => {
    const getRandomXPosition = () => {
      const windowWidth = window.innerWidth;
      const maxX = windowWidth - 50;

      return Math.random() * maxX;
    };
    const newPoints = Array.from({ length: inputPoints }, (_, index) => ({
      id: index + 1,
      visible: true,
      color: "white",
      x: getRandomXPosition(),
      y: Math.random() * 445,
    }));
    setPoints(newPoints);
    setCurrentPoint(1);
    setGameOver(false);
    setTime(0);
    setIsRunning(true);
    setIsGameStarted(true);
    setIsCompleted(false);
    setCirclePosition(null);
  };

  const interpolateColor = (fromColor, toColor, factor) => {
    const result = fromColor.map((start, index) => {
      return Math.round(start + (toColor[index] - start) * factor);
    });
    return `rgb(${result.join(",")})`;
  };

  const handlePointClick = (id, e) => {
    if (gameOver) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    setCirclePosition({ x: mouseX, y: mouseY });

    setTimeout(() => {
      setCirclePosition(null);
    }, 100);

    if (id === currentPoint) {
      setPoints((prevPoints) =>
        prevPoints.map((point) =>
          point.id === id ? { ...point, color: "rgb(255, 20, 147)" } : point
        )
      );

      let interval;
      let step = 0;

      interval = setInterval(() => {
        if (step >= 1) {
          clearInterval(interval);
          setPoints((prevPoints) =>
            prevPoints.map((point) =>
              point.id === id
                ? { ...point, color: "rgb(255, 0, 0)", visible: false }
                : point
            )
          );
          if (
            points.every((point) => point.id === id || point.visible === false)
          ) {
            setIsCompleted(true);
            setIsRunning(false);
          }
        } else {
          step += 0.01;
          const newColor = interpolateColor([255, 105, 180], [255, 0, 0], step);
          setPoints((prevPoints) =>
            prevPoints.map((point) =>
              point.id === id ? { ...point, color: newColor } : point
            )
          );
        }
      }, 10);
      setCurrentPoint((prev) => prev + 1);
    } else {
      setPoints(
        points.map((point) => (point.id === id ? { ...point } : point))
      );
      setGameOver(true);
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col w-[800px] gap-1">
      {gameOver ? (
        <h2 className="text-lg font-bold text-red-500">GAME OVER</h2>
      ) : isCompleted ? (
        <h2 className="text-lg font-bold text-green-700">ALL CLEARED</h2>
      ) : (
        <h2 className="text-lg font-bold">LET'S PLAY</h2>
      )}
      <div>
        <label>Points:</label>
        <input
          type="number"
          value={inputPoints || ""}
          onChange={(e) => setInputPoints(Number(e.target.value))}
          style={{
            border: "1px solid black",
            borderRadius: "3px",
            marginLeft: "100px",
            padding: "3px",
            outline: isFocused ? "1px solid blue" : "none",
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      <div>
        <label>Time:</label>
        <span className="ml-[110px]">{time.toFixed(1)}s</span>
      </div>

      {isGameStarted ? (
        <button
          style={{
            backgroundColor: "silver",
            width: "150px",
            border: "1px solid black",
            borderRadius: "3px",
          }}
          onClick={handleStart}
        >
          Restart
        </button>
      ) : (
        <button
          style={{
            backgroundColor: "silver",
            width: "150px",
            border: "1px solid black",
            borderRadius: "3px",
          }}
          onClick={handleStart}
        >
          Play
        </button>
      )}

      <div
        style={{
          border: "2px solid black",
          height: "500px",
          width: "100%",
          position: "relative",
          borderRadius: "2px",
        }}
      >
        {points
          .sort((a, b) => b.id - a.id)
          .map(
            (point) =>
              point.visible && (
                <div
                  key={point.id}
                  onClick={(e) => handlePointClick(point.id, e)}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: point.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: `${point.y}px`,
                    left: `${point.x}px`,
                    cursor: "pointer",
                    border: "1px solid black",
                  }}
                >
                  {point.id}
                </div>
              )
          )}
      </div>
      {circlePosition && (
        <div
          style={{
            position: "absolute",
            top: `${circlePosition.y - 30}px`,
            left: `${circlePosition.x - 30}px`,
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "2px solid black",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default Game;
