"use client";

import {useState} from "react";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import {IconButton, Tooltip} from "@mui/material";
import useSWR from "swr";
import {BookmarkReportCommand} from "@/core/models";
import {ApiService} from "@/core/services";

interface BookmarkButtonProps {
  reportId: string;
  userId: string;
}

export function BookmarkButton(props: BookmarkButtonProps) {
  const {reportId, userId} = props;
  const {data: result} = useSWR(
    `/users/${userId}/bookmarked-reports/${reportId}/exists`,
    () => ApiService.ins.hasUserBookmarkedReport(userId, reportId),
    {revalidateOnFocus: true}
  );
  const [isBookmarked, setIsBookmarked] = useState(result?.data ?? false);

  const handleBookmarkReport = async () => {
    const command: BookmarkReportCommand = {
      userId: userId,
      reportId: reportId,
      unbookmark: isBookmarked,
    };

    const result = await ApiService.ins.bookmarkReport(command);

    if (result.success) {
      setIsBookmarked((prev) => !prev);
    }
  };

  const buttonIcon = isBookmarked ? <BookmarkRemoveIcon /> : <BookmarkAddedIcon />;

  return (
    <Tooltip
      title={isBookmarked ? "Remove this report from bookmarked list" : "Bookmark this report"}
    >
      <IconButton onClick={handleBookmarkReport}>{buttonIcon}</IconButton>
    </Tooltip>
  );
}
