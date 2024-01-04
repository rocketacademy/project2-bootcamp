const apiResponse = await fetch(
  `https://www.dictionaryapi.com/api/v3/references/spanish/json/${currentCard.english}?key=b62458ec-20b6-4fc4-a681-0e682a4ea74e`
);
if (apiResponse.ok) {
  const apiData = await apiResponse.json();
  console.log(apiData[0].hwi.prs[0].sound.audio);
https://media.merriam-webster.com/audio/prons/es/me/mp3/p/pajama02.mp3
}
