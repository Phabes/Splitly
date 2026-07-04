import {
  useAppNavigation,
  useAuthenticatedApi,
  useFormData,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { editGroupCall } from "@/app/services";
import { EditGroupDetailsResponse, ResponseMessage } from "@/app/types";
import { fieldRequiredValidation } from "@/app/utils";
import { DeviceEventEmitter } from "react-native";

export const useEditGroupForm = (
  groupID: string,
  name: string,
  description: string,
  baseCurrency: string,
) => {
  const translations = useTranslations();
  const navigation = useAppNavigation();
  const request = useAuthenticatedApi();
  const { showLoading, hideLoading } = useLoadingContext();

  const nameField = useFormData(name);
  const descriptionField = useFormData(description);
  const currencyField = useFormData(baseCurrency);

  const editGroupButtonDisabled =
    name === nameField.value &&
    description === descriptionField.value &&
    baseCurrency === currencyField.value;

  const validateEditGroup = () => {
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

  const handleEditGroup = async () => {
    showLoading(translations["creatingGroup"]);
    const isError = validateEditGroup();
    if (isError) {
      hideLoading();
      return;
    }

    try {
      const response = await request(
        editGroupCall,
        groupID,
        nameField.value,
        descriptionField.value,
        currencyField.value,
      );
      if (response.ok) {
        const result: EditGroupDetailsResponse = await response.json();
        DeviceEventEmitter.emit("refreshGroupDetails", result.groupDetails);

        navigation.goBack();
      } else {
        const data: ResponseMessage = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      // Editting group error
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return {
    nameField,
    descriptionField,
    currencyField,
    editGroupButtonDisabled,
    handleEditGroup,
  };
};

export default useEditGroupForm;
