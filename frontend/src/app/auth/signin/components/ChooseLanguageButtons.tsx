"use client";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {Stack, Button} from "@mui/material";

export function ChooseLanguageButtons() {
  const router = useRouter();
  const t = useTranslations();

  const languages = [
    {value: "en", label: t("signInPage.english")},
    {value: "es", label: t("signInPage.spanish")},
  ];

  const changeLanguage = (locale: string) => {
    document.cookie = `locale=${locale}; path=/`;
    router.refresh();
  };

  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      {languages.map((option) => (
        <Button
          key={option.value}
          variant="text"
          color="primary"
          disabled={t("locale") === option.value}
          onClick={() => changeLanguage(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </Stack>
  );
}
