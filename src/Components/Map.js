import { Loader } from "@googlemaps/js-api-loader";

const apiOptions = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
};

const loader = new Loader(apiOptions);

export default function Map() {
  loader.load().then(() => {
    console.log("Maps JS API loaded");
  });

  return <div>Map</div>;
}
