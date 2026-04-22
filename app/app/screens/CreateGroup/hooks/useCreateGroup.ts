import {
  useAuthenticatedApi,
  useFormData,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";

import { fieldRequiredValidation } from "@/app/utils";

export const useCreateGroup = () => {
  const translations = useTranslations();
  const request = useAuthenticatedApi();
  const { showLoading, hideLoading } = useLoadingContext();

  const nameField = useFormData();
  const descriptionField = useFormData();
  const currencyField = useFormData();

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
      nameField !== undefined ||
      descriptionError !== undefined ||
      currencyError !== undefined;

    return isError;
  };

  const handleCreateGroup = async () => {
    showLoading(translations["creatingGroup"]);
    const isError = validateAddGroup();
    if (isError) {
      setTimeout(() => {
        hideLoading();
      }, 4000);
      return;
    }

    try {
      // const response = await request(
      //   createGroupCall,
      //   nameField.value,
      //   descriptionField.value,
      //   currencyField.value,
      // );
      // if (response.ok) {
      //   const data: SignInResponse = await response.json();
      //   await signIn(data.userToken, data.refreshToken);
      // } else {
      //   const data: ResponseMessage = await response.json();
      //   throw new Error(data.message);
      // }
    } catch (error) {
      // Sign in error
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
  };
};

export default useCreateGroup;
