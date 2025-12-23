import {
  LanguageKeys,
  SUPPORTED_LANGUAGES,
} from "@/app/constants/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "@/app/contexts";
import { LoadingWrapper } from "@/app/components";

const defaultLanguage: LanguageKeys = "en";

type LanguageProviderProps = PropsWithChildren;

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageKeys>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);

  const setLanguageCode = async (lang: LanguageKeys) => {
    setLanguage(lang);
    await AsyncStorage.setItem("appLanguage", lang);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      let storageLanguage: string | null = null;
      try {
        storageLanguage = await AsyncStorage.getItem("appLanguage");
      } catch (e) {
        console.error("Failed to restore language from storage:", e);
      } finally {
        const finalLanguage =
          storageLanguage &&
          (SUPPORTED_LANGUAGES as readonly string[]).includes(storageLanguage)
            ? (storageLanguage as LanguageKeys)
            : defaultLanguage;
        setLanguage(finalLanguage);
        // setTimeout(() => {
        setIsLoading(false);
        // }, 1000);
      }
    };

    bootstrapAsync();
  }, []);

  const contextValue = useMemo(
    () => ({
      language,
      setLanguageCode,
    }),
    [language, isLoading]
  );

  return (
    <LoadingWrapper isLoading={isLoading}>
      <LanguageContext.Provider value={contextValue}>
        {children}
      </LanguageContext.Provider>
    </LoadingWrapper>
  );
};

export default LanguageProvider;
