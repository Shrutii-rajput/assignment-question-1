import { useState } from "react";

// Data
import mockData from "../assets/data.json";
import timestamps from "../assets/timeStamps.json";

// Components
import Dropdown from "../component/dropdown/Dropdown";
import HeaderTitle from "../component/header-title/HeaderTitle";
import Search from "../component/search/Search";
import List from "../component/list/List";

// Styles
import styles from "./Dashboard.module.css";
import Card from "../component/card/Card";

const Dashboard = () => {
  const [currency, setCurrency] = useState("EUR");
  const [searchText, setSearchText] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState({
    buySellIndicator: '',
    orderStatus: '',
    orderType: '',
  });
  const [selectedOrderTimeStamps, setSelectedOrderTimeStamps] = useState({
    orderReceived: '',
    orderStatusUpdated: '',
    orderSubmitted: '',
  });

  const combinedData = mockData.results.map(order => {
    const { "&id":id, ...rest } = order;
    const timestampsData = timestamps.results.find(item => item["&id"] === id);
    const submittedDate = timestampsData.timestamps.orderSubmitted;
    const recievedDate = timestampsData.timestamps.orderRecieved;
    const updatedDate = timestampsData.timestamps.orderStatusUpdated;
    return {
      ...rest,
      id,
      submittedDate,
      recievedDate,
      updatedDate,
    };
  });

  const filteredData = combinedData.filter(order => order.id.toLowerCase().includes(searchText.toLowerCase()));

  const handleOrderDetails = (row) => {
    const orderDetails = {
      buySellIndicator: row.executionDetails.buySellIndicator,
      orderStatus: row.executionDetails.orderStatus,
      orderType: row.executionDetails.orderType,
    };
    setSelectedOrderDetails(orderDetails);

    const orderTimeStamps = {
      orderReceived: row.timestamps.orderReceived,
      orderStatusUpdated: row.timestamps.orderStatusUpdated,
      orderSubmitted: row.timestamps.orderSubmitted,
    };
    setSelectedOrderTimeStamps(orderTimeStamps);
  }

  return (
    <div>
      <div className={styles.header}>
        <HeaderTitle primaryTitle="Orders" secondaryTitle={`${mockData.results.length} Orders`} />
        <div className={styles.actionBox}>
          <Search
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Dropdown
            options={["GBP", "USD", "JPY", "EUR"]}
            onChange={(e) => setCurrency(e.target.value)}
            selectedItem={currency}
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <Card
            cardData={selectedOrderDetails}
            title="Selected Order Details"
          />
          <Card
            cardData={selectedOrderTimeStamps}
            title="Selected Order Timestamps"
          />
        </div>
        <List rows={filteredData} selectedItem={currency} orderDetails={handleOrderDetails} />
      </div>
    </div>
  );
};

export default Dashboard;
