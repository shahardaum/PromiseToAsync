// function getCountryPopulation(country) {
//   return new Promise((resolve, reject) => {
//     const url = `https://countriesnow.space/api/v0.1/countries/population`;
//     const options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ country }),
//     };
//     fetch(url, options)
//       .then((res) => res.json())
//       .then((json) => {
//         if (json?.data?.populationCounts)
//           resolve(json.data.populationCounts.at(-1).value);
//         else reject(new Error(`My Error: no data for ${country}`)); //app logic error message
//       })
//       .catch((err) => reject(err)); // network error - server is down for example...
//     // .catch(reject)  // same same, only shorter...
//   });
// }
async function getCountryPopulation(country) {
  try {
    const url = `https://countriesnow.space/api/v0.1/countries/population`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country }),
    };
    let res = await fetch(url, options);
    let json = await res.json();
    if (json?.data?.populationCounts) {
      return json.data.populationCounts.at(-1).value;
    } else {
      throw new Error(`My Error: no data for ${country}`);
    }
  } catch (err) {
    throw err;
  }
}
//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------
// function manual() {
//   getCountryPopulation("France")
//     .then((population) => {
//       console.log(`population of France is ${population}`);
//       return getCountryPopulation("Germany");
//     })
//     .then((population) => console.log(`population of Germany is ${population}`))
//     .catch((err) => console.log("Error in manual: ", err.message));
// }
async function manual() {
  try {
    let population = await getCountryPopulation("France");
    console.log(`population of France is ${population}`);
    population = await getCountryPopulation("Germany");
    console.log(`population of Germany is ${population}`);
  } catch (err) {
    console.log("Error in manual: ", err.message);
  }
}
// manual();

//------------------------------
//   Sequential processing
//------------------------------
const countries = [
  "France",
  "Russia",
  "Germany",
  "United Kingdom",
  "Portugal",
  "Spain",
  "Netherlands",
  "Sweden",
  "Greece",
  "Czechia",
  "Romania",
  "Israel",
];
async function parallel() {
  try {
    const pendinPromises = countries.map((country) =>
      getCountryPopulation(country)
    );
    const results = await Promise.allSettled(pendinPromises);
    results.forEach((res, i) => {
      if (res.status === "fulfilled") {
        console.log(`population of ${countries[i]} is ${res.value}`);
      } else if (res.status === "rejected") {
        console.log(`population of ${countries[i]} is ${res.reason}`);
      }
    });
  } catch (err) {
    console.log("error is paralel:", err);
  }
}
// parallel();
// function parallel() {
//   Promise.map(countries, (country) => {
//     return (
//       getCountryPopulation(country)
//         //   .then((population) => {
//         //     console.log(`population of ${country} is ${population}`);
//         //   })
//         .catch((err) => console.error(`${country} failed: ${err.message}`))
//     );
//   }).then((populations) => {
//     console.log(`Got populations for ALL countries!`);
//     // console.log(`countries: ${populations}`);
//     populations.forEach((population, i) =>
//       console.log(`population of ${countries[i]} is ${population}`)
//     );
//   });
// }

// function sequence() {
//   Promise.each(countries, (country) => {
//     return getCountryPopulation(country)
//       .then((population) =>
//         console.log(`population of Germany is ${population}`)
//       )
//       .catch((err) => console.log("Error in manual: ", err.message));
//   })
//     .then((countries) => {
//       console.log(`got population for all counties!`);
//       console.log(`countries: ${countries}`);
//     })
//     .catch((err) => console.log("Error in sequence: ", err.message));
// }
async function sequence() {
  try {
    for (const country of countries) {
      let population = await getCountryPopulation(country).catch((err) =>
        console.log("Error in manual: ", err.message)
      );
      console.log(`population of ${country} is ${population}`);
    }
    console.log(`all done!`);
  } catch (err) {
    console.log("Error in manual: ", err.message);
  }
}
//   Promise.each(countries, (country) => {
//     return getCountryPopulation(country)
//       .then((population) =>
//         console.log(`population of Germany is ${population}`)
//       )
//       .catch((err) => console.log("Error in manual: ", err.message));
//   })
//     .then((countries) => {
//       console.log(`got population for all counties!`);
//       console.log(`countries: ${countries}`);
//     })
//     .catch((err) => console.log("Error in sequence: ", err.message));
// }
sequence();

//--------------------------------------------------------
//  Parallel processing
//--------------------------------------------------------
