import React from 'react';
import ApexCharts from 'react-apexcharts';
import { styled } from '@mui/material/styles';

const Chart = styled(ApexCharts)`
  height: 300px;
  width: 100%;
`;

function MyChart({ chartOptions, chartSeries,type }) {
  return (
    <Chart 
      options={chartOptions}
      series={chartSeries}
      type={type}
    />
  );
}

export default MyChart;