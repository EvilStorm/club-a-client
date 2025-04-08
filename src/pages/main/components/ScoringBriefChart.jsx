import React from 'react';
import PropTypes from 'prop-types';
import { useWindowSize } from '@react-hook/window-size';

const WinLossChart = ({ dates, wins, losses }) => {
  if (!dates || !wins || !losses || dates.length !== wins.length || wins.length !== losses.length) {
    return <div>Invalid data provided for the chart.</div>;
  }

  const [windowWidth] = useWindowSize();
  const totalGames = wins.reduce((sum, win) => sum + win, 0) + losses.reduce((sum, loss) => sum + loss, 0);
  const totalWins = wins.reduce((sum, win) => sum + win, 0);
  const winPercentage = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(0) : 0;

  const numPoints = dates.length;
  const paddingVertical = 20;
  const paddingHorizontal = 60;
  const chartHeight = 150;
  const calculatedWidth = Math.max(300, windowWidth - 100);
  const chartWidth = Math.min(calculatedWidth, 400); // 최대 너비 700px 적용
  const maxX = numPoints - 1;
  const maxY = Math.max(...wins, 1) || 1;

  const xScale = (index) => paddingHorizontal + (chartWidth - 2 * paddingHorizontal) * (index / maxX);
  const yScale = (win) => chartHeight - paddingVertical - (chartHeight - 2 * paddingVertical) * (win / maxY);

  const points = dates.map((date, index) => ({
    x: xScale(index),
    y: yScale(wins[index]),
    win: wins[index],
    loss: losses[index],
    ratio: `${wins[index]} / ${wins[index] + losses[index]}`,
    date: date,
  }));

  const startDate = new Date(dates[0]).toLocaleDateString();
  const endDate = new Date(dates[dates.length - 1]).toLocaleDateString();

  const linePath = points
    .map((point, index) => (index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`))
    .join(' ');

  return (
    <div>
      <div>승률: {winPercentage}%, 승: {totalWins}, 패: {totalGames - totalWins}</div>
      <svg width={chartWidth} height={chartHeight}>
        <path d={linePath} stroke="orange" strokeWidth="2" fill="none" />
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="5" fill="red" />
            <text x={point.x} y={point.y - 10} textAnchor="middle" fontSize="10">
              {point.ratio}
            </text>
            <text x={point.x} y={chartHeight - 15} textAnchor="middle" fontSize="10">
              {new Date(point.date).toLocaleDateString()}
            </text>
          </g>
        ))}
        {/* <line x1={paddingHorizontal} y1={paddingVertical} x2={paddingHorizontal} y2={chartHeight - paddingVertical - 10} stroke="#ccc" strokeWidth="1" />
        <line x1={paddingHorizontal} y1={chartHeight - paddingVertical - 10} x2={chartWidth - paddingHorizontal} y2={chartHeight - paddingVertical - 10} stroke="#ccc" strokeWidth="1" /> */}
      </svg>
    </div>
  );
};

WinLossChart.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  wins: PropTypes.arrayOf(PropTypes.number).isRequired,
  losses: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default WinLossChart;