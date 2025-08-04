import React from "react";
import {useTranslations} from "next-intl";
import {Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

export default function ViewCaseBottomChart() {
  const t = useTranslations();
  const data = [
    {
      name: t("components.viewCaseChart.months.jan"),
      [t("components.viewCaseChart.lesion1")]: 4000,
      [t("components.viewCaseChart.lesion2")]: 2000,
      [t("components.viewCaseChart.kidneyLesion")]: 2400,
    },
    {
      name: "Feb",
      [t("components.viewCaseChart.lesion1")]: 3500,
      [t("components.viewCaseChart.lesion2")]: 1500,
      [t("components.viewCaseChart.kidneyLesion")]: 2210,
    },
    {
      name: "Mar",
      [t("components.viewCaseChart.lesion1")]: 3000,
      [t("components.viewCaseChart.lesion2")]: 1000,
      [t("components.viewCaseChart.kidneyLesion")]: 2290,
    },
    {
      name: t("components.viewCaseChart.months.apr"),
      [t("components.viewCaseChart.lesion1")]: 2780,
      [t("components.viewCaseChart.lesion2")]: 680,
      [t("components.viewCaseChart.kidneyLesion")]: 2000,
    },
    {
      name: "May",
      [t("components.viewCaseChart.lesion1")]: 2000,
      [t("components.viewCaseChart.lesion2")]: 400,
      [t("components.viewCaseChart.kidneyLesion")]: 2181,
    },
    {
      name: "Jun",
      [t("components.viewCaseChart.lesion1")]: 1800,
      [t("components.viewCaseChart.lesion2")]: 200,
      [t("components.viewCaseChart.kidneyLesion")]: 2500,
    },
    {
      name: "Jul",
      [t("components.viewCaseChart.lesion1")]: 1500,
      [t("components.viewCaseChart.lesion2")]: 100,
      [t("components.viewCaseChart.kidneyLesion")]: 2100,
    },
  ];
  return (
    <LineChart
      width={750}
      height={200}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <XAxis dataKey="name" />
      <YAxis hide={true} />
      <Tooltip />
      <Line
        type="monotone"
        dataKey={t("components.viewCaseChart.lesion1")}
        stroke="#36b7ff"
        strokeWidth={4}
        activeDot={{r: 8}}
      />
      <Line
        type="monotone"
        dataKey={t("components.viewCaseChart.lesion2")}
        stroke="#62dfad"
        strokeWidth={4}
      />
      <Line
        type="monotone"
        dataKey={t("components.viewCaseChart.kidneyLesion")}
        stroke="#434ce6"
        strokeWidth={4}
      />
    </LineChart>
  );
}
