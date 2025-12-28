import { Box, Flex, Button, Text, Badge } from "@mantine/core";
import DataGrid from "../../components/general/Table";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState, useContext } from "react";
import { RegulatorContext } from "../../context/RegulatorContext";
import { DatePickerInput } from "@mantine/dates";
import toast from "react-hot-toast";

const PrizePoolData = () => {
  const { regulator } = useContext(RegulatorContext);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { status } = useQuery(
    ["fetchRegulatorPrizePoolData", startDate, endDate],
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

      return axios.get(backendUrl + "/regulator/prize-pool-data", {
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
        backendUrl + "/regulator/prize-pool-data/export-excel",
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
      link.setAttribute("download", `prize-pool-data-${new Date().toISOString()}.xlsx`);
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
        backendUrl + "/regulator/prize-pool-data/export-csv",
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
      link.setAttribute("download", `prize-pool-data-${new Date().toISOString()}.csv`);
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
      name: "Date",
      selector: (row) => row.Date || row.CreationTimestamp || "N/A",
      sortable: true,
      width: "120px",
      cell: (row) => {
        const date = row.Date || row.CreationTimestamp;
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
      name: "Time",
      selector: (row) => row.Time || "N/A",
      sortable: true,
      width: "100px",
      cell: (row) => {
        if (row.Time) return <Text>{row.Time}</Text>;
        if (row.Date || row.CreationTimestamp) {
          const date = new Date(row.Date || row.CreationTimestamp);
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
      selector: (row) => row.PrizeDescription || row.Product || "N/A",
      sortable: true,
      width: "180px",
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
      name: "From",
      selector: (row) => row.From || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "To",
      selector: (row) => row.To || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Event Type",
      selector: (row) => row.EventType || "N/A",
      sortable: true,
      width: "180px",
      cell: (row) => {
        const eventType = row.EventType || "N/A";
        const colorMap = {
          Created: "blue",
          Claimed: "green",
          "24 Hour Timer Ended": "orange",
          Stolen: "red",
          Rewarded: "purple",
        };
        return (
          <Badge color={colorMap[eventType] || "gray"} variant="light">
            {eventType}
          </Badge>
        );
      },
    },
    {
      name: "Status",
      selector: (row) => row.Status || (row.IsActive ? "Active" : "Inactive"),
      center: true,
      width: "100px",
      cell: (row) => {
        const status = row.Status || (row.IsActive ? "Active" : "Inactive");
        return (
          <Badge bg={status === "Active" ? "green" : status === "Rewarded" ? "purple" : "red"}>
            {status}
          </Badge>
        );
      },
    },
    {
      name: "Notes",
      selector: (row) => row.Notes || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "User Verified?",
      selector: (row) => row.UserIdVerified,
      center: true,
      width: "150px",
      cell: (row) => (
        <Badge color={row.UserIdVerified ? "green" : "gray"}>
          {row.UserIdVerified ? "Verified" : "NOT Verified"}
        </Badge>
      ),
    },
    {
      name: "Promotional Period",
      selector: (row) => row.PromotionalPeriod || "N/A",
      sortable: true,
      width: "200px",
    },
  ];

  return (
    <Box>
      <Flex gap="md" mb="md" align="flex-end" wrap="wrap">
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
      <DataGrid
        data={data}
        download={false}
        columns={columns}
        progressPending={status === "loading"}
      />
    </Box>
  );
};

export default PrizePoolData;

