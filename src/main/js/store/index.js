// import * as WeatherForecasts from './WeatherForecasts';
// import * as Counter from './Counter';
import * as UserStatistics from './UserStatistics';

export const reducers = {
  userStatistics: UserStatistics.reducer
};

export default {
  reducers() {
    return reducers;
  } // weatherForecasts: WeatherForecasts.reducer
};
