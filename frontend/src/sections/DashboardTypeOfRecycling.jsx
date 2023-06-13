import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";
import MyChart from "../components/chart";

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
    },
   
    dataLabels: {
      enabled: false,
    },
    colors: [ "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#bab0ac"],
    labels,
    legend: {
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
    },
  };
};



export const DashboardTypeOfRecycling = (props) => {
  const { chartSeries, labels, sx } = props;
  const chartOptions = useChartOptions(labels);

  if (!chartSeries || chartSeries.length === 0 || !labels || labels.length === 0) {
    return (
      <Card sx={sx}>
        <CardHeader title="Recycling Material" />
        <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "45vh" }}>
          <h3>No data available for the chart.</h3>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card sx={sx}>
      <CardHeader title="Recycling Material" />

      <CardContent  sx={{ display: "flex", justifyContent: "center" ,alignItems: "center" ,height: "45vh", padding: '0', margin: '0'}} >
        <MyChart 
          chartOptions={chartOptions}
          chartSeries={chartSeries}
          type="donut"
        />
      </CardContent>
    </Card>
  );
};

DashboardTypeOfRecycling.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  sx: PropTypes.object,
};
