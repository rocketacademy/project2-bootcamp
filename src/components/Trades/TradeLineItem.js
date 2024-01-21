const TradeLineItem = (props) => {
  return (
    <div className="trade-line">
      <p className="trade-info mb-0">{props.val.stockName}</p>
      <p className="trade-info mb-0">{props.val.stockCode}</p>
      <p className="trade-info mb-0">{props.val.action}</p>
      <p className="trade-info mb-0">
        {new Date(props.val.date).toLocaleDateString("en-GB")}
      </p>
      <p className="trade-info mb-0">{props.val.price + props.val.currency}</p>
      <p className="trade-info mb-0">{props.val.platform}</p>
      <p className="trade-info mb-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="red"
          className="w-3 h-3"
          style={{
            width: "25px",
            height: "25px",
          }}
          onClick={() => props.handleDel(props.uid)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
        <svg
          width="25px"
          height="25px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#000000"
          stroke-width="1.5"
          onClick={() => props.handleEdit({ key: props.uid, val: props.val })}
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M12.2424 20H17.5758M4.48485 16.5L15.8242 5.25607C16.5395 4.54674 17.6798 4.5061 18.4438 5.16268V5.16268C19.2877 5.8879 19.3462 7.17421 18.5716 7.97301L7.39394 19.5L4 20L4.48485 16.5Z"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </p>
    </div>
  );
};

export default TradeLineItem;
