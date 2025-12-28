import { Box, Flex, Button, Text, Group } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import { Columns } from "./TableHeader";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState, useContext } from "react";
import { UserContext } from "../../context";
import { DatePickerInput } from "@mantine/dates";
import toast from "react-hot-toast";

const RNGData = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch RNG Data
  const { status } = useQuery(
    ["fetchRNGData", startDate, endDate],
    async () => {
      const params = {};
      if (startDate) {
        const day = String(startDate.getDate()).padStart(2, "0");
        const month = String(startDate.getMonth() + 1).padStart(2, "0");
        const year = startDate.getFullYear();
        params.startDate = `${day}/${month}/${year}`;
      }
      if (endDate) {
        const day = String(endDate.getDate()).padStart(2, "0");
        const month = String(endDate.getMonth() + 1).padStart(2, "0");
        const year = endDate.getFullYear();
        params.endDate = `${day}/${month}/${year}`;
      }

      return axios.get(backendUrl + "/rng-data", {
        params,
        headers: {
          authorization: `${user?.accessToken || ""}`,
        },
      });
    },
    {
      enabled: true,
      onSuccess: (res) => {
        if (res.data.success) {
          setData(res.data.data || []);
        }
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to fetch data");
      },
    }
  );

  // Fetch Statistics
  const { status: statsStatus } = useQuery(
    ["fetchRNGDataStats", startDate, endDate],
    async () => {
      const params = {};
      if (startDate) {
        const day = String(startDate.getDate()).padStart(2, "0");
        const month = String(startDate.getMonth() + 1).padStart(2, "0");
        const year = startDate.getFullYear();
        params.startDate = `${day}/${month}/${year}`;
      }
      if (endDate) {
        const day = String(endDate.getDate()).padStart(2, "0");
        const month = String(endDate.getMonth() + 1).padStart(2, "0");
        const year = endDate.getFullYear();
        params.endDate = `${day}/${month}/${year}`;
      }

      return axios.get(backendUrl + "/rng-data/stats", {
        params,
        headers: {
          authorization: `${user?.accessToken || ""}`,
        },
      });
    },
    {
      enabled: true,
      onSuccess: (res) => {
        if (res.data.success) {
          setStats(res.data.data);
        }
      },
    }
  );

  const handleExportExcel = async () => {
    try {
      const params = {};
      if (startDate) {
        const day = String(startDate.getDate()).padStart(2, "0");
        const month = String(startDate.getMonth() + 1).padStart(2, "0");
        const year = startDate.getFullYear();
        params.startDate = `${day}/${month}/${year}`;
      }
      if (endDate) {
        const day = String(endDate.getDate()).padStart(2, "0");
        const month = String(endDate.getMonth() + 1).padStart(2, "0");
        const year = endDate.getFullYear();
        params.endDate = `${day}/${month}/${year}`;
      }

      const response = await axios.get(backendUrl + "/rng-data/export-excel", {
        params,
        headers: {
          authorization: `${user?.accessToken || ""}`,
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rng-data-${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Excel file downloaded successfully");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = {};
      if (startDate) {
        const day = String(startDate.getDate()).padStart(2, "0");
        const month = String(startDate.getMonth() + 1).padStart(2, "0");
        const year = startDate.getFullYear();
        params.startDate = `${day}/${month}/${year}`;
      }
      if (endDate) {
        const day = String(endDate.getDate()).padStart(2, "0");
        const month = String(endDate.getMonth() + 1).padStart(2, "0");
        const year = endDate.getFullYear();
        params.endDate = `${day}/${month}/${year}`;
      }

      const response = await axios.get(backendUrl + "/rng-data/export-csv", {
        params,
        headers: {
          authorization: `${user?.accessToken || ""}`,
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rng-data-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV file downloaded successfully");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"RNG Data"}
        subTitle={"Random Number Generator audit log and statistics"}
      />

      {/* Statistics */}
      {stats && (
        <Group gap="md" p="md" pb={0} justify="flex-end">
          <Box
            p="md"
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <Text size="sm" c="dimmed" mb={4}>
              Lines
            </Text>
            <Text size="xl" fw={600}>
              {stats.lines || 0}
            </Text>
          </Box>
        </Group>
      )}

      {/* Filters */}
      <Flex gap="md" m="md" align="flex-end" wrap="wrap">
        <DatePickerInput
          label="Start Date"
          placeholder="Select start date"
          value={startDate}
          onChange={setStartDate}
          clearable
        />
        <DatePickerInput
          label="End Date"
          placeholder="Select end date"
          value={endDate}
          onChange={setEndDate}
          clearable
        />
        <Button
          onClick={handleExportExcel}
          primary={false}
        >
          Export Excel
        </Button>
        <Button
          onClick={handleExportCSV}
          primary={false}
        >
          Export CSV
        </Button>
      </Flex>

      <Box p={"md"}>
        <DataGrid
          data={data}
          download={false}
          columns={Columns()}
          progressPending={status === "loading"}
        />
      </Box>
    </Box>
  );
};

export default RNGData;

