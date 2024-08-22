import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSports,
  selectAllSports,
} from "../../redux/feature/sportclubs/SportSlice";
import {
  fetchEvents,
  selectAllEvents,
} from "../../redux/feature/events/EventSlice";
import {
  fetchContents,
  selectAllContents,
} from "../../redux/feature/contents/ContentSlice";
import { selectUsers } from "../../redux/feature/users/UserSlice";

const getChartOptions = (sportclubs, events, contents, users) => {
  return {
    series: [users, sportclubs, events, contents],
    colors: ["#1C64F2", "#16BDCA", "#9061F9", "#FF7F50"],

    chart: {
      height: 380,
      width: 380,
      type: "pie",
      redrawOnParentResize: true,
    },
    stroke: {
      colors: ["white"],
      lineCap: "",
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        dataLabels: {
          offset: -25,
          minAngleToShowLabel: 10,
        },
      },
    },

    labels: ["User", "SportClubs", "Events", "Contents"],
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: "Inter, sans-serif",
        fontSize: "20px",
      },
      formatter: function (value) {
        return `${value.toFixed(2)}%`;
      },
    },
    legend: {
      position: "bottom",
      offsetY: 5,
      layout: "horizontal",
      align: "center",
      fontFamily: "Inter, sans-serif",
      fontSize: "15px",
      markers: {
        size: 5,
      },
    },
  };
};

export default function PieChart() {
  const dispatch = useDispatch();
  const sportclubs = useSelector(selectAllSports);
  const events = useSelector(selectAllEvents);
  const contents = useSelector(selectAllContents);
  const users = useSelector(selectUsers)
  const chartRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSports());
    dispatch(fetchEvents());
    dispatch(fetchContents());
  }, [dispatch]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.updateOptions(
        getChartOptions(sportclubs, events, contents, users)
      );
    } else {
      chartRef.current = new ApexCharts(
        document.getElementById("pie-chart"),
        getChartOptions(sportclubs, events, contents, users)
      );
      chartRef.current.render();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [sportclubs, events, contents, users]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div id="pie-chart" className="mt-4">
        {/* Chart will be rendered here */}
      </div>
    </div>
  );
}
