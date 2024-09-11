"use client";
import {useEffect, useState} from "react";
import useEmblaCarousel from "embla-carousel-react";
import {TransformWrapper, TransformComponent, ReactZoomPanPinchRef} from "react-zoom-pan-pinch";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {ArrowLeft, ArrowRight} from "@mui/icons-material";
import {debounce} from "@/core/utils";


interface ImageViewerProps {
  width?: string;
  height?: string;
  images?: string[];
}

export function ImageViewer(props: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [emblaRef, emblaCarousel] = useEmblaCarousel({loop: false});
  const images = props.images;

  if (!images || images.length === 0) {
    return null;
  }

  // Effect to set up event listeners when Embla API is available
  useEffect(() => {
    if (emblaCarousel) {
      emblaCarousel.on("select", updateCurrentIndex); // update the current index when the carousel is scrolled
      emblaCarousel.on("init", updateCurrentIndex); // update the current index when the carousel is initialized
    }

    return () => {
      if (emblaCarousel) {
        emblaCarousel.off("select", updateCurrentIndex);
        emblaCarousel.off("init", updateCurrentIndex);
      }
    };
  }, [emblaCarousel]);

  const updateZoomLevel = debounce((newZoomLevel) => {
    setZoomLevel(newZoomLevel);
  }, 200);

  const handleZoomChange = (ref: ReactZoomPanPinchRef) => {
    const zoomLevel = Math.round(ref.instance.transformState.scale * 100);
    updateZoomLevel(zoomLevel);
  };

  const updateCurrentIndex = () => {
    if (!emblaCarousel) {
      return;
    }

    setCurrentIndex(emblaCarousel.selectedScrollSnap());
    setCanScrollPrev(emblaCarousel.canScrollPrev());
    setCanScrollNext(emblaCarousel.canScrollNext());
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: props.width ?? "100%",
        height: props.height ?? "auto",
      }}
    >
      {/* <Box
        sx={{
          position: "absolute",
          top: 5,
          left: 5,
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
        }}
      >
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle2">07-May-2024</Typography>
          <Typography variant="subtitle2" color="TealText">
            {images[currentIndex]}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle2" color="TealText">
            W: 410
          </Typography>
          <Typography variant="subtitle2" color="TealText">
            L: 70
          </Typography>
        </Stack>
      </Box> */}

      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            zIndex: 2,
          }}
        >
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => emblaCarousel?.scrollPrev()} disabled={!canScrollPrev}>
              <ArrowLeft />
            </IconButton>
            <IconButton onClick={() => emblaCarousel?.scrollNext()} disabled={!canScrollNext}>
              <ArrowRight />
            </IconButton>
          </Stack>
        </Box>
      )}

      {/* <Box
        sx={{
          position: "absolute",
          bottom: 5,
          left: 5,
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
        }}
      >
        <Typography variant="subtitle2" color="TealText">
          Ser: 5
        </Typography>
        <Typography variant="subtitle2" color="TealText">
          Img: 7680 3250
        </Typography>
        <Typography variant="subtitle2" color="TealText">
          Timepoint: 83/85
        </Typography>
        <Typography variant="subtitle2" color="TealText">
          Acquisition Time: 12:12:36
        </Typography>
        <Typography variant="subtitle2" color="TealText">
          Img: 512x512
        </Typography>
        <Typography variant="subtitle2" color="TealText">
          Loc: -74.79mm Thick: 2.60mm
        </Typography>
      </Box> */}

      <Box
        sx={{
          position: "absolute",
          bottom: 5,
          right: 5,
          display: "flex",
          flexDirection: "column",
          textAlign: "right",
          zIndex: 2,
        }}
      >
        <Typography variant="subtitle2" color="TealText">
          Zoom: {zoomLevel}%
        </Typography>
        {/* <Typography variant="subtitle2" color="TealText">
          Lossless / Uncompressed
        </Typography> */}
      </Box>

      <Box ref={emblaRef} overflow="hidden">
        <Box display="flex">
          {images.map((image, index) => (
            <Box key={index} minWidth="100%" position="relative">
              <TransformWrapper onTransformed={handleZoomChange}>
                <TransformComponent wrapperStyle={{zIndex: 1}}>
                  <img
                    src={image} // {image.url}
                    alt={`Image ${index + 1}`}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      padding: 0,
                      margin: 0,
                    }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
