const { createPool } = require("mysql");
const db = require("../../config.json");

const pool = createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
  connectionLimit: db.connectionLimit,
  port: db.port,
});

const getDistanceinKM = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius in KM

  const a =
    Math.sin(((lat2 - lat1) * Math.PI) / 180 / 2) *
      Math.sin(((lat2 - lat1) * Math.PI) / 180 / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat1 * Math.PI) / 180) *
      Math.sin(((lon2 - lon1) * Math.PI) / 180 / 2) *
      Math.sin(((lon2 - lon1) * Math.PI) / 180 / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d.toFixed(2);
};

let kitra = {};

kitra.getAll = (params) => {
  return new Promise((resolve, reject) => {
    if (!params.latitude || !params.longitude || !params.distance)
      return resolve(
        "Invalid input. Latitude, Longitude, and distance are required"
      );
    let d1 = Number(params.distance.replace(/\D/g, ""));
    if (d1 > 10 || d1 < 1)
      return resolve("Invalid distance. Distance only accepts 1km or 10km");
    let prize = null;
    if (params.prize) {
      prize = Number(params.prize.replace(/[^0-9a-zA-Z.]/g, ""));
      if (prize % 1 != 0 || prize < 10 || prize > 30) {
        return resolve(
          "Prize must not have decimal value and prize range should be from $10 - $30"
        );
      }
    }
    pool.query(
      `select money_values.treasure_id,treasures.latitude,treasures.longitude,treasures.name,money_values.amt from treasures,money_values where treasures.id=money_values.treasure_id`,
      (err, results) => {
        results = results.filter((d, index) => {
          let distance = getDistanceinKM(
            params.latitude,
            params.longitude,
            d.latitude,
            d.longitude
          );
          return prize == null
            ? distance <= d1
            : distance <= d1 && d.amt <= prize;
        });

        results = results.sort((a, b) => a.amt - b.amt);
        const removeDup = (arr) => {
          const filt = arr.filter((a, b) => {
            return (
              b ===
              arr.findIndex((other) => a.treasure_id === other.treasure_id)
            );
          });
          return filt;
        };
        results = removeDup(results);
        results = results.sort((a, b) => a.treasure_id - b.treasure_id);
        return err ? reject(err) : resolve(results);
      }
    );
  });
};

kitra.getNearHigh = (params) => {
  return new Promise((resolve, reject) => {
    if (!params.latitude || !params.longitude || !params.distance)
      return resolve(
        "Invalid input. Latitude, Longitude, and distance are required"
      );
    let d1 = Number(params.distance.replace(/\D/g, ""));
    if (d1 > 10 || d1 < 1)
      return resolve("Invalid distance. Distance only accepts 1km or 10km");

    pool.query(
      `select money_values.treasure_id,treasures.latitude,treasures.longitude,treasures.name,money_values.amt from treasures,money_values where treasures.id=money_values.treasure_id`,
      (err, results) => {
        results = results.filter((d, index) => {
          let distance = getDistanceinKM(
            params.latitude,
            params.longitude,
            d.latitude,
            d.longitude
          );
          d["distance_in_km"] = distance;
          return distance <= d1;
        });

        results.sort((a, b) => {
          return (
            a.distance_in_km.localeCompare(b.distance_in_km) || b.amt - a.amt
          );
        });

        for (let x = 0; x < results.length; x++) {
          for (let y = x + 1; y < results.length; y++) {
            if (results[x].name == results[y].name) {
              results[y].amt = results[x].amt + results[y].amt;
              results[x] = results[y];
              results.splice(y, 1);
            }
          }
        }
        return err ? reject(err) : resolve(results[0]);
      }
    );
  });
};
module.exports = kitra;
