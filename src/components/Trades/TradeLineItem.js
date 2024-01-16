const TradeLineItem = (props) => {
  return (
    <div className="trade-line">
      <p className="trade-info mb-0">{props.val.stockName}</p>
      <p className="trade-info mb-0">{props.val.stockCode}</p>
      <p className="trade-info mb-0">
        {new Date(props.val.date).toLocaleDateString("en-GB")}
      </p>
      <p className="trade-info mb-0">{props.val.price + props.val.currency}</p>
      <p className="trade-info mb-0">{props.val.platform}</p>
      <p className="trade-info mb-0" onClick={() => props.handleDel(props.uid)}>
        del
      </p>
    </div>
  );
};

export default TradeLineItem;
