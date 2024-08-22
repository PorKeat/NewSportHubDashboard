import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChartComponent = ({
  facebook,
  twitter,
  instagram,
  telegram,
  website,
  first_phone,
  second_phone,
  email,
}) => {
  const phone_number = first_phone + second_phone;
  const data = {
    labels: [
      "Telegram",
      "Facebook",
      "Phone",
      "Website",
      "Email",
      "Twitter",
      "Instagram",
    ],
    datasets: [
      {
        label: "contact for user",
        data: [telegram, facebook, phone_number, website, email, twitter, instagram],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      // {
      //   label: "Person B",
      //   data: [28, 48, 40, 19, 96, 27, 100],
      //   backgroundColor: "rgba(54, 162, 235, 0.2)",
      //   borderColor: "rgba(54, 162, 235, 1)",
      //   borderWidth: 1,
      // },
    ],
  };

  const options = {
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <>
      <h1 className="text-center">Contact Info</h1>
      <Radar data={data} options={options} />
    </>
  );
};

export default RadarChartComponent;
