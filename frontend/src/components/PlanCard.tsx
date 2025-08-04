"use client";

import {CheckCircleOutline} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {useRouter} from "next/navigation";

interface CardProps {
  price: number;
  title: string;
  subtitle: string;
  featuresTitle: string;
  featuresList: string[];
}

export default function PlanCard(props: CardProps) {
  const router = useRouter();

  return (
    <Card elevation={2} sx={{borderRadius: 4, display: "flex", flexDirection: "column", flex: 1}}>
      <CardContent>
        <Typography gutterBottom variant="h6">
          Enterprise <b style={{color: "#0BA5EC"}}>{props.title}</b>
        </Typography>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Typography variant="h2">
            <strong> ${props.price}</strong>
          </Typography>
          <Typography variant="body1" sx={{fontSize: 20, fontWeight: 600}}>
            per seat
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{fontSize: 19}}>
          {props.subtitle}
        </Typography>
      </CardContent>
      <CardActions sx={{mb: 1}}>
        <Box display="flex" justifyContent="center" width="100%">
          <Button variant="contained" onClick={() => router.push("/signup/configure-org")}>
            Try free for 14 days
          </Button>
        </Box>
      </CardActions>
      <Divider />
      <CardContent sx={{bgcolor: "grey.50"}}>
        <Typography variant="body2" fontWeight={600}>
          FEATURES
        </Typography>
        <Typography variant="body2" color="#475467">
          {props.featuresTitle}
        </Typography>
        <Stack direction="column" mt={1}>
          {props.featuresList.map((feature) => (
            <Grid display="flex" alignItems="center" gap="12px" key={feature} mt={2}>
              <CheckCircleOutline color="primary" />
              <Typography variant="body2" color="#475467">
                {feature}
              </Typography>
            </Grid>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
