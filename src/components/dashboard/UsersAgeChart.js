import React from "react";
import {
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function UserAgeChart({ usersData, screenWidth, totalUsers }) {
  const data = [];
  const COLORS = [
    ["#6a11cb", "#2575fc"],
    ["#2c3e50", "#34495e"],
    ["#1a2980", "#26d0ce"],
    ["#e74c3c", "#c0392b"],
    ["#4a90e2", "#2c3e50"],
  ];

  Object.keys(usersData).map((key) => {
    data.push({ name: "" + key, value: usersData[key] });
  });
console.log(data)
  return (
    <>

      <PieChart

        width={screenWidth > 991 ? screenWidth / 3 : screenWidth / 1.5}
        height={
          screenWidth > 1400
          ? screenWidth / 4
          : screenWidth > 1300
               ? screenWidth / 3
               : screenWidth > 767
                 ? screenWidth / 3
                 : screenWidth / 2
        }
      >

        {COLORS.map((gradient, index) => (
          <defs key={`gradient-${index}`}>
            <linearGradient
              id={`gradientColor-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={gradient[0]} /> {/* Start color */}
              <stop offset="100%" stopColor={gradient[1]} /> {/* End color */}
            </linearGradient>
          </defs>
        ))}

        <Pie
          data={data}
          className="uppercase flex flex-wrap"

          innerRadius={screenWidth > 991 ? screenWidth / 16 : screenWidth / 12}
          outerRadius={screenWidth > 991 ? screenWidth / 11 : screenWidth / 8}

          label={(e) =>
            e.value > 0
              ? e.name + ": " + (e.value ).toFixed(1) + "%"
              : ""
          }
          // label={(e) => {
          
          //   const words = e.name.split(' ');
          //   const lastWord = words.slice(-2).join(" ")
          
          //   return e.value > 0
          //     ? e.name + ": " + (e.value).toFixed(1) + "%"
          //     : "";
          // }}
          




        labelLine={false}
        fontSize={20}
        paddingAngle={5}
        dataKey="value"
      >

        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            stroke="none"
            fill={`url(#gradientColor-${index % COLORS.length})`}
          />
        ))}
      </Pie>
      {/* <Tooltip /> */}
    </PieChart >
    </>
  );
}
