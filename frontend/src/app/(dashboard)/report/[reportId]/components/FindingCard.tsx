"use client";

import {useEffect, useState} from "react";
import AddTaskIcon from "@mui/icons-material/AddTask";
import BlockIcon from "@mui/icons-material/Block";
import {Box, Button, Grid, Stack, TextField, Typography} from "@mui/material";
import {FindingDto} from "@/core/models";
import {StringUtils} from "@/core/utils";

interface FindingCardProps {
  finding: FindingDto;
  onChange?: (finding: FindingDto) => void;
}

export function FindingCard(props: FindingCardProps) {
  const [finding, setFinding] = useState(props.finding);

  const handleFindingChange = (field: keyof FindingDto, value: any) => {
    setFinding((prev) => ({...prev, [field]: value}));
  };

  useEffect(() => {
    props.onChange?.(finding);
  }, [finding]);

  return (
    <Stack
      direction="column"
      sx={{
        paddingTop: 1,
        paddingBottom: 1,
        gap: 1,
      }}
    >
      <Stack direction="row" gap={2}>
        <Typography variant="h5" color="TealText" alignSelf="center">
          {finding.title}
        </Typography>

        {finding.predictionProbability && (
          <Typography variant="body2" color="GrayText" alignSelf="center">
            {StringUtils.toPercent(finding.predictionProbability)}
          </Typography>
        )}

        <Box ml="auto">
          {finding.approved == null && (
            <Stack direction="column">
              <Typography variant="caption" color="GrayText">
                Add this finding to your report?
              </Typography>
              <Stack direction="row" gap={1}>
                <Button
                  color="info"
                  endIcon={<AddTaskIcon />}
                  onClick={() => handleFindingChange("approved", true)}
                >
                  Approve
                </Button>
                <Button
                  color="error"
                  endIcon={<BlockIcon />}
                  onClick={() => handleFindingChange("approved", false)}
                >
                  Decline
                </Button>
              </Stack>
            </Stack>
          )}

          {finding.approved === true && <AddTaskIcon color="info" />}
          {finding.approved === false && <BlockIcon color="error" />}
        </Box>
      </Stack>

      {finding.annotation && (
        <Grid container>
          <Grid item xs={12} md={3} display="flex" flexDirection="column">
            <Typography variant="h6" color="teal">
              Location
            </Typography>
            <Typography variant="body2">Left upper lobe</Typography>
          </Grid>
          <Grid item xs={12} md={3} display="flex" flexDirection="column">
            <Typography variant="h6" color="teal">
              Size
            </Typography>
            <Typography variant="body2">1.8 cm x 2.5 cm</Typography>
          </Grid>
          <Grid item xs={12} md={3} display="flex" flexDirection="column">
            <Typography variant="h6" color="teal">
              Area
            </Typography>
            <Typography variant="body2">
              Approx. 5.0 cm <sup>2</sup>
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} display="flex" flexDirection="column">
            <Typography variant="h6" color="teal">
              HU
            </Typography>
            <Typography variant="body2">85</Typography>
          </Grid>
        </Grid>
      )}

      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" color="teal">
            Description
          </Typography>
          <TextField
            rows={3}
            value={finding.description ?? ""}
            onChange={(e) => handleFindingChange("description", e.target.value)}
            multiline
            fullWidth
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
