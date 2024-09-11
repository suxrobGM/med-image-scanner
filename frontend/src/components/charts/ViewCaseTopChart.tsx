import {useTranslations} from "next-intl";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList} from "recharts";

function getColorFromData(type: number) {
  if (type === 1) {
    return "#52b9ab";
  } else if (type === 2) {
    return "#0c68cb";
  } else if (type === 3) {
    return "#1b1f23";
  } else if (type === 4) {
    return "#7d808a";
  }
}

function renderCustomizedLabel(props: any) {
  const {x, y, index, data} = props;
  const color = getColorFromData(data[index].type);
  const text1 = data[index].text1;
  const text2 = data[index].text2;
  const fontSize = 12;
  const padding = 8;
  const textWidth = Math.max(text1.length, text2?.length || 0) * (fontSize * 0.6);
  const rectWidth = textWidth + padding * 2.5;
  const rectHeight = text2?.length ? 60 : 60 - fontSize * 2.5;
  const rectX = x - rectWidth / 2;
  const rectY = y - rectHeight / 2 - fontSize * 2;

  return (
    <g>
      <rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} fill={color} rx={5} ry={5} />
      <text
        x={rectX + padding}
        y={rectY + padding}
        fill="#fff"
        textAnchor="start"
        dominantBaseline="hanging"
        fontSize={fontSize}
      >
        {text1}
      </text>
      {text2 && (
        <text
          x={rectX + padding}
          y={rectY + rectHeight / 2 + padding}
          fill="#fff"
          textAnchor="start"
          dominantBaseline="hanging"
          fontSize={fontSize}
        >
          {text2}
        </text>
      )}
    </g>
  );
}

export default function ViewCaseTopChart() {
  const t = useTranslations();

  const data = [
    {
      name: t("components.viewCaseChart.months.jan"),
      value: 2400,
      date: "01/21/2024",
      type: 1,
      text1: "MRI",
      text2: "01/21/2024",
    },
    {
      name: "Feb",
      value: 1398,
      date: "01/21/2024",
      type: 1,
      text1: "MRI",
      text2: "01/21/2024",
    },
    {
      name: "Mar",
      value: 8,
      date: "01/21/2024",
      type: 4,
      text1: "BCR-ABL1",
    },
    {
      name: t("components.viewCaseChart.months.apr"),
      value: 2908,
      date: "01/21/2024",
      type: 3,
      text1: t("common.surgery"),
      text2: "",
    },
    {
      name: "May",
      value: 4800,
      date: "01/21/2024",
      type: 2,
      text1: "X-Ray",
      text2: "01/21/2024",
    },
    {
      name: "Jun",
      value: 3800,
      date: "01/21/2024",
      type: 1,
      text1: "MRI",
      text2: "01/21/2024",
    },
    {
      name: "Jul",
      value: 2908,
      date: "01/21/2024",
      type: 3,
      text1: t("common.chemo"),
      text2: "",
    },
  ];

  return (
    <BarChart
      width={800}
      height={500}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis hide={true} />
      <Legend />
      <Bar dataKey="value" fill="none" stroke="black" barSize={0.1} strokeDasharray="7 7" strokeWidth={0.3}>
        <LabelList dataKey="name" content={(params) => renderCustomizedLabel({...params, data})} />
      </Bar>
    </BarChart>
  );
}
