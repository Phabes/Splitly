import {
  useAppNavigation,
  useAuthenticatedApi,
  useFormData,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { createGroupCall } from "@/app/services";
import { ResponseMessage } from "@/app/types";

import { fieldRequiredValidation } from "@/app/utils";
import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const useCreateGroup = () => {
  const translations = useTranslations();
  const request = useAuthenticatedApi();
  const navigation = useAppNavigation();
  const { showLoading, hideLoading } = useLoadingContext();

  const nameField = useFormData();
  const descriptionField = useFormData();
  const currencyField = useFormData();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "onMembersSelected",
      (ids: string[]) => {
        setSelectedMembers(ids);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const goToAddMembers = () => {
    navigation.navigate("AddMembers", {
      initialSelectedMembers: selectedMembers,
    });
  };

  const validateAddGroup = () => {
    const nameError = fieldRequiredValidation(nameField.value);
    const descriptionError = fieldRequiredValidation(descriptionField.value);
    const currencyError = fieldRequiredValidation(currencyField.value);

    nameField.setError(nameError ? translations[nameError] : undefined);
    descriptionField.setError(
      descriptionError ? translations[descriptionError] : undefined,
    );
    currencyField.setError(
      currencyError ? translations[currencyError] : undefined,
    );

    const isError =
      nameError !== undefined ||
      descriptionError !== undefined ||
      currencyError !== undefined;

    return isError;
  };

  const handleCreateGroup = async () => {
    showLoading(translations["creatingGroup"]);
    const isError = validateAddGroup();
    if (isError) {
      hideLoading();
      return;
    }

    try {
      const response = await request(
        createGroupCall,
        nameField.value,
        descriptionField.value,
        currencyField.value,
        selectedMembers,
      );
      if (response.ok) {
        DeviceEventEmitter.emit("refreshGroupList");
        navigation.goBack();
      } else {
        const data: ResponseMessage = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      // Creating group error
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return {
    nameField,
    descriptionField,
    currencyField,
    handleCreateGroup,
    goToAddMembers,
  };
};

export default useCreateGroup;
