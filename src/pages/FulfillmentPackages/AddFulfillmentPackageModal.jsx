import { ActionIcon, Box, Group, Modal, Stack, Switch } from "@mantine/core";
import { FileInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Button from "../../components/general/Button";
import { useDisclosure } from "@mantine/hooks";
import InputField from "../../components/general/InputField";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";
import { Pencil } from "tabler-icons-react";

const AddFulfillmentPackageModal = ({ edit = false, data }) => {
  const queryClient = useQueryClient();
  const [opened, { toggle }] = useDisclosure(false);
  const [imageFile, setImageFile] = useState(null);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      Name: "",
      SubscriptionPriceWeekly: "",
      SecuredPrizesCap: "",
      ProcessingWindowDays: "",
      MaxShippedPerWeek: "",
      InsuranceAmount: "",
      MinPaidWeeksForBoss: "",
      IsActive: true,
    },
  });

  useEffect(() => {
    if (edit && data && opened) {
      form.setValues({
        Name: data.Name || "",
        SubscriptionPriceWeekly: data.SubscriptionPriceWeekly ?? "",
        SecuredPrizesCap: data.SecuredPrizesCap ?? "",
        ProcessingWindowDays: data.ProcessingWindowDays ?? "",
        MaxShippedPerWeek: data.MaxShippedPerWeek ?? "",
        InsuranceAmount: data.InsuranceAmount ?? "",
        MinPaidWeeksForBoss: data.MinPaidWeeksForBoss ?? "",
        IsActive: data.IsActive ?? true,
      });
      setImageFile(null);
    } else if (!opened && !edit) {
      form.reset();
      setImageFile(null);
    }
  }, [data, edit, opened]);

  const handleSubmit = useMutation(
    async (values) => {
      const formData = new FormData();
      formData.append("Name", values.Name);
      formData.append("SubscriptionPriceWeekly", Number(values.SubscriptionPriceWeekly) || 0);
      formData.append(
        "SecuredPrizesCap",
        values.SecuredPrizesCap === "" || values.SecuredPrizesCap === null
          ? 0
          : Number(values.SecuredPrizesCap)
      );
      formData.append("ProcessingWindowDays", Number(values.ProcessingWindowDays) || 1);
      formData.append(
        "MaxShippedPerWeek",
        values.MaxShippedPerWeek === "" || values.MaxShippedPerWeek === null
          ? 0
          : Number(values.MaxShippedPerWeek)
      );
      formData.append("InsuranceAmount", Number(values.InsuranceAmount) || 0);
      formData.append("MinPaidWeeksForBoss", Number(values.MinPaidWeeksForBoss) || 0);
      formData.append("IsActive", !!values.IsActive ? "true" : "false");

      if (edit) {
        formData.append("Id", data._id);
      }
      if (imageFile) {
        formData.append("Image", imageFile);
      }

      let link = backendUrl + "/fulfillment-packages";
      link = edit ? link + "/update" : link + "/add";
      return axios.post(link, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    {
      onSuccess: (res) => {
        toast.success(res.data?.message || "Saved");
        queryClient.invalidateQueries("fetchFulfillmentPackages");
        toggle();
        form.reset();
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to save fulfillment package"
        );
      },
    }
  );

  return (
    <>
      {edit ? (
        <ActionIcon onClick={toggle}>
          <Pencil />
        </ActionIcon>
      ) : (
        <Button label={"Add Fulfilment Package"} onClick={toggle} />
      )}
      <Modal
        title={edit ? "Edit Fulfilment Package" : "Adding Fulfilment Package"}
        opened={opened}
        onClose={toggle}
        centered
        styles={{ title: { fontWeight: 600 } }}
      >
        <form
          onSubmit={form.onSubmit((values) => handleSubmit.mutate(values))}
        >
          <Stack>
            <InputField
              label={"Name"}
              form={form}
              required={true}
              validateName={"Name"}
            />
            <InputField
              label={"Subscription price (Weekly)"}
              type="number"
              form={form}
              required={true}
              validateName={"SubscriptionPriceWeekly"}
            />
            <InputField
              label={"Secured Prizes Cap"}
              type="number"
              form={form}
              validateName={"SecuredPrizesCap"}
            />
            <InputField
              label={"Processing window (days)"}
              type="number"
              form={form}
              required={true}
              validateName={"ProcessingWindowDays"}
            />
            <InputField
              label={"Max shipped prizes per week"}
              type="number"
              form={form}
              validateName={"MaxShippedPerWeek"}
            />
            <InputField
              label={"Insurance amount"}
              type="number"
              form={form}
              validateName={"InsuranceAmount"}
            />
            <InputField
              label={"Minimum paid weeks for Boss"}
              type="number"
              form={form}
              validateName={"MinPaidWeeksForBoss"}
            />
            <FileInput
              label="Image"
              placeholder="Choose image (optional)"
              accept="image/*"
              value={imageFile}
              onChange={setImageFile}
              clearable
            />
            {(edit && data?.Image) && !imageFile && (
              <Box>
                <Box component="span" size="sm" c="dimmed" style={{ fontSize: "0.875rem" }}>
                  Current image:
                </Box>
                <Box mt={4}>
                  <img
                    src={data.Image}
                    alt={data.Name}
                    style={{ maxWidth: 120, maxHeight: 120, objectFit: "contain" }}
                  />
                </Box>
              </Box>
            )}
            <Switch
              label="Active"
              description="Whether this package is available"
              {...form.getInputProps("IsActive", { type: "checkbox" })}
            />
            <Group gap={"md"} justify="flex-end" mt="md">
              <Button
                label={"Cancel"}
                onClick={() => {
                  toggle();
                  form.reset();
                }}
                variant="outline"
                bg="gray"
              />
              <Button
                label={edit ? "Update" : "Add"}
                type={"submit"}
                loading={handleSubmit.isLoading}
              />
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default AddFulfillmentPackageModal;

