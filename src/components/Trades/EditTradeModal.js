import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Firebase
import { ref, update } from "firebase/database";
import { database } from "../../firebase.js";
import { auth } from "../../firebase.js";

// CSS
import "./AddTradeLineItem.css";

const TRADES_KEY = "trades";

const EditTradeModal = (props) => {
  const [user, setUser] = useState("noUser");
  const [userDisplayName, setUserDisplayName] = useState("noUserDisplayName");
  const [nameField, setNameField] = useState("");
  const [codeField, setCodeField] = useState("");
  const [buySellField, setBuySellField] = useState("Buy");
  const [dateField, setDateField] = useState("");
  const [priceField, setPriceField] = useState("");
  const [currencyField, setCurrencyField] = useState("");
  const [platformField, setPlatformField] = useState("");
  const [editFields, setEditFields] = useState(<div></div>);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (auth.currentUser === null) {
        setUser("noUser");
        setUserDisplayName("noUserDisplayName");
      } else {
        setUser(auth.currentUser.uid);
        setUserDisplayName(auth.currentUser.displayName);
      }
    });
    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    const fieldList = [
      {
        header: "Stock Name",
        type: "text",
        value: nameField,
        setter: setNameField,
      },
      {
        header: "Stock Code",
        type: "text",
        value: codeField,
        setter: setCodeField,
      },
      {
        header: "Buy or Sell?",
        value: buySellField,
        setter: setBuySellField,
      },
      {
        header: "Date of Purchase",
        type: "date",
        value: dateField,
        setter: setDateField,
      },
      {
        header: "Purchase Price",
        type: "number",
        value: priceField,
        setter: setPriceField,
      },
      {
        header: "Currency",
        type: "text",
        value: currencyField,
        setter: setCurrencyField,
      },
      {
        header: "Platform",
        type: "text",
        value: platformField,
        setter: setPlatformField,
      },
    ];
    const editFields = fieldList.map((item) => (
      <Form.Group controlId="date" bssize="large" key={item.header}>
        <Form.Label>{item.header}</Form.Label>
        {item.type ? (
          <Form.Control
            defaultValue={item.value}
            type={item.type}
            onChange={(e) => handleChange(e, item.setter)}
          />
        ) : (
          <select
            className="action-select"
            value={item.value}
            onChange={(e) => handleChange(e, item.setter)}
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        )}
      </Form.Group>
    ));
    setEditFields(editFields);
  }, [
    nameField,
    codeField,
    buySellField,
    dateField,
    priceField,
    currencyField,
    platformField,
  ]);

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const setFields = () => {
    const date = new Date(props.trade.val.date);
    setNameField(props.trade.val.stockName);
    setCodeField(props.trade.val.stockCode);
    setBuySellField(props.trade.val.action);
    setDateField(
      `${date.toLocaleDateString("en-GB", {
        year: "numeric",
      })}-${date.toLocaleDateString("en-GB", {
        month: "numeric",
      })}-${date.toLocaleDateString("en-GB", { day: "numeric" })}`
    );
    setPriceField(props.trade.val.price);
    setCurrencyField(props.trade.val.currency);
    setPlatformField(props.trade.val.platform);
  };

  const resetFields = () => {
    setNameField("");
    setCodeField("");
    setBuySellField("");
    setDateField("");
    setPriceField("");
    setCurrencyField("");
    setPlatformField("");
  };

  const handleClose = () => {
    resetFields();
    props.close();
  };

  const editTrade = () => {
    const tradeDate = new Date(dateField) - 0;
    const updatedTrade = {
      stockCode: codeField,
      stockName: nameField,
      action: buySellField,
      date: tradeDate,
      price: priceField,
      currency: currencyField,
      platform: platformField,
    };
    const tradeRef = ref(database, `${user}/${TRADES_KEY}/${props.trade.key}`);
    update(tradeRef, updatedTrade).then(() => {
      let newTradesArr = props.tradesArr;
      for (let i = 0; i < newTradesArr.length; i++) {
        if (newTradesArr[i].key === props.trade.key) {
          newTradesArr.splice(i, 1);
          newTradesArr.push({ key: props.trade.key, val: updatedTrade });
          props.setTradesArr([...newTradesArr]);
          break;
        }
      }
      props.close();
    });
  };
  return (
    <Modal show={props.show} onHide={handleClose} onShow={setFields}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Trade</Modal.Title>
      </Modal.Header>
      <Modal.Body className="input-fields-container">{editFields}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={editTrade}>
          Edit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTradeModal;
