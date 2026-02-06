import { Group, Modal, PasswordInput, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import Button from "../../components/general/Button";
import InputField from "../../components/general/InputField";
import { backendUrl, internalApiKey } from "../../constants";

function internalHeaders() {
  const h = { "Content-Type": "application/json" };
  if (internalApiKey) h["X-Internal-Api-Key"] = internalApiKey;
  return h;
}

const AddAffiliate = ({ open, setOpen, editData, setEditData }) => {
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      FullName: "",
      Email: "",
      Password: "",
      AffiliateURL: "",
      TrackingID: "",
      Status: "ACTIVE",
      PayoutsDriveUrl: "",
    },
    validate: {
      FullName: (value) => (value?.trim() ? null : "Enter Full Name"),
      Email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      Password: (value) =>
        editData ? null : value?.length >= 6 ? null : "Min 6 characters",
      AffiliateURL: (value) => (value?.trim() ? null : "Enter Affiliate URL"),
      TrackingID: (value) => (value?.trim() ? null : "Enter Tracking ID"),
    },
  });

  useEffect(() => {
    if (editData) {
      form.setValues({
        FullName: editData.FullName || "",
        Email: editData.Email || "",
        Password: "",
        AffiliateURL: editData.AffiliateURL || "",
        TrackingID: editData.TrackingID || "",
        Status: editData.Status || "ACTIVE",
        PayoutsDriveUrl: editData.PayoutsDriveUrl || "",
      });
    } else {
      form.reset();
    }
  }, [editData, open]);

  const handleSubmit = useMutation(
    async (values) => {
      const payload = {
        FullName: values.FullName.trim(),
        Email: values.Email.trim().toLowerCase(),
        AffiliateURL: values.AffiliateURL.trim(),
        TrackingID: (values.TrackingID || "").trim().toUpperCase(),
        Status: values.Status || "ACTIVE",
        PayoutsDriveUrl: (values.PayoutsDriveUrl || "").trim(),
      };
      if (editData) {
        payload.Id = editData._id;
        if (values.Password && values.Password.length >= 6) payload.Password = values.Password;
        return axios.post(backendUrl + "/internal/affiliates/update", payload, {
          headers: internalHeaders(),
        });
      }
      payload.Password = values.Password;
      return axios.post(backendUrl + "/internal/affiliates", payload, {
        headers: internalHeaders(),
      });
    },
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res.data.message);
          setOpen(false);
          setEditData(null);
          form.reset();
          queryClient.invalidateQueries("fetchAffiliates");
        } else {
          toast.error(res?.data?.message || "Failed");
        }
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Request failed");
      },
    }
  );

  return (
    <Modal
      opened={open}
      onClose={() => {
        setOpen(false);
        setEditData(null);
        form.reset();
      }}
      title={editData ? "Edit Affiliate" : "Register Affiliate"}
      centered
      withCloseButton={false}
      size="md"
      styles={{ title: { margin: "auto", fontWeight: "600" } }}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit.mutate(values))}>
        <Stack>
          <InputField
            label="Full Name"
            form={form}
            validateName="FullName"
            placeholder="Hayden Moreau"
          />
          <InputField
            label="Email"
            form={form}
            validateName="Email"
            placeholder="email@example.com"
          />
          <PasswordInput
            label="Password"
            placeholder={editData ? "Leave blank to keep current" : "Min 6 characters"}
            {...form.getInputProps("Password")}
          />
          <InputField
            label="Affiliate URL (unique)"
            form={form}
            validateName="AffiliateURL"
            placeholder="https://..."
          />
          <InputField
            label="Tracking ID (unique)"
            form={form}
            validateName="TrackingID"
            placeholder="e.g. HMG"
          />
          <Select
            label="Status"
            data={[
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "INACTIVE", label: "INACTIVE" },
            ]}
            {...form.getInputProps("Status")}
          />
          <InputField
            label="Payouts / Google Drive URL (optional)"
            form={form}
            validateName="PayoutsDriveUrl"
            placeholder="https://..."
          />
          <Group justify="center" mt="md">
            <Button
              label="Cancel"
              type="button"
              primary={false}
              onClick={() => {
                setOpen(false);
                setEditData(null);
                form.reset();
              }}
            />
            <Button
              label={editData ? "Update" : "Register"}
              type="submit"
              loading={handleSubmit.isLoading}
            />
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddAffiliate;
