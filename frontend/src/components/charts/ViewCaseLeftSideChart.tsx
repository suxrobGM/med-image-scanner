import * as React from "react";
import {Box, Checkbox, ListItem, ListItemText, Typography} from "@mui/material";
import {useTranslations} from "next-intl";

interface LegendItem {
  label: string;
  color: string;
}

const ViewCaseChartLeftSide: React.FC = () => {
  const t = useTranslations();
  const studiesData: LegendItem[] = [
    {label: "Image processed", color: "#52b9ab"},
    {label: t("dashboard.newImaging"), color: "#0c68cb"},
  ];

  const assessmentsData: LegendItem[] = [
    {label: `${t("components.viewCaseChart.lesion")} 1`, color: "#36b7ff"},
    {label: `${t("components.viewCaseChart.lesion")} 2`, color: "#62dfad"},
    {
      label: `${t("components.viewCaseChart.kidney")} ${t("components.viewCaseChart.lesion")}`,
      color: "#434ce6",
    },
  ];

  return (
    <Box width="20%" display="flex" flexDirection="column" alignItems="start">
      <Typography variant="body1" fontWeight="fontWeightBold">
        {t("dashboard.studies")}
      </Typography>
      {studiesData.map((item) => (
        <ListItem key={item.label} disableGutters sx={{paddingLeft: 0}}>
          <span
            style={{
              backgroundColor: item.color,
              marginRight: "4px",
              width: "12px",
              height: "12px",
              display: "inline-block",
              borderRadius: "50%",
            }}
          />
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
      <Typography variant="body1" marginTop={9} fontWeight="fontWeightBold">
        {t("dashboard.treatments")}
      </Typography>
      <Typography variant="body1" marginTop={24} fontWeight="fontWeightBold">
        {t("dashboard.assessments")}
      </Typography>
      {assessmentsData.map((item, index) => (
        <ListItem
          key={item.label}
          disableGutters
          sx={{paddingLeft: 0, marginTop: index === 0 ? 8 : 0}}
        >
          <Checkbox
            sx={{
              color: "#7f56d9",
              "&.Mui-checked": {
                color: "#7f56d9",
              },
              padding: "4px",
            }}
          />
          <span
            style={{
              backgroundColor: item.color,
              marginRight: "4px",
              width: "12px",
              height: "12px",
              display: "inline-block",
              borderRadius: "50%",
            }}
          />
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </Box>
  );
};

export default ViewCaseChartLeftSide;
