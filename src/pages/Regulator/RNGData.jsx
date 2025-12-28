import { Box, Flex, Button, Text, Group } from "@mantine/core";
import DataGrid from "../../components/general/Table";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState, useContext } from "react";
import { RegulatorContext } from "../../context/RegulatorContext";
import { DatePickerInput } from "@mantine/dates";
import toast from "react-hot-toast";

const RNGData = () => {
  const { regulator } = useContext(RegulatorContext);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { status } = useQuery(
    ["fetchRegulatorRNGData", startDate, endDate],
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

      return axios.get(backendUrl + "/regulator/rng-data", {
        params,
        headers: {
          authorization: `Bearer ${regulator?.token}`,
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

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/regulator/rng-data/export-excel",
        {
          headers: {
            authorization: `Bearer ${regulator?.token}`,
          },
          responseType: "blob",
        }
      );
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
      const response = await axios.get(
        backendUrl + "/regulator/rng-data/export-csv",
        {
          headers: {
            authorization: `Bearer ${regulator?.token}`,
          },
          responseType: "blob",
        }
      );
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

  const columns = [
    {
      name: "Drop Date",
      selector: (row) => row.DropDate || row.Date || "N/A",
      sortable: true,
      width: "120px",
      cell: (row) => {
        const date = row.DropDate || row.Date;
        return (
          <Text>
            {date
              ? new Date(date).toLocaleDateString("en-AU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "N/A"}
          </Text>
        );
      },
    },
    {
      name: "Drop Time",
      selector: (row) => row.DropTime || "N/A",
      sortable: true,
      width: "100px",
      cell: (row) => {
        if (row.DropTime) return <Text>{row.DropTime}</Text>;
        if (row.DropDate || row.Date) {
          const date = new Date(row.DropDate || row.Date);
          const time = date.toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          return <Text>{time}</Text>;
        }
        return <Text>N/A</Text>;
      },
    },
    {
      name: "Prize ID",
      selector: (row) => row.PrizeId || "N/A",
      sortable: true,
      width: "120px",
    },
    {
      name: "Prize",
      selector: (row) => row.PrizeDescription || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "AUD",
      selector: (row) => row.Value || row.PrizeValue || 0,
      sortable: true,
      center: true,
      width: "120px",
      cell: (row) => (
        <Text fw={500}>${(row?.Value || row?.PrizeValue || 0).toLocaleString()}</Text>
      ),
    },
    {
      name: "Latitude",
      selector: (row) => row.Latitude || "N/A",
      sortable: true,
      center: true,
      width: "120px",
      cell: (row) => (
        <Text>{row.Latitude ? row.Latitude.toFixed(6) : "N/A"}</Text>
      ),
    },
    {
      name: "Longitude",
      selector: (row) => row.Longitude || "N/A",
      sortable: true,
      center: true,
      width: "120px",
      cell: (row) => (
        <Text>{row.Longitude ? row.Longitude.toFixed(6) : "N/A"}</Text>
      ),
    },
    {
      name: "RNG Seed",
      selector: (row) => row.RNGSeed || "N/A",
      sortable: true,
      width: "250px",
      cell: (row) => (
        <Text
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            wordBreak: "break-all",
          }}
        >
          {row.RNGSeed || "N/A"}
        </Text>
      ),
    },
  ];

  return (
    <Box>
      <Flex gap="md" mb="md" align="flex-end" wrap="wrap" justify="space-between">
        <Flex gap="md" align="flex-end" wrap="wrap">
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
        </Flex>
        <Group gap="md">
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
              {data.length}
            </Text>
          </Box>
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
        </Group>
      </Flex>
      <DataGrid
        data={data}
        download={false}
        columns={columns}
        progressPending={status === "loading"}
      />
    </Box>
  );
};

export default RNGData;

