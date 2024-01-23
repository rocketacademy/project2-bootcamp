import React, { useEffect, useState } from "react";
import axios from "axios";

const News = () => {
  // const [NewsArticles, setNewsArticles] = useState([]);
  const [polygonNews, setNews] = useState([]);
  // async function GetNewsArticles() {
  //   const response = await fetch(
  //     "https://newsapi.org/v2/everything?q=finance&from=2024-01-12&sortBy=publishedAt&apiKey=bf56f1217d1e4d048c67722c005ee4be"
  //   );
  //   const data = await response.json();
  //   setNewsArticles(data.articles);
  // }

  async function getnews() {
    // const options = {
    //   method: "GET",
    //   url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-popular-watchlists",
    //   headers: {
    //     "X-RapidAPI-Key": "d6da08cc1fmsh2ffc0e825183be8p1c8245jsn3ba9199a4d47",
    //     "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    //   },
    // };

    try {
      const response = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=tsla&apikey=HYYWPKPI7YSU0TXJ`
      );
      // console.log(response.data.finance.result[0]);
      setNews(response?.data?.feed);
      // console.log(response?.data?.feed);
      // console.log(response.data.finance.result[0].portfolios);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    // GetNewsArticles();
    getnews();
  }, []);

  const slicedNews = polygonNews?.slice(4, 7);

  return (
    <div className="flex flex-row justify-content-center align-items-center py-5  flex-wrap">
      {polygonNews &&
        slicedNews?.map((news, i) => (
          <div key={i} className="p-2">
            <div className="card " style={{ width: "18rem", height: "30rem" }}>
              <img
                className="card-img-top"
                src={news?.banner_image}
                alt="News Card image"
                style={{ width: "100%", height: "12rem" }}
              />
              <div className="card-body">
                <p className="text-secondary text-start">
                  {/* {new Date(news?.time_published)} */}
                  {/* {new Date(news?.time_published).toDateString()} */}
                </p>
                <h5 className="card-title text-start">
                  {news?.title?.substr(0, 70)}
                </h5>
                <p className="card-text  text-start">
                  {news?.summary?.substr(0, 90)}....
                </p>
                <a href={news?.url} target="_blank" className="btn btn-primary">
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default News;
