import React, { useEffect, useState } from "react";

const News = () => {
  const [NewsArticles, setNewsArticles] = useState([]);
  async function GetNewsArticles() {
    const response = await fetch(
      "https://newsapi.org/v2/everything?q=motivation&from=2024-01-04&sortBy=publishedAt&apiKey=bf56f1217d1e4d048c67722c005ee4be"
    );
    const data = await response.json();
    setNewsArticles(data.articles);
  }
  useEffect(() => {
    GetNewsArticles();
  }, []);

  const slicedNews = NewsArticles?.slice(0, 3);

  return (
    <div className="flex flex-row justify-content-center align-items-center py-5  flex-wrap">
      {NewsArticles &&
        slicedNews?.map((news, i) => (
          <div key={i} className="p-2">
            <div className="card " style={{ width: "18rem", height: "30rem" }}>
              <img
                className="card-img-top"
                src={news?.urlToImage}
                alt="News Card image"
                style={{ width: "100%", height: "12rem" }}
              />
              <div className="card-body">
                <p className="text-secondary text-start">
                  {/* {new Date(news?.publishedAt)} */}
                  {new Date(news?.publishedAt).toDateString()}
                </p>
                <h5 className="card-title text-start">
                  {news?.title?.substr(0, 60)} ....
                </h5>
                <p className="card-text  text-start">
                  {news?.description?.substr(0, 90)}
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
