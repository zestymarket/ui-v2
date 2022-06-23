import Line from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { styled } from '@mui/material';

const StyledChart = styled(`div`)({
  position: `relative`,
  margin: `auto`,
  height: 600,
  width: `100%`,
});

const Title = styled(`div`)(({ theme }) => ({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 600,
  fontSize: 18,
  lineHeight: `24px`,
  letterSpacing: `-0.02em`,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
}));

// todo: replace dummy data
const newPriceData = {
  labels: [
    new Date(`17 Mar 2021`).toLocaleDateString(),
    new Date(`04 Apr 2021`).toLocaleDateString(),
    new Date(`21 Jun 2021`).toLocaleDateString(),
    new Date(`08 Aug 2021`).toLocaleDateString(),
    new Date(`25 Sept 2021`).toLocaleDateString(),
  ],
  datasets: [
    {
      //   label: `REVENUE`,
      borderColor: `#F68823`,
      data: [1600, 2100, 1900, 1500, 1400],
    },
  ],
};

const timeframe = 30;

const options: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  datasets: {
    line: {
      tension: 0.5,
    },
  },
  plugins: {
    legend: {
      display: false,
      labels: {
        padding: 20,
        color: `#837C99`,
        font: {
          family: `Inter`,
          weight: `600`,
          size: 12,
        },
      },
    },
  },
  scales: {
    y: {
      grid: {
        color: `#FFFFFF1A`,
        drawTicks: false,
      },
      ticks: {
        color: `#837C99`,
        font: {
          family: `Inter`,
          weight: `600`,
          size: 12,
        },
        padding: 8,
        precision: 1,
      },
    },
    x: {
      grid: {
        color: `#FFFFFF1A`,
        drawTicks: false,
      },
      ticks: {
        color: `#837C99`,
        padding: 16,
        font: {
          family: `Inter`,
          weight: `600`,
          size: 12,
        },
        callback: function (value: any): any {
          if (isNaN(value)) return;

          if (timeframe === 30) {
            if (value % 4 !== 0) return;
            return this.getLabelForValue(value);
          } else if (timeframe === 365) {
            if (value % 24 !== 0) return;
            return this.getLabelForValue(value);
          } else {
            return this.getLabelForValue(value);
          }
        },
      },
    },
  },
};

const SpacesRevenueHistory = () => {
  return (
    <div style={{ width: `100%` }}>
      <Title>Revenue</Title>
      <StyledChart>
        <Line
          options={options}
          data={newPriceData}
          type="line"
          height={undefined}
          width={undefined}
        />
      </StyledChart>
    </div>
  );
};

export default SpacesRevenueHistory;
