// import * as WeatherForecasts from './WeatherForecasts';
// import * as Counter from './Counter';
import * as Random from './Random';

export const reducers = {
  random: Random.reducer
};

export default {
  reducers() {
    return reducers;
  } // weatherForecasts: WeatherForecasts.reducer
};
