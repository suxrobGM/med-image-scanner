"use client";

import {useState} from "react";
import {CalendarMonthOutlined, DescriptionOutlined, SourceOutlined} from "@mui/icons-material";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import {amber} from "@mui/material/colors";
import {ResponsiveLine} from "@nivo/line";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {ImageStyledChip} from "@/components";
import {ViewCaseTopChart} from "@/components/charts";
import {PersonShieldIcon, StatIcon, StatusIcon} from "@/components/icons";

interface PatientCasePageProps {
  params: {
    id: string;
  };
}

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const TimelineChart = () => {
  const data = [
    {
      id: "Jan",
      color: "hsl(225, 70%, 50%)",
      data: [
        {
          x: "Jan",
          y: 0,
        },
        {
          x: "Feb",
          y: 0,
        },
        {
          x: "Mar",
          y: 0,
        },
        {
          x: "Apr",
          y: 0,
        },
        {
          x: "May",
          y: 0,
        },
        {
          x: "Jun",
          y: 0,
        },
        {
          x: "Jul",
          y: 0,
        },
        {
          x: "Aug",
          y: 0,
        },
        {
          x: "Sep",
          y: 0,
        },
        {
          x: "Oct",
          y: 0,
        },
        {
          x: "Nov",
          y: 0,
        },
        {
          x: "Dec",
          y: 0,
        },
      ],
    },
  ];
  return (
    <ResponsiveLine
      data={data}
      margin={{top: 50, right: 20, bottom: 50, left: 130}}
      xScale={{type: "point"}}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      // axisBottom={{
      //   tickSize: 5,
      //   tickPadding: 5,
      //   tickRotation: 0,
      //   legend: 'transportation',
      //   legendOffset: 36,
      //   legendPosition: 'middle',
      //   truncateTickAt: 0,
      // }}
      // axisLeft={{
      //   tickSize: 5,
      //   tickPadding: 5,
      //   tickRotation: 0,
      //   legend: 'count',
      //   legendOffset: -40,
      //   legendPosition: 'middle',
      //   truncateTickAt: 0,
      // }}
      pointSize={10}
      pointColor={{theme: "background"}}
      pointBorderWidth={2}
      pointBorderColor={{from: "serieColor"}}
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      // legends={[
      //   {
      //     anchor: 'bottom-right',
      //     direction: 'column',
      //     justify: false,
      //     translateX: 100,
      //     translateY: 0,
      //     itemsSpacing: 0,
      //     itemDirection: 'left-to-right',
      //     itemWidth: 80,
      //     itemHeight: 20,
      //     itemOpacity: 0.75,
      //     symbolSize: 12,
      //     symbolShape: 'circle',
      //     symbolBorderColor: 'rgba(0, 0, 0, .5)',
      //     effects: [
      //       {
      //         on: 'hover',
      //         style: {
      //           itemBackground: 'rgba(0, 0, 0, .03)',
      //           itemOpacity: 1,
      //         },
      //       },
      //     ],
      //   },
      // ]}
    />
  );
};

const data = [
  {
    id: "Lesion 1",
    color: "#40c006",
    data: [
      {
        x: "Jan",
        y: 4.5,
      },
      {
        x: "Feb",
        y: 4.0,
      },
      {
        x: "Mar",
        y: 4.0,
      },
      {
        x: "Apr",
        y: 2.5,
      },
      {
        x: "May",
        y: 2.0,
      },
      {
        x: "Jun",
        y: 2.2,
      },
      {
        x: "Jul",
        y: 2.2,
      },
      {
        x: "Aug",
        y: 1.5,
      },
      {
        x: "Sep",
        y: 1.0,
      },
    ],
  },
  {
    id: "Lesion 2",
    color: "#0a8dea",
    data: [
      {
        x: "Jan",
        y: 3.5,
      },
      {
        x: "Feb",
        y: 3.0,
      },
      {
        x: "Mar",
        y: 2.5,
      },
      {
        x: "Apr",
        y: 2.2,
      },
      {
        x: "May",
        y: 1.8,
      },
      {
        x: "Jun",
        y: 1.0,
      },
      {
        x: "Jul",
        y: 1.0,
      },
      {
        x: "Aug",
        y: 0.85,
      },
      {
        x: "Sep",
        y: 0.8,
      },
      {
        x: "Nov",
        y: 0.6,
      },
      {
        x: "Dec",
        y: 0.4,
      },
    ],
  },
];

const LesionChartLine = () => (
  <ResponsiveLine
    data={data}
    margin={{top: 50, right: 20, bottom: 50, left: 130}}
    xScale={{type: "point"}}
    yScale={{
      type: "linear",
      min: 0,
      max: "auto",
      // stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legendOffset: 36,
      legendPosition: "middle",
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "count",
      legendOffset: -40,
      legendPosition: "middle",
      truncateTickAt: 0,
    }}
    pointSize={10}
    pointColor={{theme: "background"}}
    pointBorderWidth={2}
    pointBorderColor={{from: "serieColor"}}
    pointLabelYOffset={-12}
    enableTouchCrosshair={true}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-left",
        direction: "column",
        justify: false,
        translateX: -100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

export default function PatientCasePage({params}: PatientCasePageProps) {
  const router = useRouter();
  const t = useTranslations();
  const [tabValue, setTabValue] = useState(t("dashboard.tabTimeline"));
  const handleTabChange = (_: any, newValue: string) => setTabValue(newValue);
  const handleBackToCasesClick = () => router.back();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "fixed", // this is how i fill the background :( i know it's not the best way
          top: 0,
          left: 0,
          height: "100vh",
          width: "100%",
          bgcolor: "grey.200",
          zIndex: -1,
        }}
      />
      <Box>
        <Box
          p={4}
          pt={4}
          sx={{
            backgroundImage:
              "linear-gradient(180deg, rgba(19,84,130,1) 0%, rgba(28,142,123,1) 100%);",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={3}>
            <Typography variant="h4" sx={{color: "white", fontSize: 35, fontWeight: 600, mb: 1}}>
              Robert A.
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PersonShieldIcon
                sx={{
                  width: 25,
                  height: 25,
                  fill: amber[800],
                }}
              />
              <Typography sx={{color: "white", fontSize: 16, fontWeight: 400}}>
                MRN #123456
              </Typography>
            </Stack>
            <Typography sx={{color: "white", fontSize: 16, fontWeight: 400}}>
              {t("common.gender.male")}
            </Typography>
            <Typography sx={{color: "white", fontSize: 16, fontWeight: 400}}>08.08.1956</Typography>
            <Typography sx={{color: "white", fontSize: 16, fontWeight: 400}}>
              65 {t("dashboard.yearsOld")}
            </Typography>
          </Stack>
        </Box>
      </Box>
      <Box
        p={2}
        sx={{
          bgcolor: "grey.50",
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">{t("dashboard.providerDecisionSupport")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={6} mt={2}>
              <Stack spacing={2} alignItems="left">
                <Typography color="grey.600" variant="body2">
                  {t("dashboard.priority")}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <StatIcon color="error" />
                  <Typography color="error" variant="body2">
                    {t("dashboard.stat")}
                  </Typography>
                </Stack>
              </Stack>
              <Stack spacing={2} alignItems="left">
                <Typography color="grey.600" variant="body2">
                  {t("dashboard.status")}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <StatusIcon />
                  <Typography variant="body2">{t("dashboard.active")}</Typography>
                </Stack>
              </Stack>
              <Stack spacing={2} alignItems="left">
                <Typography color="grey.600" variant="body2">
                  {t("dashboard.startDate")}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarMonthOutlined />
                  <Typography variant="body2">02.01.2023</Typography>
                </Stack>
              </Stack>
              <Stack spacing={2} alignItems="left">
                <Typography color="grey.600" variant="body2">
                  {t("dashboard.newImages")}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ImageStyledChip label="+1 MRI" />
                  <ImageStyledChip label="+1 PET-CT" />
                </Stack>
              </Stack>
              <Stack spacing={2} alignItems="left">
                <Typography color="grey.600" variant="body2">
                  {t("dashboard.referringPhysician")}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <Avatar variant="rounded" sx={{width: 24, height: 24, bgcolor: "primary.main"}}>
                    <Typography variant="caption">NT</Typography>
                  </Avatar>
                  <Typography variant="body2">Dr. Nia Thompson</Typography>
                  <QuestionAnswerOutlinedIcon
                    sx={{fontSize: 19, borderRadius: 1, p: 0.2, bgcolor: "grey.300"}}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <TabContext value={tabValue}>
        <Box>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              pl: 1,
            }}
          >
            <Button variant="text" startIcon={<SourceOutlined />} onClick={handleBackToCasesClick}>
              {t("dashboard.backToCases")}
            </Button>
            <Box sx={{mr: 3}} />
            <TabList onChange={handleTabChange}>
              <Tab label={t("dashboard.tabTimeline")} value={t("dashboard.tabTimeline")} />
              <Tab label={t("dashboard.tabImaging")} value={t("dashboard.tabImaging")} />
              <Tab label={t("dashboard.tabNotes")} value={t("dashboard.tabNotes")} />
            </TabList>
          </Box>
        </Box>
        <Box sx={{overflowY: "auto"}}>
          <TabPanel value={t("dashboard.tabTimeline")}>
            <Box width={1000}>
              <Card elevation={3}>
                <Typography variant="h6" p={2}>
                  {t("dashboard.studies")}
                </Typography>
                <Box display="flex" flexDirection="row" padding={2}>
                  <Box width="20%" display="flex" flexDirection="column" alignItems="start">
                    <Typography variant="body1" fontWeight="fontWeightBold">
                      {t("dashboard.studies")}
                    </Typography>
                    <ListItem disableGutters sx={{paddingLeft: 0}}>
                      <span
                        style={{
                          backgroundColor: "#52b9ab",
                          marginRight: "4px",
                          width: "12px",
                          height: "12px",
                          display: "inline-block",
                          borderRadius: "50%",
                        }}
                      ></span>
                      <ListItemText primary="Image processed" />
                    </ListItem>
                    <ListItem disableGutters sx={{paddingLeft: 0}}>
                      <span
                        style={{
                          backgroundColor: "#0c68cb",
                          marginRight: "4px",
                          width: "12px",
                          height: "12px",
                          display: "inline-block",
                          borderRadius: "50%",
                        }}
                      ></span>
                      <ListItemText primary={t("dashboard.newImaging")} />
                    </ListItem>
                    <Typography variant="body1" marginTop={23} fontWeight="fontWeightBold">
                      {t("dashboard.treatments")}
                    </Typography>
                    <Typography variant="body1" marginTop={33} fontWeight="fontWeightBold">
                      {t("dashboard.assessments")}
                    </Typography>
                  </Box>
                  <Box width="80%">
                    <ViewCaseTopChart />
                  </Box>
                </Box>
              </Card>
            </Box>
          </TabPanel>
        </Box>
        <Box>
          <TabPanel value={t("dashboard.tabImaging")}>
            <Box>{/* <StudiesTab patientId={params.id} /> */}</Box>
          </TabPanel>
        </Box>
        <Box>
          <TabPanel value={t("dashboard.tabNotes")}>
            <Stack alignItems="center" justifyContent="center" spacing={3} py={6}>
              <Typography variant="h4" sx={{color: "grey.600"}}>
                {t("dashboard.noNotesToDisplay")}
              </Typography>
              <Box
                sx={{
                  width: {
                    sm: 100,
                    md: 200,
                  },
                }}
              >
                <Button
                  size="large"
                  fullWidth
                  variant="contained"
                  endIcon={<DescriptionOutlined />}
                >
                  {t("dashboard.addNote")}
                </Button>
              </Box>
            </Stack>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}
