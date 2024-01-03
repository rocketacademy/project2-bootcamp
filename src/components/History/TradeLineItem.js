const TradeLineItem = (props) => {
  return (
    <div className="trade-line">
      <p className="trade-info mb-0">{props.stockName}</p>
      <p className="trade-info mb-0">{props.stockCode}</p>
      <p className="trade-info mb-0">
        {new Date(props.tradeTime).toLocaleDateString("en-GB")}
      </p>
      <p className="trade-info mb-0">{props.tradePrice}</p>
      <p className="trade-info mb-0">{props.platform}</p>
    </div>
  );
};

export default TradeLineItem;
